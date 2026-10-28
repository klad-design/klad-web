import assert from 'node:assert/strict'
import process from 'node:process'

import { chromium, firefox, webkit } from 'playwright'

const baseURL = process.env.STAGING_URL || 'http://127.0.0.1:3100'
const type = { chromium, firefox, webkit }[process.env.STAGING_BROWSER || 'chromium']
assert.ok(type)
const browser = await type.launch()
const frameURL = /\/images\/(?:team-mobile\/v4|team)\/\d+\.avif$/
const seedFrames = [...new Set([...Array.from({ length: 16 }, (_, index) => index * 8), 30, 60, 90, 121])]
const errors = []

async function visit(options, setup) {
  const context = await browser.newContext(options)
  await setup?.(context)
  const requests = new Set()
  const pending = new Set()
  let peakRequests = 0
  context.on('request', (request) => {
    if (!frameURL.test(request.url()))
      return
    requests.add(request.url())
    pending.add(request)
    peakRequests = Math.max(peakRequests, pending.size)
  })
  for (const event of ['requestfinished', 'requestfailed'])
    context.on(event, request => pending.delete(request))
  await context.addInitScript(() => {
    const source = /\/images\/(?:team-mobile\/v4|team)\/(\d+)\.avif$/
    const decoded = new WeakSet()
    const decode = HTMLImageElement.prototype.decode
    window.__teamDecoded = new Set()
    window.__teamPaints = []
    window.__teamHold61 ??= false
    window.__teamReleases = []
    HTMLImageElement.prototype.decode = function () {
      return decode.call(this).then(async () => {
        if (!source.test(this.src))
          return
        const frame = Number(this.src.match(source)[1])
        if (window.__teamHold61 && frame === 61)
          await new Promise(resolve => window.__teamRelease61 = resolve)
        if (window.__teamHoldNonSeeds && frame % 8 !== 0 && ![30, 60, 90, 121].includes(frame))
          await new Promise(resolve => window.__teamReleases.push(resolve))
        decoded.add(this)
        window.__teamDecoded.add(this.src)
      })
    }
    const clear = CanvasRenderingContext2D.prototype.clearRect
    const draw = CanvasRenderingContext2D.prototype.drawImage
    let paint
    CanvasRenderingContext2D.prototype.clearRect = function (...args) {
      if (this.canvas.closest?.('#team')) {
        paint = { time: performance.now(), draws: [] }
        window.__teamPaints.push(paint)
      }
      return clear.apply(this, args)
    }
    CanvasRenderingContext2D.prototype.drawImage = function (...args) {
      if (this.canvas.closest?.('#team') && source.test(args[0].src)) {
        paint?.draws.push({
          frame: Number(args[0].src.match(source)[1]),
          alpha: this.globalAlpha,
          operation: this.globalCompositeOperation,
          decoded: decoded.has(args[0]),
          width: args[0].naturalWidth,
        })
      }
      return draw.apply(this, args)
    }
  })
  const page = await context.newPage()
  page.on('pageerror', error => errors.push(error.message))
  const response = await page.goto(baseURL)
  assert.equal(response.status(), 200)
  await page.evaluate(() => document.fonts.ready)
  await page.waitForFunction(() => window.__teamPaints.some(paint => paint.draws.length))
  return { context, page, requests, peakRequests: () => peakRequests }
}

async function mobileRange(page) {
  await page.evaluate(() => scrollTo(0, 0))
  await page.waitForTimeout(500)
  return page.locator('.models').evaluate(el => ({
    start: el.getBoundingClientRect().top + scrollY - 30,
    end: document.querySelector('.memberDescriptionEnd').getBoundingClientRect().bottom + scrollY - el.clientHeight - 30,
  }))
}

async function paints(page, reset = false) {
  return page.evaluate((reset) => {
    const paints = window.__teamPaints.filter(paint => paint.draws.length).map(paint => ({
      ...paint,
      frame: paint.draws.reduce((sum, draw) => sum + draw.frame * draw.alpha, 0),
    }))
    if (reset)
      window.__teamPaints = []
    return paints
  }, reset)
}

async function seek(page, range, frame) {
  await page.evaluate(y => scrollTo(0, y), range.start + (range.end - range.start) * frame / 121)
  await page.waitForTimeout(1000)
  return paints(page)
}

function verifyPaints(result) {
  assert.ok(result.length)
  for (const paint of result) {
    assert.ok(paint.draws.every(draw => draw.decoded), 'A frame must finish decode() before drawing')
    assert.ok(paint.draws.length <= 2, 'Each render needs at most two adjacent source frames')
    assert.ok(Math.abs(paint.draws.reduce((sum, draw) => sum + draw.alpha, 0) - 1) < 0.00001, 'Blend weights must preserve portrait opacity')
    if (paint.draws.length === 2) {
      assert.equal(paint.draws[1].frame, paint.draws[0].frame + 1, 'Only adjacent source frames may blend')
      assert.equal(paint.draws[1].operation, 'lighter', 'Transparent portraits need additive premultiplied blending')
    }
  }
}

async function verifyPortraitSides(page) {
  const bounds = await page.locator('#team canvas').evaluate((canvas) => {
    const pixels = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height).data
    let left = canvas.width
    let right = 0
    for (let i = 3; i < pixels.length; i += 4) {
      if (pixels[i] > 16) {
        const x = ((i - 3) / 4) % canvas.width
        left = Math.min(left, x)
        right = Math.max(right, x + 1)
      }
    }
    const rect = canvas.getBoundingClientRect()
    let clipLeft = 0
    let clipRight = innerWidth
    for (let ancestor = canvas.parentElement; ancestor; ancestor = ancestor.parentElement) {
      if (/hidden|clip/.test(getComputedStyle(ancestor).overflowX)) {
        const clip = ancestor.getBoundingClientRect()
        clipLeft = Math.max(clipLeft, clip.left)
        clipRight = Math.min(clipRight, clip.right)
      }
    }
    return { left: rect.left + left / canvas.width * rect.width, right: rect.left + right / canvas.width * rect.width, clipLeft, clipRight }
  })
  assert.ok(bounds.left >= bounds.clipLeft - 1 && bounds.right <= bounds.clipRight + 1, `Portrait shoulders must stay inside visible bounds: ${JSON.stringify(bounds)}`)
}

try {
  const cold = await visit(
    { viewport: { width: 390, height: 844 }, hasTouch: true },
    context => context.addInitScript(() => window.__teamHoldNonSeeds = true),
  )
  await cold.page.waitForFunction(seeds => seeds.every(frame => [...window.__teamDecoded].some(url => url.endsWith(`/${frame}.avif`))), seedFrames)
  const coldRange = await mobileRange(cold.page)
  const coldForward = await seek(cold.page, coldRange, 96.5)
  const forwardFrame = coldForward.at(-1).frame
  assert.ok(forwardFrame > 88 && forwardFrame <= 96.5, 'A cold forward swipe must follow prepared poses instead of freezing on the first portrait')
  await paints(cold.page, true)
  const coldReverse = await seek(cold.page, coldRange, 24.5)
  assert.ok(coldReverse.at(-1).frame >= 24.5 && coldReverse.at(-1).frame < 33, 'A cold reverse swipe must follow prepared poses')
  assert.ok(coldReverse.every((paint, index) => index === 0 || paint.frame <= coldReverse[index - 1].frame + 0.001), 'Cold reverse poses must remain ordered')
  await cold.page.evaluate(() => {
    window.__teamHoldNonSeeds = false
    window.__teamReleases.forEach(release => release())
  })
  await cold.page.waitForFunction(() => window.__teamDecoded.size === 122)
  await cold.page.waitForTimeout(100)
  assert.ok(Math.abs((await paints(cold.page)).at(-1).frame - 24.5) < 0.2, 'Refinement frames must settle at the current target instead of replaying the missed swipe')
  verifyPaints(await paints(cold.page))
  await cold.context.close()

  const phone = await visit(
    { viewport: { width: 390, height: 844 }, hasTouch: true, deviceScaleFactor: 3 },
    context => context.addInitScript(() => window.__teamHold61 = true),
  )
  const { page } = phone
  await page.waitForFunction(seeds => seeds.every(frame => [...window.__teamDecoded].some(url => url.endsWith(`/${frame}.avif`))), seedFrames)
  assert.ok([...phone.requests][0].includes('/team-mobile/v4/'), 'Phones must use the sharper optimized rendition')
  assert.equal((await paints(page)).at(-1).draws[0].width, 832, 'Phone portraits must retain the higher-resolution source detail')
  const range = await mobileRange(page)
  await page.evaluate(y => scrollTo(0, y), range.start - 500)
  await page.waitForFunction(() => window.__teamDecoded.size === 121, null, { timeout: 30000 })
  assert.equal(phone.requests.size, 122, 'Approaching Team must prepare every source frame')
  assert.ok(phone.peakRequests() <= 6, 'Portrait preparation must bound concurrent requests')
  assert.ok(await page.locator('#team canvas').evaluate(el => el.width === Math.round(el.clientWidth * Math.min(devicePixelRatio, 2))), 'Phone canvas must render at full 2x resolution on high-density screens')

  await paints(page, true)
  await seek(page, range, 60.5)
  assert.ok((await paints(page)).at(-1).draws.every(draw => draw.frame !== 61), 'An image that is loaded but not decoded must stay off canvas')
  const beforeRelease = await seek(page, range, 70.5)
  assert.ok(Math.abs(beforeRelease.at(-1).frame - 70.5) < 0.2)
  await page.evaluate(() => window.__teamRelease61())
  await page.waitForFunction(() => window.__teamDecoded.size === 122)
  await page.waitForTimeout(100)
  assert.ok(Math.abs((await paints(page)).at(-1).frame - 70.5) < 0.2, 'Late decode completion must preserve the current playhead')
  verifyPaints(await paints(page))

  await seek(page, range, 15)
  await paints(page, true)
  const motion = await page.evaluate(async ({ start, end }) => {
    const initialY = start + (end - start) * 15 / 121
    const started = performance.now()
    let ticks = 0
    await new Promise((resolve) => {
      function step(now) {
        ticks++
        const elapsed = Math.min(now - started, 1800)
        scrollTo(0, initialY + elapsed * 0.15)
        if (elapsed < 1800)
          requestAnimationFrame(step)
        else
          resolve()
      }
      requestAnimationFrame(step)
    })
    return { ticks, milliseconds: performance.now() - started }
  }, range)
  const slow = await paints(page)
  verifyPaints(slow)
  const distinct = new Set(slow.map(paint => paint.frame.toFixed(3))).size
  const integerFrames = new Set(slow.map(paint => Math.floor(paint.frame))).size
  assert.ok(distinct > integerFrames * 1.5, 'Slow scrolling must render intermediate blends between source frames')
  assert.ok(slow.every((paint, index) => index === 0 || paint.frame >= slow[index - 1].frame - 0.001), 'Forward motion must remain ordered')
  console.log(`${type.name()} slow-scroll observation: ${(distinct * 1000 / motion.milliseconds).toFixed(1)} visual updates/s across ${motion.ticks} browser animation frames.`)

  await seek(page, range, 121)
  assert.ok(Math.abs((await paints(page)).at(-1).frame - 121) < 0.2, 'Forward scrolling must settle at the final portrait')
  for (const frame of [0, 30, 60, 90, 121]) {
    await seek(page, range, frame)
    await verifyPortraitSides(page)
  }
  await paints(page, true)
  const reverse = await seek(page, range, 0)
  assert.ok(reverse.every((paint, index) => index === 0 || paint.frame <= reverse[index - 1].frame + 0.001), 'Reverse motion must remain ordered')
  assert.ok(reverse.at(-1).frame < 0.2, 'Reverse scrolling must settle at the first portrait')
  const pixels = await page.locator('#team canvas').evaluate((canvas) => {
    const data = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height).data
    let opaque = false
    for (let i = 3; i < data.length; i += 4)
      opaque ||= data[i] > 240
    return { cornerAlpha: data[3], opaque }
  })
  assert.equal(pixels.cornerAlpha, 0, 'Canvas must retain the portrait transparency')
  assert.ok(pixels.opaque, 'Portrait must remain visible at full opacity')

  for (const viewport of [{ width: 320, height: 844 }, { width: 667, height: 375 }, { width: 390, height: 844 }]) {
    await page.setViewportSize(viewport)
    await page.waitForTimeout(800)
    const models = await page.locator('.models').boundingBox()
    assert.ok(viewport.height < 500 ? models.height <= 151 : Math.abs(models.height - 357) < 2, 'Orientation must resize the portrait without consuming the reading area')
    assert.ok(await page.locator('#team canvas').evaluate(el => el.width === Math.round(el.clientWidth * Math.min(devicePixelRatio, 2))))
    await seek(page, await mobileRange(page), 90)
    await verifyPortraitSides(page)
  }
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.waitForTimeout(500)
  assert.equal(await page.locator('.team-track').evaluate(el => getComputedStyle(el).flexDirection), 'column')
  await phone.context.close()

  const reduced = await visit({ viewport: { width: 390, height: 844 }, hasTouch: true, reducedMotion: 'reduce' })
  await reduced.page.locator('#team').scrollIntoViewIfNeeded()
  await reduced.page.waitForTimeout(600)
  assert.equal(reduced.requests.size, 1, 'Reduced motion must only load the static portrait')
  await reduced.context.close()

  const fallback = await visit(
    { viewport: { width: 390, height: 844 }, hasTouch: true },
    context => context.route(/\/team-mobile\/v4\/(?:0|61)\.avif$/, route => route.abort()),
  )
  assert.ok(fallback.requests.has(`${baseURL}/images/team/0.avif`), 'A failed initial mobile portrait must fall back to the original')
  await fallback.page.waitForFunction(() => window.__teamPaints.some(paint => paint.draws.some(draw => draw.frame === 0 && draw.width === 1080)))
  assert.equal((await paints(fallback.page)).at(-1).draws[0].width, 1080, 'The fallback portrait must decode and paint successfully')
  const fallbackRange = await mobileRange(fallback.page)
  await fallback.page.evaluate(y => scrollTo(0, y), fallbackRange.start)
  await fallback.page.waitForFunction(() => window.__teamDecoded.size === 122, null, { timeout: 30000 })
  assert.ok(fallback.requests.has(`${baseURL}/images/team/61.avif`), 'A persistently failed later mobile frame must also fall back')
  const recovered = await seek(fallback.page, fallbackRange, 60.5)
  assert.ok(Math.abs(recovered.at(-1).frame - 60.5) < 0.2, 'Playback must recover through the failed frame')
  verifyPaints(recovered)
  await fallback.context.close()

  for (const hasTouch of [true, false]) {
    const wide = await visit({ viewport: { width: 1024, height: 900 }, hasTouch, deviceScaleFactor: 3 })
    await wide.page.locator('#team').scrollIntoViewIfNeeded()
    await wide.page.waitForFunction(() => window.__teamDecoded.size === 122, null, { timeout: 30000 })
    assert.ok([...wide.requests].every(url => url.includes('/images/team/')), 'Tablets and desktops must use original-resolution portraits')
    assert.equal((await paints(wide.page)).at(-1).draws[0].width, 1080, 'Large portrait layouts must preserve original source detail')
    assert.ok(await wide.page.locator('#team canvas').evaluate(el => el.width === Math.round(el.clientWidth * Math.min(devicePixelRatio, 2))))
    verifyPaints(await paints(wide.page))
    await wide.context.close()
  }
  assert.deepEqual(errors, [], 'Team scenarios must not raise browser errors')
  console.log(`Team checks passed in ${type.name()}: cold-swipe fallback, bounded loading, decoded-only draws, transparent interpolation, ordered playback, late frames, unclipped shoulders, failed-image fallback, rotation, reduced motion and touch tablets.`)
}
finally {
  await browser.close()
}
