import assert from 'node:assert/strict'
import { mkdir } from 'node:fs/promises'
import process from 'node:process'

import { chromium, firefox, webkit } from 'playwright'

const type = { chromium, firefox, webkit }[process.env.STAGING_BROWSER || 'chromium']
const baseURL = process.env.STAGING_URL || 'http://127.0.0.1:3100'
const browser = await type.launch()
const artifacts = `artifacts/work-fixes/${type.name()}`
await mkdir(artifacts, { recursive: true })
const errors = []

async function selected(page, name) {
  await page.waitForFunction(name => document.querySelector('button[aria-pressed="true"]')?.getAttribute('aria-label') === name && document.querySelector('h1')?.textContent.includes(name), name)
  await page.waitForFunction(() => [...document.querySelectorAll('.case-anim-target')].every(el => Number(getComputedStyle(el).opacity) > 0.99))
}

async function noise(page, overMedia) {
  await page.waitForFunction(overMedia => document.documentElement.dataset.theme === (overMedia ? 'light' : 'dark'), overMedia)
  const overlay = await page.evaluate(() => {
    const style = getComputedStyle(document.body, '::after')
    return { display: style.display, opacity: style.opacity, zIndex: Number(style.zIndex) }
  })
  assert.notEqual(overlay.display, 'none', 'Noise must remain on the page background and text')
  assert.equal(overlay.opacity, '0.15')
  if (!overMedia) {
    const media = await page.locator('main img, main video').evaluateAll(elements => elements.map((el) => {
      const style = getComputedStyle(el)
      return { position: style.position, zIndex: Number(style.zIndex), background: style.backgroundColor }
    }))
    assert.ok(media.length > 0 && media.every(el => el.position === 'relative' && el.zIndex > overlay.zIndex && el.background === 'rgb(0, 0, 0)'), 'Case media must cover the noise, including transparent or unloaded areas')
  }
}

try {
  const serverRendered = await browser.newContext({ baseURL, javaScriptEnabled: false })
  const initial = await serverRendered.newPage()
  for (const [query, name] of [['chainviz', 'Chainviz'], ['unknown', 'Datalane'], ['chainviz&case=circus', 'Chainviz']]) {
    await initial.goto(`/work?case=${query}`)
    assert.equal(await initial.getByRole('main').count(), 1, 'Work must expose one main landmark')
    assert.equal(await initial.getByRole('heading', { level: 1, name, exact: true }).count(), 1, 'The requested project must be present before JavaScript runs')
    assert.equal(await initial.getByRole('link', { name: `View ${name} case study` }).count(), 1)
  }
  await serverRendered.close()

  const desktop = await browser.newContext({ baseURL, viewport: { width: 1440, height: 900 } })
  const page = await desktop.newPage()
  page.on('pageerror', error => errors.push(error.message))
  await page.goto('/work')
  await selected(page, 'Datalane')
  await noise(page, true)
  for (const [key, name] of [['ArrowUp', 'Datalane'], ['ArrowDown', 'Circus'], ['ArrowUp', 'Datalane'], ['Shift+ArrowDown', 'Datalane']]) {
    await page.keyboard.press(key)
    await selected(page, name)
    if (key === 'ArrowDown' && name === 'Circus')
      assert.ok(await page.getByRole('button', { name, exact: true }).evaluate(el => el === document.activeElement), 'Arrow navigation must focus the selected project')
  }
  await page.locator('main').dispatchEvent('keydown', { key: 'ArrowDown', repeat: true })
  await selected(page, 'Datalane')
  const cover = await page.getByRole('link', { name: 'View Datalane case study' }).boundingBox()
  await page.mouse.move(cover.x + cover.width / 2, cover.y + cover.height / 2)
  await page.mouse.wheel(0, 40)
  await page.waitForTimeout(250)
  await selected(page, 'Datalane')
  const fade = page.evaluate(async () => {
    let outgoing = false
    let incoming = false
    const deadline = performance.now() + 1500
    while (performance.now() < deadline) {
      const title = document.querySelector('h1').textContent
      const opacity = Number(getComputedStyle(document.querySelector('.case-anim-target')).opacity)
      outgoing ||= title.includes('Datalane') && opacity > 0 && opacity < 0.95
      incoming ||= title.includes('Circus') && opacity > 0 && opacity < 0.95
      if (incoming && title.includes('Circus') && opacity > 0.99)
        break
      await new Promise(resolve => requestAnimationFrame(resolve))
    }
    return { outgoing, incoming }
  })
  await page.mouse.wheel(0, 140)
  await page.waitForFunction(() => document.querySelector('button[aria-pressed="true"]')?.getAttribute('aria-label') === 'Circus')
  await page.mouse.wheel(0, -300)
  await page.evaluate(async () => {
    for (let i = 0; i < 12; i++) {
      document.querySelector('main').dispatchEvent(new WheelEvent('wheel', { deltaY: 80, bubbles: true, cancelable: true }))
      await new Promise(resolve => setTimeout(resolve, 100))
    }
  })
  assert.deepEqual(await fade, { outgoing: true, incoming: true }, 'Wheel selection must fade the outgoing and incoming project')
  await selected(page, 'Circus')
  assert.equal(await page.evaluate(() => scrollY), 0, 'Wheel selection must not move the page when content fits')
  await page.waitForTimeout(250)
  await page.mouse.wheel(0, -140)
  await selected(page, 'Datalane')

  for (const delay of [30, 60]) {
    await page.evaluate(async (delay) => {
      document.querySelector('button[aria-label="Stars+Honey"]').click()
      await new Promise(resolve => setTimeout(resolve, delay))
      document.querySelector('button[aria-label="Datalane"]').click()
    }, delay)
    await selected(page, 'Datalane')
  }

  await page.getByRole('button', { name: 'Chainviz', exact: true }).click()
  await selected(page, 'Chainviz')
  await page.keyboard.press('ArrowDown')
  await selected(page, 'Chainviz')
  await page.getByRole('link', { name: 'View Chainviz case study' }).click()
  await page.waitForURL('**/work/chainviz')
  await noise(page, false)
  await page.locator('main img').first().evaluate(el => el.decode())
  await page.waitForTimeout(250)
  await page.screenshot({ path: `${artifacts}/case-clean-media.png` })
  await page.getByRole('link', { name: 'Close', exact: true }).click()
  await page.waitForURL('**/work?case=chainviz')
  await selected(page, 'Chainviz')
  await noise(page, true)
  await page.goBack()
  await page.waitForURL('**/work/chainviz')
  await page.goBack()
  await selected(page, 'Chainviz')
  await page.reload()
  await selected(page, 'Chainviz')
  await page.getByRole('link', { name: 'Work', exact: true }).click()
  await selected(page, 'Datalane')
  await page.getByRole('link', { name: 'Pricing', exact: true }).click()
  await page.waitForURL('**/pricing')
  await page.getByRole('link', { name: 'Work', exact: true }).click()
  await selected(page, 'Datalane')

  for (const name of ['Datalane', 'Circus', 'Stars+Honey', 'Linux Mint', 'Shareio', 'Chainviz']) {
    await page.getByRole('button', { name, exact: true }).click()
    await selected(page, name)
    await page.getByRole('link', { name: `View ${name} case study` }).click()
    await noise(page, false)
    const externalLinks = await page.locator('main a[href^="http"]').evaluateAll(links => links.map(link => ({ target: link.target, rel: link.rel })))
    assert.ok(externalLinks.length > 0 && externalLinks.every(({ target, rel }) => target === '_blank' && /\bnoopener\b/.test(rel) && /\bnoreferrer\b/.test(rel)), `${name} external links must open safely in a new tab`)
    if (name === 'Datalane') {
      for (const file of ['37-v2.avif', '39-right-v2.avif']) {
        const image = page.locator(`main img[src*="${file}"]`)
        assert.equal(await image.count(), 1, `The replacement ${file} must be used once`)
        await image.scrollIntoViewIfNeeded()
        await image.evaluate(el => el.decode())
      }
      assert.equal(await page.locator('main img[src*="-left.avif"]').count(), 7, 'Only the seven numbered Datalane subframe pairs should be split')
      const left = await page.getByAltText('ABC Oracle and Geist Mono type specimens').boundingBox()
      const right = await page.getByAltText('Datalane data receipt on blue').boundingBox()
      assert.ok(left && right && Math.abs(left.y - right.y) < 1 && Math.abs(right.x - left.x - left.width) < 1, 'Datalane shot 8 must show two images without a gap on desktop')
    }
    if (name === 'Circus')
      assert.equal(await page.getByRole('link', { name: 'Website', exact: true }).getAttribute('href'), 'https://www.circus-group.com/')
    await page.getByRole('link', { name: 'Close', exact: true }).click()
    await selected(page, name)
  }
  await page.screenshot({ path: `${artifacts}/work-desktop.png` })
  for (const viewport of [{ width: 1024, height: 400 }, { width: 1024, height: 600 }, { width: 1440, height: 600 }]) {
    await page.setViewportSize(viewport)
    await page.getByRole('button', { name: 'Stars+Honey', exact: true }).click()
    await selected(page, 'Stars+Honey')
    await page.waitForTimeout(300)
    if (viewport.height === 400) {
      const cover = await page.getByRole('link', { name: 'View Stars+Honey case study' }).boundingBox()
      await page.mouse.move(cover.x + cover.width / 2, Math.min(cover.y + 100, viewport.height - 20))
      await page.mouse.wheel(0, 140)
      await page.waitForFunction(() => !document.documentElement.classList.contains('lenis-scrolling'))
      assert.ok(await page.evaluate(() => scrollY) > 0, 'Wheel must scroll overflowing project content before switching cases')
      await selected(page, 'Stars+Honey')
    }
    const headerBefore = await page.locator('.site-header').boundingBox()
    await page.evaluate(() => scrollTo(0, document.documentElement.scrollHeight))
    await page.waitForTimeout(400)
    const bounds = await page.evaluate(() => {
      const details = document.querySelectorAll('.case-anim-target')[2].getBoundingClientRect()
      const cover = document.querySelector('.case-anim-target img').getBoundingClientRect()
      const menu = document.querySelector('button[aria-pressed]').parentElement.getBoundingClientRect()
      return { y: scrollY, details: details.toJSON(), cover: cover.toJSON(), menu: menu.toJSON(), height: innerHeight }
    })
    assert.ok(bounds.y > 0 && bounds.details.bottom <= bounds.height + 1 && bounds.cover.bottom <= bounds.height + 1, `Short viewport must expose all project content: ${JSON.stringify(bounds)}`)
    assert.ok(bounds.menu.bottom <= bounds.details.top, `Pinned project titles must not overlap details: ${JSON.stringify(bounds)}`)
    const headerAfter = await page.locator('.site-header').boundingBox()
    assert.ok(Math.abs(headerAfter.y - headerBefore.y) < 1, 'The right navigation must remain fixed while Work scrolls')
    const pricing = await page.getByRole('link', { name: 'Pricing', exact: true }).boundingBox()
    assert.ok(pricing.y >= 0 && pricing.y + pricing.height <= viewport.height, 'Navigation links must remain visible in short windows')
    await page.screenshot({ path: `${artifacts}/short-${viewport.width}-${viewport.height}.png` })
    await page.evaluate(() => scrollTo(0, 0))
  }
  await page.setViewportSize({ width: 1024, height: 300 })
  await page.evaluate(() => scrollTo(0, 0))
  await page.waitForTimeout(400)
  const sidebar = await page.locator('.site-header').boundingBox()
  await page.mouse.move(sidebar.x + sidebar.width / 2, 150)
  await page.mouse.wheel(0, 400)
  await page.waitForTimeout(400)
  assert.ok(await page.locator('.site-header').evaluate(el => el.scrollTop) > 0, 'An extra-short sidebar must allow its own content to scroll')
  assert.equal(await page.evaluate(() => scrollY), 0, 'Scrolling inside the sidebar must not move the page')
  await desktop.close()

  const touchDesktop = await browser.newContext({ baseURL, viewport: { width: 1440, height: 900 }, hasTouch: true })
  const touchPage = await touchDesktop.newPage()
  touchPage.on('pageerror', error => errors.push(error.message))
  await touchPage.goto('/work')
  await selected(touchPage, 'Datalane')
  await touchPage.keyboard.press('ArrowDown')
  await touchPage.locator('main').dispatchEvent('wheel', { deltaY: 300 })
  await touchPage.waitForTimeout(700)
  await selected(touchPage, 'Datalane')
  await touchDesktop.close()

  for (const reducedMotion of ['no-preference', 'reduce']) {
    const context = await browser.newContext({ baseURL, viewport: { width: 390, height: 650 }, hasTouch: true, reducedMotion })
    const page = await context.newPage()
    page.on('pageerror', error => errors.push(error.message))
    await page.goto('/work')
    await selected(page, 'Datalane')
    const client = type === chromium ? await context.newCDPSession(page) : null
    async function swipe(x, y = 0, cancel = false) {
      const cover = page.locator('.case-anim-target a')
      const box = await cover.boundingBox()
      const start = { x: box.x + box.width / 2 - x / 2, y: box.y + 100 }
      if (client) {
        await client.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [start] })
        for (let step = 1; step <= 6; step++) {
          await client.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: start.x + x * step / 6, y: start.y + y * step / 6 }] })
          await page.waitForTimeout(20)
        }
        await client.send('Input.dispatchTouchEvent', { type: cancel ? 'touchCancel' : 'touchEnd', touchPoints: [] })
      }
      else {
        // Other engines expose taps only; exercise touch-event sequences directly.
        await cover.evaluate((el, { start, x, y, cancel }) => {
          function touch(type, progress) {
            const point = { identifier: 1, clientX: start.x + x * progress, clientY: start.y + y * progress }
            const event = new Event(type, { bubbles: true, cancelable: true })
            Object.assign(event, { touches: type === 'touchend' || type === 'touchcancel' ? [] : [point], changedTouches: [point] })
            el.dispatchEvent(event)
          }
          touch('touchstart', 0)
          for (let step = 1; step <= 6; step++)
            touch('touchmove', step / 6)
          touch(cancel ? 'touchcancel' : 'touchend', 1)
        }, { start, x, y, cancel })
        if (!cancel && Math.abs(x) >= 10 && Math.abs(x) > Math.abs(y) * 1.2)
          await cover.dispatchEvent('click', { detail: 1 })
      }
      await page.waitForTimeout(650)
      assert.equal(new URL(page.url()).pathname, '/work', 'Swiping must not open the case')
    }
    await swipe(140)
    await selected(page, 'Datalane')
    await swipe(-25)
    await selected(page, 'Datalane')
    await swipe(-65)
    await selected(page, 'Datalane')
    await page.locator('.case-anim-target a').click()
    await page.waitForURL('**/work/datalane')
    const left = await page.getByAltText('ABC Oracle and Geist Mono type specimens').boundingBox()
    const right = await page.getByAltText('Datalane data receipt on blue').boundingBox()
    assert.ok(left && right && Math.abs(right.y - left.y - left.height) < 1, 'Datalane shot 8 must stack its two images without a gap on mobile')
    await page.getByRole('link', { name: 'Close', exact: true }).click()
    await selected(page, 'Datalane')
    await swipe(-140, 0, true)
    await selected(page, 'Datalane')
    const initialY = await page.evaluate(() => scrollY)
    for (const name of ['Circus', 'Stars+Honey', 'Linux Mint', 'Shareio', 'Chainviz']) {
      await swipe(-140, 45)
      await selected(page, name)
      assert.ok(Math.abs(await page.evaluate(() => scrollY) - initialY) <= 1, 'A slightly diagonal horizontal swipe must not jerk the page vertically')
    }
    const title = await page.getByRole('button', { name: 'Chainviz', exact: true }).boundingBox()
    assert.ok(title.x >= 9 && title.x + title.width <= 381, 'Swiping must reveal the selected project title')
    await swipe(-140)
    await selected(page, 'Chainviz')
    await swipe(140)
    await selected(page, 'Shareio')
    await swipe(20, -100)
    await selected(page, 'Shareio')
    if (client)
      assert.ok(await page.evaluate(() => scrollY) > 0, 'Vertical touch scrolling must remain native')
    await page.screenshot({ path: `${artifacts}/swipe-${reducedMotion}.png` })
    await page.locator('.case-anim-target a').tap()
    await page.waitForURL('**/work/shareio')
    await noise(page, false)
    await page.getByRole('link', { name: 'Close', exact: true }).tap()
    await selected(page, 'Shareio')
    await noise(page, true)
    await context.close()
  }
  assert.deepEqual(errors, [])
  console.log(`Work checks passed in ${type.name()}: server-rendered selection, main landmark, desktop keyboard/wheel, rapid switching, Close/Back/reload, short-window content, touch swipes and case noise.`)
}
finally {
  await browser.close()
}
