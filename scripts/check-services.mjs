import assert from 'node:assert/strict'
import process from 'node:process'

import { chromium, firefox, webkit } from 'playwright'

const type = { chromium, firefox, webkit }[process.env.STAGING_BROWSER || 'chromium']
const baseURL = process.env.STAGING_URL || 'http://127.0.0.1:3100'
const browser = await type.launch()

try {
  for (const reducedMotion of ['no-preference', 'reduce']) {
    const context = await browser.newContext({ baseURL, viewport: { width: 390, height: 844 }, hasTouch: true, reducedMotion })
    const page = await context.newPage()
    const errors = []
    page.on('pageerror', error => errors.push(error.message))
    await page.clock.install()
    await page.goto('/')
    await page.waitForFunction(() => document.querySelector('[data-header-logo]'))
    await page.evaluate(() => document.fonts.ready)
    const strip = page.locator('.service').first()
    await strip.evaluate(el => el.parentElement.scrollIntoView({ block: 'center', behavior: 'instant' }))
    await page.clock.runFor(1500)
    const width = await strip.evaluate(el => el.offsetWidth)

    async function distance() {
      const before = await strip.evaluate(el => new DOMMatrix(getComputedStyle(el).transform).m41)
      await page.clock.runFor(250)
      const after = await strip.evaluate(el => new DOMMatrix(getComputedStyle(el).transform).m41)
      return (before - after + width) % width
    }

    if (reducedMotion === 'reduce') {
      assert.equal(await distance(), 0, 'Reduced motion must keep the service titles still')
    }
    else {
      assert.equal(await strip.evaluate(el => getComputedStyle(el).willChange), 'transform')
      assert.ok(await strip.evaluate(el => el.style.transform.includes('translate3d')), 'Move the blurred strip as a composited layer')
      const baseline = width / 80
      assert.ok(Math.abs(await distance() - baseline) < baseline * 0.15, 'The idle reel must move at its intended constant speed')
      for (let step = 0; step < 8; step++) {
        await page.evaluate(() => scrollBy(0, 40))
        await page.clock.runFor(32)
      }
      await page.clock.runFor(1200)
      assert.ok(Math.abs(await distance() - baseline) < baseline * 0.15, 'The reel must return to its idle speed after scrolling stops')
      const transforms = await page.locator('.service').evaluateAll(elements => elements.slice(0, 2).map(el => new DOMMatrix(getComputedStyle(el).transform).m41))
      assert.ok(Math.abs(transforms[0] - transforms[1]) < 0.1, 'Both repeated strips must stay in step')
      assert.equal(await page.locator('.service').nth(1).getAttribute('aria-hidden'), 'true')
      assert.equal(await page.locator('.service').nth(1).evaluate(el => el.inert), true)
    }
    assert.deepEqual(errors, [])
    await context.close()
  }
  console.log(`${type.name()}: mobile service reel compositing, constant idle speed, recovery after scroll, synchronized repetition and reduced motion passed`)
}
finally {
  await browser.close()
}
