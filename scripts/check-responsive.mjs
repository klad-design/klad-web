import assert from 'node:assert/strict'
import { mkdir } from 'node:fs/promises'
import process from 'node:process'

import { chromium, firefox, webkit } from 'playwright'

import { observeTeam } from './team-test-observer.mjs'

const baseURL = process.env.STAGING_URL || 'http://127.0.0.1:3100'
const type = { chromium, firefox, webkit }[process.env.STAGING_BROWSER || 'chromium']
assert.ok(type)
const browser = await type.launch()
const artifacts = `artifacts/responsive/${type.name()}`
await mkdir(artifacts, { recursive: true })

async function visit(context, route, setup) {
  const page = await context.newPage()
  await setup?.(page)
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

  const landscape = await browser.newContext({ viewport: { width: 667, height: 375 }, hasTouch: true, deviceScaleFactor: 3 })
  const portraitRequests = new Set()
  landscape.on('request', (request) => {
    if (/\/images\/team-mobile\/v5\/\d+\.avif/.test(request.url()))
      portraitRequests.add(request.url())
  })
  await observeTeam(landscape)
  const team = await visit(landscape, '/', page => page.clock.install())
  assert.ok(await team.evaluate(() => window.__portraitDraws > 0), 'The initial mobile portrait must be drawn')
  await team.evaluate(() => scrollTo(0, document.querySelector('.memberDescription').getBoundingClientRect().top + scrollY - 195))
  await team.waitForTimeout(1500)
  await team.waitForFunction(() => window.__teamDecoded.size === 122)
  assert.equal(portraitRequests.size, 122, 'Mobile must prepare the complete lightweight frame sequence near Team')
  const portrait = await team.locator('.models').boundingBox()
  assert.ok(portrait.height <= 151 && portrait.y + portrait.height < 275, 'Landscape portrait must leave at least 100px to read below it')
  assert.ok(Number(await team.locator('.memberDescription').first().evaluate(el => getComputedStyle(el).opacity)) > 0.98, 'Biography must remain readable beneath the portrait')
  await team.screenshot({ path: `${artifacts}/landscape-team.png` })
  await team.setViewportSize({ width: 390, height: 844 })
  await team.waitForTimeout(1000)
  assert.ok(Math.abs((await team.locator('.models').boundingBox()).height - 357) < 2, 'Rotating back must restore the portrait size')
  await team.evaluate(() => scrollTo(0, 0))
  await team.waitForTimeout(500)
  // Give draw-count assertions consistent RAF steps on loaded runners.
  await team.clock.pauseAt(await team.evaluate(() => Date.now() + 1000))
  await team.clock.runFor(500)
  const range = await team.locator('.models').evaluate(el => ({
    start: el.getBoundingClientRect().top + scrollY - 30,
    end: document.querySelector('.memberDescriptionEnd').getBoundingClientRect().bottom + scrollY - el.clientHeight - 30,
  }))
  await team.evaluate(() => {
    window.__portraitFrames = []
    window.__portraitWidths = []
  })
  await team.evaluate(y => scrollTo(0, y), (range.start + range.end) / 2)
  await team.clock.runFor(800)
  const forward = await team.evaluate(() => window.__portraitFrames)
  assert.ok(new Set(forward).size > 4, 'A sudden scroll must play intermediate frames instead of jumping straight to the target')
  assert.ok(forward.every((frame, index) => index === 0 || frame >= forward[index - 1]), 'Forward playback must stay in order')
  assert.ok(Math.abs(forward.at(-1) - 60.5) <= 1, 'Playback must settle at the frame matching the scroll position')
  await team.evaluate(() => document.dispatchEvent(new Event('visibilitychange')))
  assert.equal(await team.evaluate(() => window.__portraitFrames.at(-1)), forward.at(-1), 'Returning to the tab must preserve the current portrait')
  await team.evaluate(() => window.__portraitFrames = [])
  await team.evaluate(y => scrollTo(0, y), range.start)
  await team.clock.runFor(800)
  const reversed = await team.evaluate(() => window.__portraitFrames)
  assert.ok(new Set(reversed).size > 4 && reversed.every((frame, index) => index === 0 || frame <= reversed[index - 1]), 'Reverse playback must also play intermediate frames in order')
  assert.equal(reversed.at(-1), 0, 'Reverse scrolling must settle on the first frame')
  await team.clock.resume()
  const widths = await team.evaluate(() => window.__portraitWidths)
  assert.ok(Math.max(...widths) - Math.min(...widths) < 0.001 && Math.abs(widths[0] - 1) < 0.001, 'Mobile portraits must retain one full canonical-stage scale while scrolling')
  assert.ok(await team.evaluate(() => window.__teamPaints.every(paint => paint.draws.every(draw => draw.mappingError < 0.00001 && draw.sourceDimensionsValid))), 'Portraits must preserve their canonical placement and source density')
  assert.ok(await team.locator('#team canvas').evaluate(el => el.width <= Math.round(el.clientWidth * 2)), 'Canvas resolution must be capped at 2x on high-density phones')
  const redrawn = await team.locator('#team canvas').evaluate(() => {
    const before = window.__portraitDraws
    document.dispatchEvent(new Event('visibilitychange'))
    return window.__portraitDraws > before
  })
  assert.ok(redrawn, 'Portrait must redraw when the tab becomes visible')
  await landscape.close()

  for (const viewport of [{ width: 844, height: 390 }, { width: 932, height: 430 }]) {
    const context = await browser.newContext({ viewport: { width: viewport.height, height: viewport.width }, hasTouch: true })
    await observeTeam(context)
    const page = await visit(context, '/')
    await page.setViewportSize(viewport)
    await page.waitForTimeout(1000)
    await page.evaluate(() => scrollTo(0, document.querySelector('#team').getBoundingClientRect().bottom + scrollY - innerHeight + 300))
    await page.waitForTimeout(1500)
    await page.waitForFunction(() => window.__portraitDraws > 0)
    const portrait = await page.locator('.models').boundingBox()
    assert.ok(portrait.y >= 0 && portrait.y + portrait.height <= viewport.height + 1, `${viewport.width}px: the pinned portrait box must fit vertically: ${JSON.stringify(portrait)}`)
    const ink = await page.locator('#team canvas').evaluate((canvas) => {
      const pixels = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height).data
      let top = canvas.height
      let bottom = 0
      for (let i = 3; i < pixels.length; i += 4) {
        if (pixels[i] > 16) {
          const y = Math.floor((i - 3) / 4 / canvas.width)
          top = Math.min(top, y)
          bottom = Math.max(bottom, y + 1)
        }
      }
      const rect = canvas.getBoundingClientRect()
      let clipTop = 0
      let clipBottom = innerHeight
      for (let ancestor = canvas.parentElement; ancestor; ancestor = ancestor.parentElement) {
        if (/hidden|clip/.test(getComputedStyle(ancestor).overflowY)) {
          const clip = ancestor.getBoundingClientRect()
          clipTop = Math.max(clipTop, clip.top)
          clipBottom = Math.min(clipBottom, clip.bottom)
        }
      }
      return { drawn: bottom > top, top: rect.top + top / canvas.height * rect.height, bottom: rect.top + bottom / canvas.height * rect.height, clipTop, clipBottom }
    })
    assert.ok(ink.drawn && ink.top >= ink.clipTop - 1 && ink.bottom <= ink.clipBottom + 1, `${viewport.width}px: the complete portrait, including the head, must remain visible: ${JSON.stringify(ink)}`)
    await page.screenshot({ path: `${artifacts}/landscape-team-${viewport.width}.png` })
    await context.close()
  }

  if (type.name() === 'firefox') {
    const fallback = await browser.newContext({ viewport: { width: 375, height: 812 }, hasTouch: true })
    let localFrameRequested = false
    fallback.on('request', (request) => {
      if (request.url().endsWith('/images/team-mobile/v5/0.avif'))
        localFrameRequested = true
    })
    await visit(fallback, '/')
    assert.ok(localFrameRequested, 'The portrait must stay same-origin for imprint capture')
    await fallback.close()
  }

  const short = await browser.newContext({ viewport: { width: 1024, height: 400 } })
  const work = await visit(short, '/work')
  const logo = await work.locator('.site-header > div > a').boundingBox()
  assert.ok(logo.y >= 0 && logo.y + logo.height <= 400, 'Logo must remain visible in a short desktop window')
  await work.screenshot({ path: `${artifacts}/short-work.png` })
  await work.getByRole('link', { name: 'Pricing', exact: true }).click()
  await work.waitForURL('**/pricing')
  await short.close()

  for (const reducedMotion of ['no-preference', 'reduce']) {
    const context = await browser.newContext({ viewport: { width: 390, height: 650 }, hasTouch: true, reducedMotion })
    const page = await visit(context, '/work')
    await page.evaluate(() => scrollTo(0, 40))
    for (const name of ['Chainviz', 'Circus', 'Chainviz']) {
      const button = page.getByRole('button', { name, exact: true })
      // Reveal only the edge horizontally; selection must bring the whole title into view.
      const point = await button.evaluate(async (button) => {
        const menu = button.parentElement
        const before = button.getBoundingClientRect()
        if (before.left > innerWidth - 24)
          menu.scrollTo({ left: menu.scrollLeft + before.left - (innerWidth - 24), behavior: 'instant' })
        else if (before.right < 24)
          menu.scrollTo({ left: menu.scrollLeft + before.right - 24, behavior: 'instant' })
        await new Promise(resolve => requestAnimationFrame(resolve))
        const bounds = button.getBoundingClientRect()
        const x = (Math.max(12, bounds.left) + Math.min(innerWidth - 12, bounds.right)) / 2
        const y = bounds.top + bounds.height / 2
        return { x, y, partial: bounds.left < 10 || bounds.right > innerWidth - 10, hit: document.elementFromPoint(x, y)?.closest('button') === button }
      })
      assert.ok(point.partial, `${name}: start with a partially clipped title to exercise automatic reveal`)
      assert.ok(point.hit, `${name}: the touch must hit the visible edge of the intended title`)
      await page.touchscreen.tap(point.x, point.y)
      await page.waitForFunction(name => document.querySelector('button[aria-pressed="true"]')?.getAttribute('aria-label') === name, name)
      await page.waitForTimeout(650)
      const after = await button.boundingBox()
      assert.ok(after.x >= 9 && after.x + after.width <= 381, `${name}: selected title must be fully visible`)
      assert.ok(Math.abs(await page.evaluate(() => scrollY) - 40) <= 1, 'Selecting a title must not move the page vertically')
      const menu = await button.evaluate(el => ({ height: el.parentElement.clientHeight, scrollHeight: el.parentElement.scrollHeight, y: el.parentElement.scrollTop }))
      assert.equal(menu.scrollHeight, menu.height, 'The case selector must have no vertical scroll range')
      assert.equal(menu.y, 0)
    }
    await page.screenshot({ path: `${artifacts}/work-selected-${reducedMotion}.png` })
    await context.close()
  }

  for (const width of [390, 1440]) {
    const context = await browser.newContext({ viewport: { width, height: 900 } })
    if (width === 1440) {
      // A real decoder failure must recover through the smaller rendition.
      await context.route('https://klad.b-cdn.net/stars-honey/1-hd.mp4', route => route.fulfill({ contentType: 'video/mp4', body: 'invalid video' }))
    }
    const page = await visit(context, '/work/stars-honey')
    const video = page.locator('video').first()
    await video.scrollIntoViewIfNeeded()
    await page.waitForFunction(() => {
      const video = document.querySelector('video')
      return video?.currentSrc === 'https://klad.b-cdn.net/stars-honey/1.mp4' && video.currentTime > 0.1 && !video.paused
    })
    assert.equal(await video.evaluate(el => el.controls), false)
    assert.equal(await page.getByRole('link', { name: 'Open video' }).count(), 0, 'Successful fallback must clear the error UI')
    await page.goto(`${baseURL}/work/circus`)
    const circusVideos = page.locator('video')
    assert.equal(await circusVideos.count(), 4)
    for (let index = 0; index < 4; index++) {
      const clip = circusVideos.nth(index)
      await clip.scrollIntoViewIfNeeded()
      await page.waitForFunction((index) => {
        const video = document.querySelectorAll('video')[index]
        return video.currentSrc === `https://klad.b-cdn.net/circus/${index + 1}.mp4` && video.currentTime > 0.1 && !video.paused
      }, index)
    }
    assert.equal(await page.getByRole('link', { name: 'Open video' }).count(), 0, 'Circus must play from the shared CDN files on desktop and mobile')
    await context.close()
  }
  console.log(`Responsive fixes passed in ${type.name()}: hybrid/touch scrolling, tablet headings, landscape Team, short desktop navigation, touch case selection and video fallback.`)
}
finally {
  await browser.close()
}
