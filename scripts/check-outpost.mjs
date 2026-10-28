import assert from 'node:assert/strict'
import { mkdir, readdir, stat } from 'node:fs/promises'
import process from 'node:process'

import { chromium } from 'playwright'

const baseURL = process.env.STAGING_URL || 'http://127.0.0.1:3100'
const files = (await readdir('public/images/outpost')).sort()
assert.equal(files.length, 51)
assert.ok(files.every(file => file.endsWith('.avif')))
for (const file of files)
  assert.ok((await stat(`public/images/outpost/${file}`)).size > 0)

await mkdir('artifacts/outpost', { recursive: true })
const browser = await chromium.launch()
const errors = []
try {
  const page = await browser.newPage({ baseURL, viewport: { width: 1920, height: 1080 }, reducedMotion: 'reduce' })
  page.on('pageerror', error => errors.push(error.message))
  await page.goto('/work/outpost')
  assert.match(await page.title(), /Outpost/)
  assert.match(await page.locator('meta[name="robots"]').getAttribute('content'), /noindex/)
  assert.equal(await page.locator('main > section').count(), 49)
  await page.evaluate(() => document.fonts.ready)

  const images = page.locator('main img')
  await images.evaluateAll(elements => elements.forEach(image => image.loading = 'eager'))
  await page.waitForFunction(() => [...document.querySelectorAll('main img')].every(image => image.complete && image.naturalWidth > 0))
  const assets = await images.evaluateAll(elements => elements.map(image => ({
    file: image.getAttribute('src').split('/').pop(),
    width: image.naturalWidth,
    height: image.naturalHeight,
    declaredWidth: Number(image.getAttribute('width')),
    declaredHeight: Number(image.getAttribute('height')),
    alt: image.alt,
  })))
  assert.deepEqual(assets.map(image => image.file).sort(), files)
  for (const asset of assets) {
    assert.ok(asset.alt)
    assert.ok(asset.width === 3440 || asset.width === 1720, `2× export width: ${asset.file}`)
    assert.equal(asset.width, asset.declaredWidth, asset.file)
    assert.equal(asset.height, asset.declaredHeight, asset.file)
  }

  for (const [file, y] of [['01', 628], ['02', 1704], ['03', 2780]]) {
    const bounds = await page.locator(`img[src="/images/outpost/${file}.avif"]`).boundingBox()
    assert.ok(Math.abs(bounds.x - 100) < 1 && Math.abs(bounds.y - y) < 1 && Math.abs(bounds.width - 1720) < 1, `Figma desktop placement: ${file}`)
  }

  for (const width of [1920, 1536, 1440, 768, 390, 320]) {
    await page.setViewportSize({ width, height: 1080 })
    await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))))
    const geometry = await images.evaluateAll(elements => elements.map((image) => {
      const rect = image.getBoundingClientRect()
      return { file: image.getAttribute('src'), width: rect.width, height: rect.height, ratio: image.naturalWidth / image.naturalHeight }
    }))
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `No horizontal overflow at ${width}px`)
    for (const image of geometry)
      assert.ok(image.width > 0 && Math.abs(image.height - image.width / image.ratio) < 1, `Undistorted image at ${width}px: ${image.file}`)
    for (const file of files.filter(file => file.endsWith('-left.avif'))) {
      const [left, right] = await page.locator(`img[src="/images/outpost/${file}"]`).evaluate(image => (
        [...image.parentElement.querySelectorAll('img')].map(el => el.getBoundingClientRect().toJSON())
      ))
      assert.ok(width >= 768 ? Math.abs(left.y - right.y) < 1 && Math.abs(right.x - left.x - left.width) < 1 : Math.abs(left.x - right.x) < 1 && Math.abs(right.y - left.y - left.height) < 1, `Paired images at ${width}px: ${file}`)
    }
    if (width === 1920 || width === 390)
      await page.screenshot({ path: `artifacts/outpost/${width}.png` })
  }
  await page.setViewportSize({ width: 390, height: 844 })
  await page.screenshot({ path: 'artifacts/outpost/mobile-full.png', fullPage: true })

  for (const path of ['/', '/work', '/work/datalane', '/work/circus', '/work/stars-honey', '/work/linux-mint', '/work/shareio', '/work/chainviz', '/sitemap.xml']) {
    const response = await page.request.get(path)
    assert.ok(response.ok(), path)
    assert.doesNotMatch(await response.text(), /(?:href=["'][^"']*|<loc>[^<]*)\/work\/outpost/, `Outpost must stay unlisted: ${path}`)
  }
  await page.getByRole('link', { name: 'Close', exact: true }).click()
  await page.waitForURL('**/work')
  assert.equal(await page.getByRole('button', { name: 'Outpost', exact: true }).count(), 0)
  assert.deepEqual(errors, [])
  console.log('Outpost checks passed: 51 local 2× AVIFs, 49 sections, responsive image geometry, paired panels, noindex, Close, and no public case links.')
}
finally {
  await browser.close()
}
