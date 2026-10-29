import assert from 'node:assert/strict'
import { Buffer } from 'node:buffer'
import { mkdir } from 'node:fs/promises'
import { createRequire } from 'node:module'
import process from 'node:process'

import { chromium, firefox, webkit } from 'playwright'

import { isCanceledRoutePrefetch, replaceDocument } from './document-test-navigation.mjs'

const baseURL = process.env.STAGING_URL || 'http://127.0.0.1:3100'
const type = { chromium, firefox, webkit }[process.env.STAGING_BROWSER || 'chromium']
const browser = await type.launch()
const artifacts = `artifacts/imprints/${type.name()}`
await mkdir(artifacts, { recursive: true })
const errors = []
const grayscale = true
const sharp = createRequire(import.meta.resolve('next'))('sharp')
const rgba = Buffer.alloc(8 * 24 * 4)
for (let pixel = 0; pixel < 8 * 16; pixel++) {
  const color = pixel < 8 * 8 ? [240, 40, 80] : [30, 90, 220]
  rgba.set(color, pixel * 4)
  rgba[pixel * 4 + 3] = pixel < 8 * 8 ? 255 : 128
}
const rasterFixtures = await Promise.all(['png', 'avif'].map(async format => ({
  format,
  body: await sharp(rgba, { raw: { width: 8, height: 24, channels: 4 } }).toFormat(format, { lossless: true }).toBuffer(),
})))

async function navigate(page, name, path) {
  if (await page.getByRole('button', { name: 'Menu', exact: true }).isVisible()) {
    await page.getByRole('button', { name: 'Menu', exact: true }).click()
    await page.getByRole('dialog').waitFor()
    await page.waitForFunction(() => [...document.querySelectorAll('[role="dialog"] .menuItem')].every(element => Number(getComputedStyle(element).opacity) > 0.98))
  }
  await page.getByRole('link', { name, exact: true }).click()
  try {
    await page.waitForURL(`**${path}`)
  }
  catch (error) {
    console.error('Imprint navigation failure:', { name, path, url: page.url(), viewport: page.viewportSize(), state: await page.evaluate(() => ({
      ready: document.readyState,
      heading: document.querySelector('main h1')?.textContent,
      dialog: !!document.querySelector('[role="dialog"]'),
      classes: document.documentElement.className,
    })) })
    await page.screenshot({ path: `${artifacts}/navigation-failure-${page.viewportSize()?.width}.png` }).catch(() => {})
    throw error
  }
  await page.waitForTimeout(200)
  await page.waitForFunction(() => [...document.querySelectorAll('.page-imprints canvas')].every(canvas => canvas.getAnimations().length === 0))
}

async function pixels(page, y, layer = 0) {
  return page.locator('.page-imprints canvas').nth(layer).evaluate((canvas, y) => {
    return [...canvas.getContext('2d').getImageData(canvas.width - 5, y, 1, 1).data]
  }, y)
}

async function imprintLayers(page) {
  return page.locator('.page-imprints canvas').evaluateAll(canvases => canvases.map(canvas => canvas.toDataURL()))
}

async function assertRestoredLayers(actual, expected) {
  assert.equal(actual.length, expected.length, 'Reload must preserve the layer count')
  for (const [index, source] of actual.entries()) {
    const decode = value => sharp(Buffer.from(value.split(',')[1], 'base64')).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
    const [restored, previous] = await Promise.all([decode(source), decode(expected[index])])
    assert.deepEqual(restored.info, previous.info, 'Reload must preserve the layer dimensions')
    let maxDelta = 0
    for (let i = 0; i < restored.data.length; i += 4) {
      const alpha = previous.data[i + 3]
      assert.equal(restored.data[i + 3], alpha, 'Reload must preserve every alpha value')
      // Firefox rounds color when serializing and restoring premultiplied PNGs.
      for (let channel = 0; channel < 3; channel++)
        maxDelta = Math.max(maxDelta, Math.abs(restored.data[i + channel] - previous.data[i + channel]) * alpha / 255)
    }
    assert.ok(maxDelta <= 2, 'Reload must preserve the visible pixels within two color levels')
  }
}

async function marker(page, y, selector = '[data-page-content]') {
  await page.locator(selector).evaluate((root, y) => {
    const media = document.createElement('canvas')
    media.width = 8
    media.height = 8
    const context = media.getContext('2d')
    context.fillStyle = 'rgba(0, 0, 0, 0.5)'
    context.fillRect(0, 0, 8, 8)
    media.style.cssText = `position:fixed;right:1px;top:${y}px;width:8px;height:8px`
    root.append(media)
  }, y)
}

try {
  for (const width of [1440, 390]) {
    const context = await browser.newContext({ baseURL, viewport: { width, height: 900 }, hasTouch: width < 768 })
    const svg = '<svg xmlns="http://www.w3.org/2000/svg" width="8" height="24" viewBox="0 0 8 24"><path fill="black" d="M0 0h8v8H0z"/><path fill="white" d="M0 8h8v8H0z"/></svg>'
    await context.route('**/imprint-test.svg*', route => route.fulfill({ contentType: 'image/svg+xml', body: svg }))
    for (const { format, body } of rasterFixtures)
      await context.route(`**/imprint-test.${format}`, route => route.fulfill({ contentType: `image/${format}`, body }))
    const page = await context.newPage()
    page.on('pageerror', (error) => {
      if (!isCanceledRoutePrefetch(page, error))
        errors.push(error.message)
    })
    await page.addInitScript(src => sessionStorage.setItem('klad-page-imprints-v3', JSON.stringify([src])), `data:image/png;base64,${rasterFixtures[0].body.toString('base64')}`)
    await page.goto('/pricing')
    await page.evaluate(() => document.fonts.ready)
    await page.waitForTimeout(300)
    assert.equal(await page.locator('.page-imprints canvas').count(), 2, 'Only two previous-page layers may exist')
    assert.deepEqual(await page.locator('.page-imprints canvas').evaluateAll(elements => elements.map(el => el.width)), [0, 0], 'A fresh session has no imprints')
    assert.equal(await page.evaluate(() => sessionStorage.getItem('klad-page-imprints-v3')), null, 'Discard the old cache that can contain case-study snapshots')
    await marker(page, 400)
    await page.locator('[data-page-content]').evaluate(async (root, svg) => {
      const image = new Image()
      image.src = '/imprint-test.svg?version=1'
      image.style.cssText = 'position:fixed;right:1px;top:0;width:8px;height:24px'
      root.append(image)
      await image.decode()
      const inline = new DOMParser().parseFromString(svg, 'image/svg+xml').documentElement
      inline.setAttribute('style', 'position:fixed;right:1px;top:28px;width:8px;height:24px')
      root.append(inline)
      const broken = new Image()
      broken.src = 'data:image/svg+xml,invalid'
      broken.style.cssText = 'position:fixed;right:1px;top:490px;width:8px;height:8px'
      root.append(broken)
    }, svg)
    await page.locator('[data-page-content]').evaluate(async (root, rgba) => {
      const canvas = document.createElement('canvas')
      canvas.width = 8
      canvas.height = 24
      canvas.style.cssText = 'position:fixed;right:1px;top:180px;width:8px;height:24px'
      canvas.getContext('2d').putImageData(new ImageData(new Uint8ClampedArray(rgba), 8, 24), 0, 0)
      root.append(canvas)
      for (const [index, format] of ['png', 'avif'].entries()) {
        const image = new Image()
        image.src = `/imprint-test.${format}`
        image.style.cssText = `position:fixed;right:1px;top:${60 + index * 30}px;width:8px;height:24px`
        root.append(image)
        await image.decode()
      }
      for (const [index, fit] of ['cover', 'contain'].entries()) {
        const image = new Image()
        image.src = '/imprint-test.png'
        image.style.cssText = `position:fixed;right:1px;top:${120 + index * 30}px;width:24px;height:24px;object-fit:${fit}`
        root.append(image)
        await image.decode()
      }
    }, [...rgba])
    const dissolve = page.evaluate(() => new Promise((resolve) => {
      const samples = []
      const end = performance.now() + 3000
      function sample() {
        const canvas = document.querySelector('.page-imprints canvas')
        if (canvas.width) {
          const style = getComputedStyle(canvas)
          samples.push({ opacity: Number(style.opacity), blur: Number.parseFloat(style.filter.slice(5)), running: canvas.getAnimations().length > 0 })
        }
        if (performance.now() < end && !(samples.some(frame => frame.running) && !samples.at(-1)?.running))
          requestAnimationFrame(sample)
        else
          resolve(samples)
      }
      sample()
    }))
    await navigate(page, 'Process', '/process')
    const samples = await dissolve
    assert.ok(samples.some(frame => frame.opacity > 0.5 && frame.opacity < 1 && frame.blur > 0 && frame.blur < 4), 'The departing page must dissolve through intermediate opacity and blur')
    assert.deepEqual(await page.locator('.page-imprints canvas').evaluateAll(elements => elements.map(el => ({ opacity: getComputedStyle(el).opacity, filter: getComputedStyle(el).filter }))), [
      { opacity: '0.5', filter: 'blur(4px)' },
      { opacity: '0.3', filter: 'blur(4px)' },
    ], 'Each imprint must have its own settled opacity and blur')
    assert.equal(await page.locator('.page-imprints').getAttribute('aria-hidden'), 'true')
    assert.equal(await page.locator('.page-imprints').evaluate(el => el.inert), true)
    assert.equal(await page.locator('.page-imprints a, .page-imprints img, .page-imprints video').count(), 0)
    const first = await pixels(page, 404)
    assert.deepEqual(first.slice(0, 3), [0, 0, 0], 'Media must leave neutral silhouettes')
    assert.ok(first[3] > 80 && first[3] < 140, 'Media should be a pale, flat rectangle')
    assert.deepEqual(await pixels(page, 405), first, 'Media pixels must have no image detail')
    for (const top of [0, 28]) {
      const ink = await pixels(page, top + 4)
      assert.deepEqual(ink.slice(0, 3), [0, 0, 0], 'SVG ink must be monochrome')
      assert.ok(ink[3] > 180, 'SVG strokes must be preserved like text')
      assert.deepEqual(await pixels(page, top + 12), [255, 255, 255, 255], 'White SVG pixels must also retain their original color and opacity')
      assert.equal((await pixels(page, top + 20))[3], 0, 'Transparent SVG areas must stay empty')
    }
    for (const top of [60, 90, 180]) {
      const color = (await pixels(page, top + 4)).slice(0, 3)
      assert.ok(color.every((value, index) => Math.abs(value - [240, 40, 80][index]) <= 2), 'Images and canvases must preserve original pixels without a gray fill')
      assert.ok(Math.abs((await pixels(page, top + 4))[3] - 255) <= 1, 'Opaque image pixels must not receive an extra opacity reduction')
      assert.ok(Math.abs((await pixels(page, top + 12))[3] - 128) <= 1, 'Partial image alpha must survive capture')
      assert.equal((await pixels(page, top + 20))[3], 0, 'Transparent PNG and AVIF areas must leave no ink')
    }
    assert.ok(Math.abs((await pixels(page, 132))[3] - 128) <= 1, 'Cover must crop the source instead of stretching its alpha')
    assert.equal((await pixels(page, 154))[3], 0, 'Contain must leave its empty side gutters transparent')
    assert.equal(await page.locator('.page-imprints').evaluate(el => getComputedStyle(el).filter), grayscale ? 'grayscale(1)' : 'none')
    const screenshot = await page.screenshot({ path: `${artifacts}/pricing-on-process-${width}.png` })
    const { data, info } = await sharp(screenshot).removeAlpha().raw().toBuffer({ resolveWithObject: true })
    const offset = (64 * info.width + info.width - 5) * 3
    const displayed = [...data.subarray(offset, offset + 3)]
    const chroma = Math.max(...displayed) - Math.min(...displayed)
    assert.ok(grayscale ? chroma <= 2 : chroma > 20, 'Rendered image colors must match this experiment')

    await marker(page, 500)
    await navigate(page, 'Expectations', '/expectations')
    assert.equal((await pixels(page, 404))[3], 0, 'The newest layer must not contain ink from older pages')
    assert.ok((await pixels(page, 404, 1))[3] > 80, 'The previous imprint must move to the older layer')
    assert.ok((await pixels(page, 504))[3] > 80, 'The newest viewport must join the history')
    await replaceDocument(page, () => page.reload())
    await page.waitForFunction(() => document.querySelector('.page-imprints canvas').width > 0)
    await page.waitForFunction(() => document.querySelectorAll('.page-imprints canvas')[1].width > 0)
    assert.ok((await pixels(page, 404, 1))[3] > 80, 'Both session layers must survive a reload')
    await marker(page, 600)
    await page.goBack()
    await page.waitForURL('**/process')
    await page.waitForFunction(() => document.querySelector('.page-imprints canvas').getContext('2d').getImageData(innerWidth - 5, 604, 1, 1).data[3] > 80)
    assert.ok((await pixels(page, 504, 1))[3] > 80, 'Back must retain the immediately preceding imprint')
    assert.equal((await pixels(page, 404))[3] + (await pixels(page, 404, 1))[3], 0, 'A third navigation must completely evict the oldest imprint')
    await page.goForward()
    await page.waitForURL('**/expectations')
    await page.waitForFunction(() => document.querySelectorAll('.page-imprints canvas')[1].getContext('2d').getImageData(innerWidth - 5, 604, 1, 1).data[3] > 80)
    assert.equal(await page.locator('.page-imprints canvas').count(), 2, 'Back and forward must preserve the layer limit')

    await navigate(page, 'Work', '/work')
    await marker(page, 700)
    await page.getByRole('link', { name: 'View Datalane case study', exact: true }).click()
    await page.waitForURL('**/work/datalane')
    await page.waitForFunction(() => document.documentElement.dataset.theme === 'dark')
    await page.waitForFunction(() => document.querySelector('.page-imprints canvas').getContext('2d').getImageData(innerWidth - 5, 704, 1, 1).data[3] > 80)
    let beforeCase = await imprintLayers(page)
    await page.waitForTimeout(250)
    assert.equal(await page.locator('.page-imprints').isVisible(), false, 'Case pages must hide all previous-page imprints')
    await marker(page, 760)
    await page.locator('main > header').getByRole('link', { name: 'Next', exact: true }).click()
    await page.waitForURL('**/work/chainviz')
    await page.waitForTimeout(200)
    assert.deepEqual(await imprintLayers(page), beforeCase, 'Switching cases must not create an imprint or age existing layers')
    await page.locator('main > header').getByRole('link', { name: 'Previous', exact: true }).click()
    await page.waitForURL('**/work/datalane')
    await page.waitForTimeout(200)
    assert.deepEqual(await imprintLayers(page), beforeCase, 'Returning to the previous case must preserve existing layers')
    await replaceDocument(page, () => page.reload())
    await page.waitForFunction(() => document.documentElement.dataset.theme === 'dark')
    await page.waitForFunction(() => document.querySelector('.page-imprints canvas').getContext('2d').getImageData(innerWidth - 5, 704, 1, 1).data[3] > 80)
    await page.waitForFunction(() => document.querySelectorAll('.page-imprints canvas')[1].width > 0)
    const restored = await imprintLayers(page)
    await assertRestoredLayers(restored, beforeCase)
    beforeCase = restored
    assert.equal(await page.locator('.page-imprints').isVisible(), false, 'Reloading a case must not reveal stored imprints')
    await page.screenshot({ path: `${artifacts}/dark-case-${width}.png` })

    const layer = page.locator('.page-imprints')
    await page.locator('main img').nth(1).scrollIntoViewIfNeeded()
    await page.waitForTimeout(200)
    const departingScroll = await page.evaluate(() => scrollY)
    assert.ok(departingScroll > 0)
    assert.equal(await layer.isVisible(), false, 'Imprints must stay hidden while scrolling a case')
    await marker(page, 760)
    await page.getByRole('link', { name: 'Close', exact: true }).filter({ visible: true }).first().evaluate(el => el.click())
    await page.waitForURL('**/work?case=datalane')
    await page.waitForTimeout(200)
    assert.equal(await layer.isVisible(), true, 'Closing a case must restore the imprint layer')
    assert.equal(await layer.evaluate(el => getComputedStyle(el).opacity), '0.3', 'Work must keep its imprints faint')
    assert.deepEqual(await imprintLayers(page), beforeCase, 'Closing a scrolled case must not capture its content')
    assert.equal((await pixels(page, 764))[3] + (await pixels(page, 764, 1))[3], 0, 'Case-only ink must never enter either layer')
    await page.screenshot({ path: `${artifacts}/work-after-case-${width}.png` })
    await marker(page, 800)
    await page.goBack()
    await page.waitForURL('**/work/datalane')
    await page.waitForFunction(() => document.querySelector('.page-imprints canvas').getContext('2d').getImageData(innerWidth - 5, 804, 1, 1).data[3] > 80)
    const beforeForward = await imprintLayers(page)
    await marker(page, 760)
    await page.goForward()
    await page.waitForURL('**/work?case=datalane')
    await page.waitForTimeout(200)
    assert.deepEqual(await imprintLayers(page), beforeForward, 'Browser Forward from a case must skip capture while Back from Work still captures')
    const cover = page.getByRole('link', { name: 'View Datalane case study', exact: true }).locator('img')
    await cover.scrollIntoViewIfNeeded()
    const coverRect = await cover.boundingBox()
    const points = [0.25, 0.5, 0.75].map(fraction => ({
      x: Math.round(coverRect.x + coverRect.width * fraction),
      y: Math.round(Math.max(0, coverRect.y) + (Math.min(900, coverRect.y + coverRect.height) - Math.max(0, coverRect.y)) * 0.5),
    }))
    await navigate(page, 'Process', '/process')
    assert.deepEqual(await page.locator('.page-imprints canvas').first().evaluate((canvas, points) => {
      return points.map(({ x, y }) => [...canvas.getContext('2d').getImageData(x, y, 1, 1).data])
    }, points), points.map(() => [171, 171, 171, 255]), 'Case covers must become solid #ABABAB rectangles without photographic detail')
    await page.screenshot({ path: `${artifacts}/cover-rectangle-on-process-${width}.png` })
    await navigate(page, 'Expectations', '/expectations')
    assert.deepEqual(await page.locator('.page-imprints canvas').nth(1).evaluate((canvas, points) => {
      return points.map(({ x, y }) => [...canvas.getContext('2d').getImageData(x, y, 1, 1).data])
    }, points), points.map(() => [171, 171, 171, 255]), 'The older imprint must retain the case-cover fill while layer opacity changes')
    await page.setViewportSize({ width: width === 1440 ? 768 : 320, height: 700 })
    assert.ok(await page.locator('.page-imprints').evaluate(el => el.getBoundingClientRect().right <= innerWidth), 'Resize must not create horizontal overflow')
    await context.close()
  }

  const mobileContext = await browser.newContext({ baseURL, viewport: { width: 390, height: 900 }, hasTouch: true, reducedMotion: 'reduce' })
  const mobilePage = await mobileContext.newPage()
  mobilePage.on('pageerror', error => errors.push(error.message))
  await mobilePage.goto('/')
  await mobilePage.evaluate(() => document.fonts.ready)
  await mobilePage.waitForTimeout(300)
  await navigate(mobilePage, 'Process', '/process')
  assert.ok(await mobilePage.locator('.page-imprints canvas').first().evaluate((canvas) => {
    const data = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height).data
    let ink = 0
    for (let index = 3; index < data.length; index += 4) {
      if (data[index])
        ink++
    }
    return ink > 10000
  }), 'The mobile menu must capture the actual homepage instead of an empty layer')
  await mobileContext.close()

  const loopContext = await browser.newContext({ baseURL, viewport: { width: 1440, height: 900 } })
  const loopPage = await loopContext.newPage()
  loopPage.on('pageerror', error => errors.push(error.message))
  await loopPage.goto('/pricing')
  await loopPage.evaluate(() => document.fonts.ready)
  await marker(loopPage, 400)
  await marker(loopPage, 0)
  await navigate(loopPage, 'Expectations', '/expectations')
  await marker(loopPage, 0)
  await navigate(loopPage, 'About', '/')
  const history = await loopPage.locator('.page-imprints canvas').first().evaluate(el => el.toDataURL())
  await loopPage.mouse.wheel(0, -180)
  await loopPage.waitForFunction(() => {
    const top = document.querySelector('.page-imprints').getBoundingClientRect().top
    return top > 170 && top < 190 && document.documentElement.dataset.theme === 'dark'
  })
  await loopPage.waitForTimeout(300)
  const withoutNoise = await loopPage.addStyleTag({ content: 'body::after { display: none !important; }' })
  for (const index of [0, 1]) {
    await loopPage.locator('.page-imprints canvas').evaluateAll((canvases, index) => {
      canvases.forEach((canvas, layer) => {
        canvas.style.visibility = layer === index ? 'visible' : 'hidden'
      })
    }, index)
    const top = await loopPage.locator('.page-imprints').evaluate(el => el.getBoundingClientRect().top)
    const screenshot = await loopPage.screenshot({ path: `${artifacts}/reverse-loop-layer-${index}.png` })
    const { data, info } = await sharp(screenshot).removeAlpha().raw().toBuffer({ resolveWithObject: true })
    const offset = (Math.floor(top - 3) * info.width + info.width - 5) * 3
    assert.ok(data[offset] > 3, `Layer ${index} blur must extend above its canvas without a hard cutoff after reverse looping`)
  }
  await loopPage.locator('.page-imprints canvas').evaluateAll(canvases => canvases.forEach(canvas => canvas.style.removeProperty('visibility')))
  await withoutNoise.evaluate(el => el.remove())
  assert.equal(await loopPage.evaluate(() => document.documentElement.scrollWidth), 1440, 'Unclipped blur must not create horizontal scrolling')
  assert.equal(await loopPage.locator('.page-imprints canvas').first().evaluate(el => el.toDataURL()), history, 'Reverse looping must preserve the original snapshot')
  // Finish wheel momentum before the native jump in the forward-loop check.
  await loopPage.waitForTimeout(1000)
  await loopPage.evaluate(() => scrollTo(0, document.documentElement.scrollHeight - innerHeight - 100))
  await loopPage.waitForFunction(() => document.documentElement.dataset.theme === 'dark')
  await loopPage.waitForTimeout(300)
  const atRepeatedHero = () => loopPage.evaluate(() => Math.abs(document.querySelector('.page-imprints').getBoundingClientRect().top - document.querySelector('.home-loop').getBoundingClientRect().top) < 2)
  assert.ok(await atRepeatedHero(), 'Imprints must follow the repeated hero when scrolling into the reversed theme')
  assert.equal(await loopPage.locator('.page-imprints canvas').first().evaluate(el => el.toDataURL()), history, 'A scroll theme switch must preserve the imprint')
  assert.equal(await loopPage.locator('.page-imprints').evaluate(el => getComputedStyle(el).filter), grayscale ? 'grayscale(1) invert(1)' : 'invert(1)', 'Dark homepage loops must retain the experiment filter')
  await loopPage.screenshot({ path: `${artifacts}/theme-loop.png` })

  const recording = loopPage.evaluate(() => new Promise((resolve) => {
    const frames = []
    const end = performance.now() + 1200
    function sample() {
      frames.push({ y: scrollY, top: document.querySelector('.page-imprints').getBoundingClientRect().top })
      if (performance.now() < end)
        requestAnimationFrame(sample)
      else
        resolve(frames)
    }
    sample()
  }))
  await loopPage.mouse.wheel(0, 200)
  const frames = await recording
  const wrap = frames.findIndex((frame, index) => index > 0 && frames[index - 1].y - frame.y > 1000)
  assert.ok(wrap > 0, 'The homepage must wrap back to the original hero')
  assert.ok(Math.abs(frames[wrap].top + frames[wrap].y) < 2, 'Imprints must already align on the first frame after wrapping')
  await loopPage.mouse.wheel(0, -200)
  await loopPage.waitForFunction(() => scrollY > document.documentElement.scrollHeight - innerHeight - 300)
  assert.ok(await atRepeatedHero(), 'Reverse scrolling must keep imprints aligned with the repeated hero')
  assert.equal(await loopPage.locator('.page-imprints canvas').first().evaluate(el => el.toDataURL()), history, 'Reversing through the loop must preserve the history')
  await marker(loopPage, 600, '.home-loop')
  await navigate(loopPage, 'Process', '/process')
  assert.ok((await pixels(loopPage, 604))[3] > 80, 'Navigating from the repeated hero must capture its visible content')
  await loopContext.close()

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
  assert.ok(await page.locator('.page-imprints canvas').first().evaluate(el => el.width > 0), 'Reduced motion and disabled storage must still allow static imprints')
  assert.equal(await page.locator('.page-imprints canvas').evaluateAll(elements => elements.flatMap(el => el.getAnimations()).length), 0, 'Reduced motion must skip the dissolve entirely')
  const beforeSamePage = await page.locator('.page-imprints canvas').first().evaluate(el => el.toDataURL())
  await navigate(page, 'Process', '/process')
  assert.equal(await page.locator('.page-imprints canvas').first().evaluate(el => el.toDataURL()), beforeSamePage, 'A same-page link must not add another imprint')
  await navigate(page, 'Expectations', '/expectations')
  await page.evaluate(() => {
    const nativeScroll = Element.prototype.scrollIntoView
    Element.prototype.scrollIntoView = function (...args) {
      if (this.id === 'team')
        setTimeout(() => nativeScroll.apply(this, args), 600)
      else
        nativeScroll.apply(this, args)
    }
  })
  await page.getByRole('link', { name: 'team', exact: true }).click()
  await page.waitForURL('**/#team')
  await page.waitForFunction(() => scrollY > 0 && Math.abs(document.getElementById('team')?.getBoundingClientRect().top ?? Infinity) < 2 && Math.abs(document.querySelector('.page-imprints').getBoundingClientRect().top) < 2)
  assert.ok(await page.locator('.page-imprints').evaluate(el => Math.abs(el.getBoundingClientRect().top) < 2), 'Hash navigation must anchor the imprint to the arriving viewport')
  await page.evaluate(() => scrollBy(0, 100))
  assert.ok(await page.locator('.page-imprints').evaluate(el => Math.abs(el.getBoundingClientRect().top + 100) < 2), 'Imprints remain anchored to the document after arrival')
  assert.deepEqual(errors, [])
  console.log(`${type.name()}: case-study capture exclusion, preserved eligible history, old-cache cleanup, solid gray Work covers, PNG/AVIF/canvas alpha, grayscale, mobile menu capture, cover/contain, two-layer limit, dissolve, SVG capture, reverse theme loops, reload, back/forward, resize, reduced motion and storage fallback passed`)
  await context.close()
}
finally {
  await browser.close()
}
