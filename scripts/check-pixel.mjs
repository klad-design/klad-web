import assert from 'node:assert/strict'
import process from 'node:process'

import { chromium, firefox, webkit } from 'playwright'

const baseURL = process.env.STAGING_URL || 'http://127.0.0.1:3100'
const type = { chromium, firefox, webkit }[process.env.STAGING_BROWSER || 'chromium']
const browser = await type.launch()
const bookingURL = 'https://cal.com/klad-design/discovery'

try {
  for (const width of [1440, 390]) {
    const context = await browser.newContext({ baseURL, viewport: { width, height: 900 }, hasTouch: width < 768, reducedMotion: 'reduce' })
    const trackingRequests = []
    await context.route('https://**.openai.com/**', (route) => {
      trackingRequests.push(route.request().url())
      return route.abort()
    })
    await context.route('https://cal.com/**', route => route.fulfill({ contentType: 'text/html', body: '<title>Booking</title>' }))
    const page = await context.newPage()
    const errors = []
    page.on('pageerror', error => errors.push(error.message))

    async function assertNoPixel() {
      assert.equal(await page.evaluate(() => 'oaiq' in window), false, 'The Pixel queue must not be initialized')
      assert.equal(await page.locator('#openai-pixel, script[src*="openai.com"]').count(), 0, 'No OpenAI tracking scripts')
      assert.deepEqual(trackingRequests, [], 'No OpenAI tracking requests')
    }

    async function assertBooking(action) {
      const [popup] = await Promise.all([page.waitForEvent('popup'), action()])
      await popup.waitForURL(bookingURL)
      await assertNoPixel()
      await popup.close()
    }

    await page.goto('/pricing')
    await page.waitForFunction(() => /AM|PM/.test(document.querySelector('.site-header')?.textContent || ''))
    await assertNoPixel()
    await page.locator('h1').click()
    await assertNoPixel()

    if (width === 1440) {
      await assertBooking(() => page.locator('header').getByRole('link', { name: 'Book a call', exact: true }).locator('span').click())
      const discovery = page.getByRole('link', { name: 'Discovery call', exact: true })
      await discovery.focus()
      await assertBooking(() => discovery.press('Enter'))
      await page.getByRole('link', { name: 'Klad Syndicate home', exact: true }).click()
      await page.waitForURL(`${baseURL}/`)
      await assertNoPixel()
      await assertBooking(() => page.locator('main h2 a').filter({ hasText: 'Book a call' }).click())
    }
    else {
      await page.getByRole('button', { name: 'Menu', exact: true }).click()
      await assertNoPixel()
      await assertBooking(() => page.getByRole('dialog').getByRole('link', { name: 'Book a call', exact: true }).tap())
    }

    await assertNoPixel()
    assert.deepEqual(errors, [], 'No runtime errors')
    await context.close()
  }
  console.log(`${type.name()}: all four Cal entry points, keyboard/touch activation and navigation passed without OpenAI tracking scripts, queue or requests`)
}
finally {
  await browser.close()
}
