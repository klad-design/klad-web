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
}

async function pixels(page, y) {
  return page.locator('.page-imprints canvas').evaluate((canvas, y) => {
    return [...canvas.getContext('2d').getImageData(canvas.width - 5, y, 1, 1).data]
  }, y)
}

async function marker(page, y) {
  await page.locator('[data-page-content]').evaluate((root, y) => {
    const media = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    media.style.cssText = `position:fixed;right:1px;top:${y}px;width:8px;height:8px`
    root.append(media)
  }, y)
}

try {
  for (const width of [1440, 390]) {
    const context = await browser.newContext({ baseURL, viewport: { width, height: 900 }, hasTouch: width < 768 })
    const page = await context.newPage()
    page.on('pageerror', error => errors.push(error.message))
    await page.goto('/pricing')
    await page.evaluate(() => document.fonts.ready)
    await page.waitForTimeout(300)
    assert.equal(await page.locator('.page-imprints canvas').evaluate(el => el.width), 0, 'A fresh session has no imprints')
    await marker(page, 400)
    await navigate(page, 'Process', '/process')
    assert.equal(await page.locator('.page-imprints').getAttribute('aria-hidden'), 'true')
    assert.equal(await page.locator('.page-imprints').evaluate(el => el.inert), true)
    assert.equal(await page.locator('.page-imprints a, .page-imprints img, .page-imprints video').count(), 0)
    const first = await pixels(page, 404)
    assert.deepEqual(first.slice(0, 3), [0, 0, 0], 'Media must leave neutral silhouettes')
    assert.ok(first[3] > 80 && first[3] < 140, 'Media should be a pale, flat rectangle')
    assert.deepEqual(await pixels(page, 405), first, 'Media pixels must have no image detail')
    await page.screenshot({ path: `${artifacts}/pricing-on-process-${width}.png` })

    await marker(page, 500)
    await navigate(page, 'Expectations', '/expectations')
    assert.ok((await pixels(page, 404))[3] > 0, 'Earlier pages must survive a second navigation')
    assert.ok((await pixels(page, 504))[3] > 80, 'The newest viewport must join the history')
    await page.reload()
    await page.waitForFunction(() => document.querySelector('.page-imprints canvas').width > 0)
    assert.ok((await pixels(page, 404))[3] > 0, 'Session history must survive a reload')
    await page.goBack()
    await page.waitForURL('**/process')
    await page.goForward()
    await page.waitForURL('**/expectations')
    assert.ok((await pixels(page, 404))[3] > 0, 'Back and forward must preserve the accumulated history')

    await navigate(page, 'Work', '/work')
    await page.getByRole('link', { name: 'View Datalane case study', exact: true }).click()
    await page.waitForURL('**/work/datalane')
    await page.waitForFunction(() => document.documentElement.dataset.theme === 'dark')
    await page.waitForTimeout(250)
    assert.equal(await page.locator('.page-imprints canvas').evaluate(el => getComputedStyle(el).filter), 'invert(1)')
    await page.screenshot({ path: `${artifacts}/dark-case-${width}.png` })

    const layer = page.locator('.page-imprints')
    const before = await layer.evaluate(el => el.getBoundingClientRect().top)
    await page.locator('main img').nth(1).scrollIntoViewIfNeeded()
    await page.waitForTimeout(200)
    const departingScroll = await page.evaluate(() => scrollY)
    assert.ok(departingScroll > 0)
    assert.ok(Math.abs(await layer.evaluate(el => el.getBoundingClientRect().top) - before + departingScroll) < 2, 'Imprints must scroll with the document')
    await page.getByRole('link', { name: 'Close', exact: true }).evaluate(el => el.click())
    await page.waitForURL('**/work?case=datalane')
    assert.ok(await page.locator('.page-imprints canvas').evaluate((canvas) => {
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
  assert.ok(await page.locator('.page-imprints canvas').evaluate(el => el.width > 0), 'Reduced motion and disabled storage must still allow static imprints')
  const beforeSamePage = await page.locator('.page-imprints canvas').evaluate(el => el.toDataURL())
  await navigate(page, 'Process', '/process')
  assert.equal(await page.locator('.page-imprints canvas').evaluate(el => el.toDataURL()), beforeSamePage, 'A same-page link must not add another imprint')
  await navigate(page, 'Expectations', '/expectations')
  await page.getByRole('link', { name: 'team', exact: true }).click()
  await page.waitForURL('**/#team')
  await page.waitForTimeout(250)
  assert.ok(await page.locator('.page-imprints').evaluate(el => Math.abs(el.getBoundingClientRect().top) < 2), 'Hash navigation must anchor the imprint to the arriving viewport')
  assert.deepEqual(errors, [])
  console.log(`${type.name()}: imprint history, silhouettes, scrolling, reload, back/forward, dark mode, resize and storage fallback passed`)
  await context.close()
}
finally {
  await browser.close()
}
