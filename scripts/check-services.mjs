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
    await page.evaluate(() => {
      window.__serviceScrollEvents = []
      document.addEventListener('scroll', () => window.__serviceScrollEvents.push({ time: performance.now(), y: scrollY }), { passive: true })
    })
    const strip = page.locator('.service').first()
    await strip.evaluate(el => el.parentElement.scrollIntoView({ block: 'center', behavior: 'instant' }))
    await page.clock.runFor(1500)
    const width = await strip.evaluate(el => el.offsetWidth)

    async function distance() {
      const before = await strip.evaluate(el => ({ x: new DOMMatrix(getComputedStyle(el).transform).m41, time: performance.now() }))
      await page.clock.runFor(250)
      const after = await strip.evaluate(el => ({ x: new DOMMatrix(getComputedStyle(el).transform).m41, time: performance.now(), scrollEvents: window.__serviceScrollEvents }))
      // The live clock also advances between Playwright protocol calls.
      const elapsed = after.time - before.time
      const raw = (before.x - after.x + width) % width
      return { start: before.time, end: after.time, elapsed, raw, normalized: raw * 250 / elapsed, scrollEvents: after.scrollEvents }
    }

    if (reducedMotion === 'reduce') {
      const still = await distance()
      assert.equal(still.raw, 0, `Reduced motion must keep the service titles still: ${JSON.stringify(still)}`)
    }
    else {
      assert.equal(await strip.evaluate(el => getComputedStyle(el).willChange), 'transform')
      assert.ok(await strip.evaluate(el => el.style.transform.includes('translate3d')), 'Move the blurred strip as a composited layer')
      const baseline = width / 80
      const idle = await distance()
      assert.ok(Math.abs(idle.normalized - baseline) < baseline * 0.15, `The idle reel must move at its intended constant speed: ${JSON.stringify(idle)}`)
      for (let step = 0; step < 8; step++) {
        await page.evaluate(() => scrollBy(0, 40))
        await page.clock.runFor(32)
      }
      await page.clock.runFor(1200)
      const recovered = await distance()
      assert.ok(Math.abs(recovered.normalized - baseline) < baseline * 0.15, `The reel must return to its idle speed after scrolling stops: ${JSON.stringify(recovered)}`)
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
