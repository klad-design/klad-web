import assert from 'node:assert/strict'
import { mkdir } from 'node:fs/promises'
import process from 'node:process'

import { chromium, webkit } from 'playwright'

const baseURL = process.env.STAGING_URL || 'http://127.0.0.1:3100'
const type = { chromium, webkit }[process.env.STAGING_BROWSER || 'chromium']
const browser = await type.launch()
const artifacts = `artifacts/imprints/${type.name()}`
await mkdir(artifacts, { recursive: true })
const errors = []

async function navigate(page, name, path) {
  if (await page.getByRole('button', { name: 'Menu', exact: true }).isVisible())
    await page.getByRole('button', { name: 'Menu', exact: true }).click()
  await page.getByRole('link', { name, exact: true }).click()
  await page.waitForURL(`**${path}`)
  await page.waitForTimeout(200)
  await page.waitForFunction(() => [...document.querySelectorAll('.page-imprints canvas')].every(canvas => canvas.getAnimations().length === 0))
}

async function pixels(page, y, layer = 0) {
  return page.locator('.page-imprints canvas').nth(layer).evaluate((canvas, y) => {
    return [...canvas.getContext('2d').getImageData(canvas.width - 5, y, 1, 1).data]
  }, y)
}

async function marker(page, y, selector = '[data-page-content]') {
  await page.locator(selector).evaluate((root, y) => {
    const media = document.createElement('canvas')
    media.style.cssText = `position:fixed;right:1px;top:${y}px;width:8px;height:8px`
    root.append(media)
  }, y)
}

try {
  for (const width of [1440, 390]) {
    const context = await browser.newContext({ baseURL, viewport: { width, height: 900 }, hasTouch: width < 768 })
    const svg = '<svg xmlns="http://www.w3.org/2000/svg" width="8" height="24" viewBox="0 0 8 24"><path fill="black" d="M0 0h8v8H0z"/><path fill="white" d="M0 8h8v8H0z"/></svg>'
    await context.route('**/imprint-test.svg*', route => route.fulfill({ contentType: 'image/svg+xml', body: svg }))
    const page = await context.newPage()
    page.on('pageerror', error => errors.push(error.message))
    await page.goto('/pricing')
    await page.evaluate(() => document.fonts.ready)
    await page.waitForTimeout(300)
    assert.equal(await page.locator('.page-imprints canvas').count(), 2, 'Only two previous-page layers may exist')
    assert.deepEqual(await page.locator('.page-imprints canvas').evaluateAll(elements => elements.map(el => el.width)), [0, 0], 'A fresh session has no imprints')
    await marker(page, 400)
    await page.locator('[data-page-content]').evaluate(async (root, svg) => {
      const image = new Image()
      image.src = '/imprint-test.svg?version=1'
      image.style.cssText = 'position:fixed;right:1px;top:0;width:8px;height:24px'
      root.append(image)
      await image.decode()
      const inline = new DOMParser().parseFromString(svg, 'image/svg+xml').documentElement
      inline.setAttribute('style', 'position:fixed;right:1px;top:28px;width:8px;height:24px')
      root.append(inline)
      const broken = new Image()
      broken.src = 'data:image/svg+xml,invalid'
      broken.style.cssText = 'position:fixed;right:1px;top:490px;width:8px;height:8px'
      root.append(broken)
    }, svg)
    const dissolve = page.evaluate(() => new Promise((resolve) => {
      const samples = []
      const end = performance.now() + 3000
      function sample() {
        const canvas = document.querySelector('.page-imprints canvas')
        if (canvas.width) {
          const style = getComputedStyle(canvas)
          samples.push({ opacity: Number(style.opacity), blur: Number.parseFloat(style.filter.slice(5)), running: canvas.getAnimations().length > 0 })
        }
        if (performance.now() < end && !(samples.some(frame => frame.running) && !samples.at(-1)?.running))
          requestAnimationFrame(sample)
        else
          resolve(samples)
      }
      sample()
    }))
    await navigate(page, 'Process', '/process')
    const samples = await dissolve
    assert.ok(samples.some(frame => frame.opacity > 0.5 && frame.opacity < 1 && frame.blur > 0 && frame.blur < 4), 'The departing page must dissolve through intermediate opacity and blur')
    assert.deepEqual(await page.locator('.page-imprints canvas').evaluateAll(elements => elements.map(el => ({ opacity: getComputedStyle(el).opacity, filter: getComputedStyle(el).filter }))), [
      { opacity: '0.5', filter: 'blur(4px)' },
      { opacity: '0.3', filter: 'blur(4px)' },
    ], 'Each imprint must have its own settled opacity and blur')
    assert.equal(await page.locator('.page-imprints').getAttribute('aria-hidden'), 'true')
    assert.equal(await page.locator('.page-imprints').evaluate(el => el.inert), true)
    assert.equal(await page.locator('.page-imprints a, .page-imprints img, .page-imprints video').count(), 0)
    const first = await pixels(page, 404)
    assert.deepEqual(first.slice(0, 3), [0, 0, 0], 'Media must leave neutral silhouettes')
    assert.ok(first[3] > 80 && first[3] < 140, 'Media should be a pale, flat rectangle')
    assert.deepEqual(await pixels(page, 405), first, 'Media pixels must have no image detail')
    for (const top of [0, 28]) {
      const ink = await pixels(page, top + 4)
      assert.deepEqual(ink.slice(0, 3), [0, 0, 0], 'SVG ink must be monochrome')
      assert.ok(ink[3] > 180, 'SVG strokes must be preserved like text')
      assert.equal((await pixels(page, top + 12))[3], 0, 'White SVG areas must become negative space')
      assert.equal((await pixels(page, top + 20))[3], 0, 'Transparent SVG areas must stay empty')
    }
    await page.screenshot({ path: `${artifacts}/pricing-on-process-${width}.png` })

    await marker(page, 500)
    await navigate(page, 'Expectations', '/expectations')
    assert.equal((await pixels(page, 404))[3], 0, 'The newest layer must not contain ink from older pages')
    assert.ok((await pixels(page, 404, 1))[3] > 80, 'The previous imprint must move to the older layer')
    assert.ok((await pixels(page, 504))[3] > 80, 'The newest viewport must join the history')
    await page.reload()
    await page.waitForFunction(() => document.querySelector('.page-imprints canvas').width > 0)
    await page.waitForFunction(() => document.querySelectorAll('.page-imprints canvas')[1].width > 0)
    assert.ok((await pixels(page, 404, 1))[3] > 80, 'Both session layers must survive a reload')
    await marker(page, 600)
    await page.goBack()
    await page.waitForURL('**/process')
    await page.waitForFunction(() => document.querySelector('.page-imprints canvas').getContext('2d').getImageData(innerWidth - 5, 604, 1, 1).data[3] > 80)
    assert.ok((await pixels(page, 504, 1))[3] > 80, 'Back must retain the immediately preceding imprint')
    assert.equal((await pixels(page, 404))[3] + (await pixels(page, 404, 1))[3], 0, 'A third navigation must completely evict the oldest imprint')
    await page.goForward()
    await page.waitForURL('**/expectations')
    await page.waitForFunction(() => document.querySelectorAll('.page-imprints canvas')[1].getContext('2d').getImageData(innerWidth - 5, 604, 1, 1).data[3] > 80)
    assert.equal(await page.locator('.page-imprints canvas').count(), 2, 'Back and forward must preserve the layer limit')

    await navigate(page, 'Work', '/work')
    await page.getByRole('link', { name: 'View Datalane case study', exact: true }).click()
    await page.waitForURL('**/work/datalane')
    await page.waitForFunction(() => document.documentElement.dataset.theme === 'dark')
    await page.waitForTimeout(250)
    assert.equal(await page.locator('.page-imprints').isVisible(), false, 'Case pages must hide all previous-page imprints')
    await page.reload()
    await page.waitForFunction(() => document.documentElement.dataset.theme === 'dark')
    assert.equal(await page.locator('.page-imprints').isVisible(), false, 'Reloading a case must not reveal stored imprints')
    await page.screenshot({ path: `${artifacts}/dark-case-${width}.png` })

    const layer = page.locator('.page-imprints')
    await page.locator('main img').nth(1).scrollIntoViewIfNeeded()
    await page.waitForTimeout(200)
    const departingScroll = await page.evaluate(() => scrollY)
    assert.ok(departingScroll > 0)
    assert.equal(await layer.isVisible(), false, 'Imprints must stay hidden while scrolling a case')
    await marker(page, 700)
    await page.getByRole('link', { name: 'Close', exact: true }).evaluate(el => el.click())
    await page.waitForURL('**/work?case=datalane')
    await page.waitForFunction(() => document.querySelector('.page-imprints canvas').getContext('2d').getImageData(innerWidth - 5, 704, 1, 1).data[3] > 80)
    assert.equal(await layer.isVisible(), true, 'Closing a case must restore the imprint layer')
    assert.equal(await layer.evaluate(el => getComputedStyle(el).opacity), '0.3', 'Work must keep its imprints faint')
    assert.ok(await page.locator('.page-imprints canvas').first().evaluate((canvas) => {
      const data = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height).data
      let ink = 0
      for (let index = 3; index < data.length; index += 4) {
        if (data[index] > 80)
          ink++
      }
      return ink > canvas.width * canvas.height * 0.1
    }), 'A scrolled media viewport must leave a broad silhouette')
    await page.screenshot({ path: `${artifacts}/scrolled-case-on-work-${width}.png` })
    await page.setViewportSize({ width: width === 1440 ? 768 : 320, height: 700 })
    assert.ok(await page.locator('.page-imprints').evaluate(el => el.getBoundingClientRect().right <= innerWidth), 'Resize must not create horizontal overflow')
    await context.close()
  }

  const loopContext = await browser.newContext({ baseURL, viewport: { width: 1440, height: 900 } })
  const loopPage = await loopContext.newPage()
  loopPage.on('pageerror', error => errors.push(error.message))
  await loopPage.goto('/pricing')
  await loopPage.evaluate(() => document.fonts.ready)
  await marker(loopPage, 400)
  await navigate(loopPage, 'About', '/')
  const history = await loopPage.locator('.page-imprints canvas').first().evaluate(el => el.toDataURL())
  await loopPage.evaluate(() => scrollTo(0, document.documentElement.scrollHeight - innerHeight - 100))
  await loopPage.waitForFunction(() => document.documentElement.dataset.theme === 'dark')
  await loopPage.waitForTimeout(300)
  const atRepeatedHero = () => loopPage.evaluate(() => Math.abs(document.querySelector('.page-imprints').getBoundingClientRect().top - document.querySelector('.home-loop').getBoundingClientRect().top) < 2)
  assert.ok(await atRepeatedHero(), 'Imprints must follow the repeated hero when scrolling into the reversed theme')
  assert.equal(await loopPage.locator('.page-imprints canvas').first().evaluate(el => el.toDataURL()), history, 'A scroll theme switch must preserve the imprint')
  assert.equal(await loopPage.locator('.page-imprints').evaluate(el => getComputedStyle(el).filter), 'invert(1)', 'Dark homepage loops must invert the imprint ink')
  await loopPage.screenshot({ path: `${artifacts}/theme-loop.png` })

  const recording = loopPage.evaluate(() => new Promise((resolve) => {
    const frames = []
    const end = performance.now() + 1200
    function sample() {
      frames.push({ y: scrollY, top: document.querySelector('.page-imprints').getBoundingClientRect().top })
      if (performance.now() < end)
        requestAnimationFrame(sample)
      else
        resolve(frames)
    }
    sample()
  }))
  await loopPage.mouse.wheel(0, 200)
  const frames = await recording
  const wrap = frames.findIndex((frame, index) => index > 0 && frames[index - 1].y - frame.y > 1000)
  assert.ok(wrap > 0, 'The homepage must wrap back to the original hero')
  assert.ok(Math.abs(frames[wrap].top + frames[wrap].y) < 2, 'Imprints must already align on the first frame after wrapping')
  await loopPage.mouse.wheel(0, -200)
  await loopPage.waitForFunction(() => scrollY > document.documentElement.scrollHeight - innerHeight - 300)
  assert.ok(await atRepeatedHero(), 'Reverse scrolling must keep imprints aligned with the repeated hero')
  assert.equal(await loopPage.locator('.page-imprints canvas').first().evaluate(el => el.toDataURL()), history, 'Reversing through the loop must preserve the history')
  await marker(loopPage, 600, '.home-loop')
  await navigate(loopPage, 'Process', '/process')
  assert.ok((await pixels(loopPage, 604))[3] > 80, 'Navigating from the repeated hero must capture its visible content')
  await loopContext.close()

  const context = await browser.newContext({ baseURL, viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' })
  await context.addInitScript(() => {
    Storage.prototype.setItem = () => {
      throw new DOMException('Storage disabled', 'QuotaExceededError')
    }
    Storage.prototype.getItem = () => {
      throw new DOMException('Storage disabled', 'SecurityError')
    }
  })
  const page = await context.newPage()
  page.on('pageerror', error => errors.push(error.message))
  await page.goto('/pricing')
  await page.waitForTimeout(300)
  await navigate(page, 'Process', '/process')
  assert.ok(await page.locator('.page-imprints canvas').first().evaluate(el => el.width > 0), 'Reduced motion and disabled storage must still allow static imprints')
  assert.equal(await page.locator('.page-imprints canvas').evaluateAll(elements => elements.flatMap(el => el.getAnimations()).length), 0, 'Reduced motion must skip the dissolve entirely')
  const beforeSamePage = await page.locator('.page-imprints canvas').first().evaluate(el => el.toDataURL())
  await navigate(page, 'Process', '/process')
  assert.equal(await page.locator('.page-imprints canvas').first().evaluate(el => el.toDataURL()), beforeSamePage, 'A same-page link must not add another imprint')
  await navigate(page, 'Expectations', '/expectations')
  await page.getByRole('link', { name: 'team', exact: true }).click()
  await page.waitForURL('**/#team')
  await page.waitForTimeout(250)
  assert.ok(await page.locator('.page-imprints').evaluate(el => Math.abs(el.getBoundingClientRect().top) < 2), 'Hash navigation must anchor the imprint to the arriving viewport')
  assert.deepEqual(errors, [])
  console.log(`${type.name()}: two-layer limit, independent ink, dissolve, clean case pages, SVG capture, theme loops, reload, back/forward, resize, reduced motion and storage fallback passed`)
  await context.close()
}
finally {
  await browser.close()
}
