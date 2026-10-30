import assert from 'node:assert/strict'
import process from 'node:process'

import { chromium, firefox, webkit } from 'playwright'

const baseURL = process.env.STAGING_URL || 'http://127.0.0.1:3100'
const type = { chromium, firefox, webkit }[process.env.STAGING_BROWSER || 'chromium']
const browser = await type.launch()
const bookingURL = 'https://cal.com/klad-design/discovery'
const opens = ['measure', 'custom', { type: 'custom' }, { custom_event_name: 'opens' }]

try {
  for (const width of [1440, 390]) {
    const context = await browser.newContext({ baseURL, viewport: { width, height: 900 }, hasTouch: width < 768, reducedMotion: 'reduce' })
    // Keep the Pixel queue observable without sending analytics or loading Cal.
    await context.route('https://bzrcdn.openai.com/sdk/oaiq.min.js', route => route.fulfill({ contentType: 'application/javascript', body: '' }))
    await context.route('https://cal.com/**', route => route.fulfill({ contentType: 'text/html', body: '<title>Booking</title>' }))
    const page = await context.newPage()
    const errors = []
    page.on('pageerror', error => errors.push(error.message))
    const measurements = () => page.evaluate(() => window.oaiq.q.filter(call => call[0] === 'measure').map(call => Array.from(call)))

    async function assertBooking(action) {
      const before = await measurements()
      const [popup] = await Promise.all([page.waitForEvent('popup'), action()])
      await popup.waitForURL(bookingURL)
      assert.deepEqual(await measurements(), [...before, opens], 'Each booking activation must send exactly one opens event with the supplied payload')
      await popup.close()
    }

    await page.goto('/pricing')
    await page.waitForFunction(() => window.oaiq && /AM|PM/.test(document.querySelector('.site-header')?.textContent || ''))
    assert.deepEqual(await measurements(), [], 'Page views must not send opens')
    await page.locator('h1').click()
    assert.deepEqual(await measurements(), [], 'Non-booking clicks must not send opens')

    if (width === 1440) {
      await assertBooking(() => page.locator('header').getByRole('link', { name: 'Book a call', exact: true }).locator('span').click())
      const discovery = page.getByRole('link', { name: 'Discovery call', exact: true })
      await discovery.focus()
      await assertBooking(() => discovery.press('Enter'))
      const before = await measurements()
      await page.getByRole('link', { name: 'Klad Syndicate home', exact: true }).click()
      await page.waitForURL(`${baseURL}/`)
      assert.deepEqual(await measurements(), before, 'Internal navigation must not send opens or reset the queue')
      await assertBooking(() => page.locator('main h2 a').filter({ hasText: 'Book a call' }).click())
      assert.equal((await measurements()).length, 3)
    }
    else {
      await page.getByRole('button', { name: 'Menu', exact: true }).click()
      assert.deepEqual(await measurements(), [], 'Opening the mobile menu must not send opens')
      await assertBooking(() => page.getByRole('dialog').getByRole('link', { name: 'Book a call', exact: true }).tap())
      assert.equal((await measurements()).length, 1)
    }

    assert.equal(await page.locator('head #openai-pixel').count(), 1)
    assert.equal(await page.locator('script[src="https://bzrcdn.openai.com/sdk/oaiq.min.js"]').count(), 1)
    assert.equal(await page.evaluate(() => window.oaiq.q.filter(call => call[0] === 'init').length), 1)
    assert.deepEqual(errors, [], 'No runtime errors')
    await context.close()
  }
  console.log(`${type.name()}: all four Cal entry points, keyboard/touch activation, exact opens payload, navigation deduplication and non-booking clicks passed`)
}
finally {
  await browser.close()
}
