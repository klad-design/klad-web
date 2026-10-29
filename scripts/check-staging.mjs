import assert from 'node:assert/strict'
import { mkdir, writeFile } from 'node:fs/promises'
import process from 'node:process'

import { chromium, firefox, webkit } from 'playwright'

import { isCanceledRoutePrefetch, replaceDocument } from './document-test-navigation.mjs'

const baseURL = process.env.STAGING_URL || 'http://127.0.0.1:3100'
const browserType = { chromium, firefox, webkit }[process.env.STAGING_BROWSER || 'chromium']
assert.ok(browserType, 'STAGING_BROWSER must be chromium, firefox or webkit')
const browser = await browserType.launch()
const errors = []
const artifacts = `artifacts/staging/${browserType.name()}`
await mkdir(artifacts, { recursive: true })

try {
  for (const width of [1440, 768, 390, 320]) {
    const context = await browser.newContext({ baseURL, viewport: { width, height: 900 }, hasTouch: width < 1024 })
    const page = await context.newPage()
    page.setDefaultTimeout(30000)
    page.on('pageerror', (error) => {
      if (!isCanceledRoutePrefetch(page, error))
        errors.push(`${page.url()}: ${error.stack || error.message}`)
    })
    page.on('console', (message) => {
      if (message.type() === 'error' && /hydration|cannot update/i.test(message.text()))
        errors.push(message.text())
    })
    console.log(`${browserType.name()}: ${width}px home`)
    const response = await replaceDocument(page, () => page.goto(`${baseURL}/`))
    assert.equal(response.status(), 200)
    assert.match(response.headers()['x-robots-tag'] || '', /noindex/, 'Use a staging build for this check')
    await page.waitForFunction(() => document.fonts.status === 'loaded' && document.querySelector('[data-logo-mode="scroll"] svg'))
    // ScrollTrigger's startup window bypasses scrub interpolation.
    await page.waitForTimeout(600)
    assert.equal(await page.locator('[aria-label="[object Object]"]').count(), 0)
    assert.equal(await page.locator('#team').count(), 1)
    if (width >= 768)
      assert.equal(await page.locator('.p5').first().evaluate(el => getComputedStyle(el).fontSize), '10px')

    const heading = page.locator('h1 .textBlur').first()
    const headingValue = () => heading.evaluate(el => Number(getComputedStyle(el).getPropertyValue('--value')))
    const settledScroll = () => page.waitForFunction((sample) => {
      sample.stable = sample.y === scrollY && !document.documentElement.classList.contains('lenis-smooth') ? sample.stable + 1 : 0
      sample.y = scrollY
      return sample.stable >= 4
    }, { y: null, stable: 0 })
    const settledHeadingValue = async () => {
      await page.waitForFunction((sample) => {
        const value = Number(document.querySelector('h1 .textBlur').style.getPropertyValue('--value'))
        sample.stable = sample.value === value ? sample.stable + 1 : 0
        sample.value = value
        return sample.stable >= 4
      }, { value: null, stable: 0 })
      return headingValue()
    }
    await settledScroll()
    await settledHeadingValue()
    assert.equal(await headingValue(), 0, `Heading must start without scroll trails at ${width}px`)
    await page.evaluate(() => window.scrollTo(0, 80))
    await page.waitForFunction(() => Number(document.querySelector('h1 .textBlur').style.getPropertyValue('--value')) < -1)
    const refreshingBlur = await page.evaluate(async (refresh) => {
      window.scrollTo(0, 0)
      if (!refresh)
        return null
      await new Promise(requestAnimationFrame)
      const value = Number(document.querySelector('h1 .textBlur').style.getPropertyValue('--value'))
      // Exercise GSAP's global refresh while the return scrub is still running.
      window.dispatchEvent(new Event('load'))
      return value
    }, width === 768)
    if (width === 768)
      assert.ok(refreshingBlur < 0, 'The refresh regression must interrupt an unfinished heading transition')
    await page.waitForFunction(() => scrollY === 0 && Number(document.querySelector('h1 .textBlur').style.getPropertyValue('--value')) === 0)
    assert.equal(await headingValue(), 0, 'Returning to the top must reset heading trails')

    if (width === 1440) {
      const reloadRestored = async (label) => {
        await settledScroll()
        await settledHeadingValue()
        const before = await page.evaluate(() => scrollY)
        await page.evaluate(() => {
          const state = () => ({ y: scrollY, limit: document.documentElement.scrollHeight - innerHeight, classes: document.documentElement.className, fonts: document.fonts.status, history: history.scrollRestoration })
          sessionStorage.setItem('smoke-before-reload', JSON.stringify(state()))
          addEventListener('pagehide', () => sessionStorage.setItem('smoke-pagehide', JSON.stringify(state())), { once: true })
        })
        await replaceDocument(page, () => page.reload())
        await page.waitForFunction(() => document.fonts.status === 'loaded')
        await page.waitForFunction(() => document.querySelector('[data-logo-mode="scroll"] svg'))
        try {
          await page.waitForFunction(expected => Math.abs(scrollY - expected) <= 2, before)
        }
        catch (error) {
          console.error(label, await page.evaluate(() => ({ before: sessionStorage.getItem('smoke-before-reload'), pagehide: sessionStorage.getItem('smoke-pagehide'), y: scrollY, limit: document.documentElement.scrollHeight - innerHeight, classes: document.documentElement.className, fonts: document.fonts.status, history: history.scrollRestoration })))
          await page.screenshot({ path: `${artifacts}/reload-failure.png` })
          throw error
        }
        await page.waitForTimeout(1500)
        assert.ok(Math.abs(await page.evaluate(() => scrollY) - before) <= 2, `${label}: reload must retain the native scroll position`)
        const restoredBlur = await settledHeadingValue()
        await page.evaluate(() => window.scrollTo(0, 0))
        await page.waitForFunction(() => scrollY === 0 && Number(document.querySelector('h1 .textBlur').style.getPropertyValue('--value')) === 0)
        assert.equal(await headingValue(), 0, `${label}: the top must have no heading trails`)
        await page.evaluate(y => window.scrollTo(0, y), before)
        await page.waitForFunction(expected => Math.abs(scrollY - expected) <= 2, before)
        const normalBlur = await settledHeadingValue()
        assert.ok(Math.abs(restoredBlur - normalBlur) < 1, `${label}: restored heading blur must match a normal scroll to the same position`)
      }

      await page.mouse.wheel(0, -200)
      await page.waitForFunction(() => scrollY > document.documentElement.scrollHeight - innerHeight - 300)
      await page.waitForTimeout(1200)
      await page.waitForFunction(() => Number(document.querySelector('.home-loop h1 .textBlur').style.getPropertyValue('--value')) < -1)
      assert.ok(await page.locator('.home-loop h1 .textBlur').evaluate(el => Number(el.style.getPropertyValue('--value'))) < -1, 'Scrolling up from the initial hero must animate the loop heading')
      await settledScroll()
      const reverseDelta = await page.evaluate(() => document.documentElement.scrollHeight - innerHeight - scrollY + 100)
      await page.mouse.wheel(0, reverseDelta)
      await page.waitForFunction(() => scrollY < 200)
      await page.waitForTimeout(1200)
      await page.waitForFunction(() => Number(document.querySelector('h1 .textBlur').style.getPropertyValue('--value')) < -1)
      assert.ok(await headingValue() < -1, 'Reversing down across the loop must preserve heading trails')
      await reloadRestored('After a reverse loop')

      const member = page.locator('.memberLink').last()
      await member.scrollIntoViewIfNeeded()
      await member.focus()
      await member.press('Enter')
      await page.waitForFunction(() => document.querySelector('.memberLink.button--active')?.textContent?.includes('Dasha'))
      await page.waitForFunction(() => !document.documentElement.classList.contains('lenis-smooth'))
      await page.waitForTimeout(1200)
      await page.screenshot({ path: `${artifacts}/team-desktop.png` })

      await page.locator('.memberLink').nth(1).click()
      await page.waitForFunction(() => document.querySelector('.memberLink.button--active')?.textContent?.includes('Lena S'))
      await page.waitForTimeout(2300)
      const teamTextState = () => page.locator('#team').evaluate(section => ({
        active: [...section.querySelectorAll('.memberLink')].findIndex(link => link.classList.contains('button--active')),
        opacity: [...section.querySelectorAll('.memberDescription')].map(el => Number(getComputedStyle(el).opacity)),
      }))
      const beforeTab = await teamTextState()
      assert.equal(beforeTab.active, 1)
      assert.ok(beforeTab.opacity[0] < 0.1 && beforeTab.opacity.slice(1).every(value => value > 0.99), 'Only the earlier biography should be faded')
      await page.evaluate(() => document.dispatchEvent(new Event('visibilitychange')))
      await page.waitForTimeout(100)
      assert.deepEqual(await teamTextState(), beforeTab, 'Returning to the tab must preserve the selected member and text states')

      assert.equal(await page.locator('.team-track').evaluate(el => getComputedStyle(el).clipPath), 'none')
      assert.equal(await page.locator('.home-loop').evaluate(el => getComputedStyle(el).overflow), 'visible')
      await reloadRestored('From the selected Team member')
      for (const theme of ['dark', 'light']) {
        await page.waitForFunction(() => !document.documentElement.classList.contains('lenis-smooth'))
        await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight - innerHeight - 300))
        await page.waitForFunction(expected => document.documentElement.dataset.theme === expected, theme)
        await page.waitForTimeout(400)
        assert.equal(await page.locator('html').getAttribute('data-theme'), theme, 'The loop theme must persist')
        await page.screenshot({ path: `${artifacts}/loop-${theme}.png` })
        await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight - innerHeight - 100))
        await page.waitForTimeout(300)
        await page.waitForFunction(() => Number(document.querySelector('.home-loop h1 .textBlur').style.getPropertyValue('--value')) < -1)
        await page.waitForFunction(() => !document.documentElement.classList.contains('lenis-smooth') && Math.abs(scrollY - (document.documentElement.scrollHeight - innerHeight - 100)) <= 2)
        assert.ok(await page.locator('.home-loop h1 .textBlur').evaluate(el => Number(el.style.getPropertyValue('--value'))) < -1, 'The repeated hero must animate before the loop wraps')
        const recording = page.evaluate(() => new Promise((resolve) => {
          const frames = []
          const end = performance.now() + 10000
          let wrappedAt = 0
          const timeout = setTimeout(resolve, 10000, frames)
          function sample() {
            const map = document.querySelector('section .grid-container .textBlur')
            const heading = document.querySelectorAll('h1 .textBlur')[scrollY > (document.documentElement.scrollHeight - innerHeight) / 2 ? 1 : 0]
            frames.push({ time: performance.now(), y: scrollY, value: Number(map.style.getPropertyValue('--value')), heading: Number(heading.style.getPropertyValue('--value')) })
            if (!wrappedAt && frames.length > 1 && frames.at(-2).y - scrollY > 1000)
              wrappedAt = performance.now()
            if (performance.now() < end && (!wrappedAt || performance.now() - wrappedAt < 1600)) {
              requestAnimationFrame(() => setTimeout(sample, 0))
            }
            else {
              clearTimeout(timeout)
              resolve(frames)
            }
          }
          sample()
        }))
        await page.mouse.wheel(0, 200)
        const frames = await recording
        const wrap = frames.findIndex((frame, index) => index > 0 && frames[index - 1].y - frame.y > 1000)
        assert.ok(wrap > 0, `Wheel scrolling must wrap back to the hero: ${JSON.stringify({ count: frames.length, first: frames.slice(0, 3), last: frames.slice(-3) })}`)
        assert.equal(frames[wrap].value, 0, `Map layers must already align on the first frame after wrapping: ${JSON.stringify(frames.slice(Math.max(0, wrap - 2), wrap + 3))}`)
        assert.ok(frames[wrap].heading < -1, 'The active heading trail must survive the wrap')
        // A delayed render can span several 60 Hz frames.
        const maxChange = 5 * Math.max(1, (frames[wrap].time - frames[wrap - 1].time) / (1000 / 60))
        assert.ok(Math.abs(frames[wrap].heading - frames[wrap - 1].heading) < maxChange, `Heading trails must stay continuous across the loop: ${JSON.stringify(frames.slice(Math.max(0, wrap - 2), wrap + 3))}`)
        assert.equal(await page.locator('html').getAttribute('data-theme'), theme)
      }

      await settledScroll()
      await page.evaluate(() => window.scrollTo(0, 2200))
      await page.waitForFunction(() => Math.abs(scrollY - 2200) <= 2)
      await reloadRestored('From the middle of the homepage')
      console.log(`${browserType.name()}: native history restoration`)
      const beforeBack = await page.evaluate(() => scrollY)
      await page.getByRole('link', { name: 'Work', exact: true }).click()
      await page.waitForURL('**/work')
      await page.locator('h1').filter({ hasText: 'Datalane' }).waitFor()
      await page.locator('[data-logo-mode="autoplay"] svg').waitFor()
      await page.goBack()
      await page.waitForURL(`${baseURL}/`)
      await page.waitForFunction(expected => Math.abs(scrollY - expected) <= 2, beforeBack)
      await page.waitForFunction(() => Number(document.querySelector('h1 .textBlur').style.getPropertyValue('--value')) === -75)
      assert.ok(Math.abs(await page.evaluate(() => scrollY) - beforeBack) <= 2, 'Back must restore the homepage scroll position')
      assert.equal(await headingValue(), -75, 'Back must restore heading trails for the current position')
    }

    console.log(`${browserType.name()}: ${width}px portfolio and navigation`)
    await replaceDocument(page, () => page.goto(`${baseURL}/work`))
    await page.waitForFunction(() => document.fonts.status === 'loaded')
    await page.waitForTimeout(600)
    assert.equal(await page.getByRole('button', { name: 'Datalane' }).count(), 1)
    assert.match(await page.locator('h1').textContent(), /Datalane/, 'Datalane must be the default work case')
    const titleFits = await page.locator('h1').evaluate((el) => {
      const range = document.createRange()
      range.selectNodeContents(el.lastElementChild.lastElementChild)
      return range.getBoundingClientRect().right <= window.innerWidth
    })
    assert.ok(titleFits, `Project title is clipped at ${width}px`)
    await page.screenshot({ path: `${artifacts}/work-${width}.png` })

    const circus = page.getByRole('button', { name: 'Circus', exact: true })
    await page.keyboard.press('Tab')
    await circus.focus()
    await page.waitForFunction(() => document.activeElement?.matches(':focus-visible') && getComputedStyle(document.activeElement).outlineWidth === '1px')
    await circus.press('Enter')
    await page.waitForFunction(() => document.querySelector('h1')?.textContent?.includes('Circus'))

    if (width < 768) {
      await page.getByRole('button', { name: 'Menu', exact: true }).click()
      await page.getByRole('dialog').waitFor()
      assert.equal(await page.getByRole('dialog').count(), 1)
      await page.keyboard.press('Escape')
      await page.getByRole('dialog').waitFor({ state: 'hidden' })
      assert.equal(await page.getByRole('dialog').count(), 0)
    }

    await replaceDocument(page, () => page.goto(`${baseURL}/process`))
    assert.equal(await page.locator('[aria-hidden] a:not([inert] a)').count(), 0, 'Decorative links must be inert')
    assert.ok(!(await page.locator('meta[property="og:image"]').getAttribute('content')).includes('localhost'))

    await replaceDocument(page, () => page.goto(`${baseURL}/work/stars-honey`))
    await page.waitForFunction(() => document.documentElement.dataset.theme === 'dark')
    assert.ok(await page.locator('video[src]').count() <= 1, 'Offscreen videos should not all load at once')
    const video = page.locator('video').first()
    await video.scrollIntoViewIfNeeded()
    await page.waitForFunction(() => !!document.querySelector('video')?.getAttribute('src'))
    assert.equal(await video.evaluate(el => el.controls), false)
    assert.ok(await video.getAttribute('poster'))
    assert.ok((await page.request.get(await page.locator('link[rel="icon"]').first().getAttribute('href'))).ok())

    await page.getByRole('link', { name: 'Close', exact: true }).filter({ visible: true }).first().click()
    await page.waitForFunction(() => document.documentElement.dataset.theme === 'light')
    if (width >= 1024) {
      for (let visit = 0; visit < 3; visit++) {
        await page.getByRole('link', { name: 'About', exact: true }).click()
        await page.waitForURL(`${baseURL}/`)
        await page.waitForTimeout(300)
        assert.equal(await page.locator('html').getAttribute('data-theme'), 'light')
        await page.getByRole('link', { name: 'Work', exact: true }).click()
        await page.waitForURL(`${baseURL}/work`)
      }
    }
    await context.close()
  }

  console.log(`${browserType.name()}: reduced motion`)
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' })
  const page = await context.newPage()
  page.setDefaultTimeout(30000)
  await page.goto(`${baseURL}/`)
  await page.waitForTimeout(600)
  const marquee = page.locator('.service').first()
  const before = await marquee.evaluate(el => getComputedStyle(el).transform)
  await page.waitForTimeout(300)
  assert.equal(await marquee.evaluate(el => getComputedStyle(el).transform), before, 'Reduced motion must stop the marquee')
  assert.equal(await page.locator('.team-track').evaluate(el => getComputedStyle(el).flexDirection), 'column')
  assert.equal(await page.locator('.home-loop').evaluate(el => getComputedStyle(el).display), 'none')
  await page.goto(`${baseURL}/work/stars-honey`)
  await page.locator('video').first().scrollIntoViewIfNeeded()
  await page.waitForFunction(() => !!document.querySelector('video')?.getAttribute('src'))
  await page.waitForFunction(() => document.querySelector('video')?.paused && document.querySelector('video')?.controls)
  assert.equal(await page.locator('video').first().evaluate(el => el.paused && el.controls), true, 'Reduced motion keeps manual video playback available')
  const sitemap = await page.request.get(`${baseURL}/sitemap.xml`)
  assert.ok((await sitemap.text()).includes('/work/datalane'), 'Datalane must appear in the sitemap')
  assert.deepEqual(errors, [], 'Browser runtime errors')
  await context.close()
  console.log(`Staging smoke check passed in ${browserType.name()} at 1440, 768, 390 and 320px, including scroll cycles, refresh, keyboard and reduced motion.`)
}
catch (error) {
  console.error('Browser runtime errors:', errors)
  for (const context of browser.contexts()) {
    for (const page of context.pages()) {
      console.error('Motion state:', await page.evaluate(() => {
        const debug = window.__debugMotion
        if (!debug)
          return null
        const lenis = debug.lenisRef.current?.lenis
        return {
          ticker: { frame: debug.gsap.ticker.frame, time: debug.gsap.ticker.time, listeners: debug.gsap.ticker._listeners.length },
          lenis: lenis && { scroll: lenis.scroll, actual: lenis.actualScroll, target: lenis.targetScroll, animated: lenis.animatedScroll, scrolling: lenis.isScrolling, running: lenis.animate.isRunning },
          triggers: debug.ScrollTrigger.getAll().filter(trigger => trigger.trigger?.matches('h1 .textBlur')).map((trigger) => {
            const scrub = trigger.getTween()
            return { start: trigger.start, end: trigger.end, progress: trigger.progress, scroll: trigger.scroll(), animation: trigger.animation.totalProgress(), scrub: scrub && { target: scrub.vars.totalProgress, paused: scrub.paused(), active: scrub.isActive(), progress: scrub.progress(), parent: !!scrub.parent } }
          }),
        }
      }).catch(() => null))
      const state = await page.evaluate(() => ({ url: location.href, y: scrollY, limit: document.documentElement.scrollHeight - innerHeight, classes: document.documentElement.className, fonts: document.fonts.status, headings: [...document.querySelectorAll('h1 .textBlur')].map(element => ({ style: element.style.cssText, value: getComputedStyle(element).getPropertyValue('--value'), top: element.getBoundingClientRect().top, height: element.getBoundingClientRect().height })) })).catch(() => null)
      console.error('Smoke failure state:', state)
      await writeFile(`${artifacts}/failure-state.json`, JSON.stringify(state, null, 2))
      await page.screenshot({ path: `${artifacts}/failure.png` }).catch(() => {})
    }
  }
  throw error
}
finally {
  await browser.close()
}
