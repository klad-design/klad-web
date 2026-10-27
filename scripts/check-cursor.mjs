import assert from 'node:assert/strict'
import { mkdir } from 'node:fs/promises'
import process from 'node:process'

import { chromium, webkit } from 'playwright'

const baseURL = process.env.STAGING_URL || 'http://127.0.0.1:3100'
const type = { chromium, webkit }[process.env.STAGING_BROWSER || 'chromium']
const browser = await type.launch()
const errors = []

async function trail(page) {
  await page.mouse.move(100, 100)
  await page.waitForTimeout(100)
  await page.mouse.move(800, 400)
  await page.waitForFunction(() => {
    const root = document.querySelector('[data-cursor-ghost]')
    return !root.hidden && Number(root.firstElementChild.style.opacity) > 0.1 && new DOMMatrix(root.firstElementChild.style.transform).m41 > new DOMMatrix(root.lastElementChild.style.transform).m41 + 1
  })
}

try {
  const context = await browser.newContext({ baseURL, viewport: { width: 1440, height: 900 } })
  const page = await context.newPage()
  page.on('pageerror', error => errors.push(error.message))
  const response = await page.goto('/pricing')
  assert.equal(response.status(), 200)
  const root = page.locator('[data-cursor-ghost]')
  await page.waitForFunction(() => document.querySelector('.site-header time') || document.querySelector('.site-header')?.textContent.includes('AM') || document.querySelector('.site-header')?.textContent.includes('PM'))
  assert.equal(await root.evaluate(el => el.hidden), true, 'No trail before the first mouse move')
  assert.equal(await root.getAttribute('aria-hidden'), 'true')
  assert.equal(await root.evaluate(el => getComputedStyle(el).pointerEvents), 'none')
  assert.equal(await root.locator('svg').count(), 7)
  assert.equal(await root.locator('svg').last().evaluate(el => el.style.filter), 'blur(5px)')

  await trail(page)
  const positions = await root.locator('svg').evaluateAll(els => els.map(el => new DOMMatrix(getComputedStyle(el).transform).m41))
  assert.ok(positions[0] > positions[6], 'Each ghost follows the previous arrow')
  assert.equal(await page.evaluate(() => document.elementFromPoint(800, 400)?.closest('[data-cursor-ghost]')), null, 'The overlay never intercepts interaction')
  await mkdir(`artifacts/cursor/${type.name()}`, { recursive: true })
  await page.screenshot({ path: `artifacts/cursor/${type.name()}/trail.png` })
  await page.waitForFunction(() => document.querySelector('[data-cursor-ghost]').hidden)

  await trail(page)
  await page.evaluate(() => document.dispatchEvent(new PointerEvent('pointerleave')))
  assert.equal(await root.evaluate(el => el.hidden), true, 'Leaving the window clears the trail')
  await trail(page)
  await page.evaluate(() => window.dispatchEvent(new Event('blur')))
  assert.equal(await root.evaluate(el => el.hidden), true, 'Switching windows clears the trail')
  await trail(page)
  await page.keyboard.press('Tab')
  assert.equal(await root.evaluate(el => el.hidden), true, 'Keyboard navigation clears the trail')

  await trail(page)
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.waitForFunction(() => document.querySelector('[data-cursor-ghost]').hidden)
  await page.mouse.move(500, 500)
  assert.equal(await root.evaluate(el => el.hidden), true, 'Reduced motion disables the effect immediately')
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.waitForTimeout(100)
  await trail(page)

  const link = page.getByRole('link', { name: 'Work', exact: true })
  assert.equal(await link.evaluate(el => getComputedStyle(el).cursor), 'pointer', 'Native cursor states are preserved')
  await link.click()
  await page.waitForURL('**/work')
  await trail(page)
  const cover = page.getByRole('link', { name: 'View Datalane case study' })
  await cover.hover()
  await page.waitForFunction(() => Number(getComputedStyle([...document.querySelectorAll('div')].find(el => el.textContent === 'View case')).opacity) > 0.5)
  await cover.click()
  await page.waitForURL('**/work/datalane')
  await trail(page)
  assert.equal(await root.count(), 1, 'One shared trail survives client navigation and dark case pages')
  await context.close()

  for (const options of [
    { hasTouch: true, isMobile: true, viewport: { width: 390, height: 844 } },
    { reducedMotion: 'reduce', viewport: { width: 1440, height: 900 } },
    { javaScriptEnabled: false, viewport: { width: 1440, height: 900 } },
  ]) {
    const fallback = await browser.newContext({ baseURL, ...options })
    const page = await fallback.newPage()
    await page.goto('/pricing')
    await page.mouse.move(100, 100)
    await page.mouse.move(350, 350)
    await page.waitForTimeout(200)
    assert.equal(await page.locator('[data-cursor-ghost]').evaluate(el => el.hidden), true, `Native cursor fallback: ${JSON.stringify(options)}`)
    await fallback.close()
  }

  assert.deepEqual(errors, [], 'No browser errors')
  console.log(`Cursor ghost checks passed (${type.name()}): trail, fade, cleanup, navigation, native cursor, touch, reduced motion, no JavaScript`)
}
finally {
  await browser.close()
}
