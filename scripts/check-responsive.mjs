import assert from 'node:assert/strict'
import { mkdir } from 'node:fs/promises'
import process from 'node:process'

import { chromium, firefox, webkit } from 'playwright'

const baseURL = process.env.STAGING_URL || 'http://127.0.0.1:3100'
const type = { chromium, firefox, webkit }[process.env.STAGING_BROWSER || 'chromium']
assert.ok(type)
const browser = await type.launch()
const artifacts = `artifacts/responsive/${type.name()}`
await mkdir(artifacts, { recursive: true })

async function visit(context, route) {
  const page = await context.newPage()
  const response = await page.goto(`${baseURL}${route}`)
  assert.equal(response.status(), 200)
  await page.evaluate(() => document.fonts.ready)
  await page.waitForTimeout(1000)
  return page
}

try {
  for (const input of ['mouse', 'hybrid', 'touch']) {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, hasTouch: input === 'touch' })
    if (input === 'hybrid')
      await context.addInitScript(() => Object.defineProperty(navigator, 'maxTouchPoints', { get: () => 1 }))
    const page = await visit(context, '/')
    const height = await page.locator('.home-loop').evaluate(el => el.clientHeight)
    assert.equal(height, input === 'touch' ? 0 : 900, `${input}: loop must match the input capability`)
    await page.evaluate(() => scrollTo(0, document.documentElement.scrollHeight - innerHeight - 30))
    await page.waitForTimeout(600)
    await page.mouse.wheel(0, 300)
    await page.waitForTimeout(1700)
    const result = await page.evaluate(() => ({ y: scrollY, limit: document.documentElement.scrollHeight - innerHeight, theme: document.documentElement.dataset.theme }))
    if (input === 'touch') {
      assert.ok(result.y >= result.limit - 2, 'Touch-only fallback must stop at the footer')
      assert.equal(result.theme, 'light')
    }
    else {
      assert.ok(result.y < 500, `${input}: wheel must wrap to hero`)
      assert.equal(result.theme, 'dark')
    }
    await page.screenshot({ path: `${artifacts}/loop-${input}.png` })
    await context.close()
  }

  const tablet = await browser.newContext({ viewport: { width: 768, height: 1024 }, hasTouch: true })
  for (const route of ['/', '/pricing', '/expectations']) {
    const page = await visit(tablet, route)
    const right = await page.locator('h1').first().evaluate((el) => {
      const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT)
      let right = 0
      while (walker.nextNode()) {
        const node = walker.currentNode
        if (!node.textContent.trim() || node.parentElement.closest('[aria-hidden], [inert]'))
          continue
        const range = document.createRange()
        range.selectNodeContents(node)
        right = Math.max(right, range.getBoundingClientRect().right)
      }
      return right
    })
    assert.ok(right <= 768, `${route}: tablet heading extends to ${right}px`)
    await page.screenshot({ path: `${artifacts}/tablet-${route.slice(1) || 'home'}.png` })
  }
  await tablet.close()

  const landscape = await browser.newContext({ viewport: { width: 667, height: 375 }, hasTouch: true })
  const team = await visit(landscape, '/')
  await team.evaluate(() => scrollTo(0, document.querySelector('.memberDescription').getBoundingClientRect().top + scrollY - 195))
  await team.waitForTimeout(1500)
  const portrait = await team.locator('.models').boundingBox()
  assert.ok(portrait.height <= 151 && portrait.y + portrait.height < 275, 'Landscape portrait must leave at least 100px to read below it')
  assert.ok(Number(await team.locator('.memberDescription').first().evaluate(el => getComputedStyle(el).opacity)) > 0.98, 'Biography must remain readable beneath the portrait')
  await team.screenshot({ path: `${artifacts}/landscape-team.png` })
  await team.setViewportSize({ width: 390, height: 844 })
  await team.waitForTimeout(1000)
  assert.ok(Math.abs((await team.locator('.models').boundingBox()).height - 357) < 2, 'Rotating back must restore the portrait size')
  await landscape.close()

  const short = await browser.newContext({ viewport: { width: 1024, height: 400 } })
  const work = await visit(short, '/work')
  const logo = await work.locator('.site-header > div > a').boundingBox()
  assert.ok(logo.y >= 0 && logo.y + logo.height <= 400, 'Logo must remain visible in a short desktop window')
  await work.screenshot({ path: `${artifacts}/short-work.png` })
  await work.getByRole('link', { name: 'Pricing', exact: true }).click()
  await work.waitForURL('**/pricing')
  await short.close()

  for (const width of [390, 1440]) {
    const context = await browser.newContext({ viewport: { width, height: 900 } })
    if (width === 1440) {
      // A real decoder failure must recover through the smaller rendition.
      await context.route('**/videos/stars-honey/1-hd.mp4', route => route.fulfill({ contentType: 'video/mp4', body: 'invalid video' }))
    }
    const page = await visit(context, '/work/stars-honey')
    const video = page.locator('video').first()
    await video.scrollIntoViewIfNeeded()
    await page.waitForFunction(() => {
      const video = document.querySelector('video')
      return video?.currentSrc.endsWith('/videos/stars-honey/1.mp4') && video.currentTime > 0.1 && !video.paused
    })
    assert.equal(await video.evaluate(el => el.controls), false)
    assert.equal(await page.getByRole('link', { name: 'Open video' }).count(), 0, 'Successful fallback must clear the error UI')
    await context.close()
  }
  console.log(`Responsive fixes passed in ${type.name()}: hybrid/touch scrolling, tablet headings, landscape Team, short desktop navigation and video fallback.`)
}
finally {
  await browser.close()
}
