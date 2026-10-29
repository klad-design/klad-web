import assert from 'node:assert/strict'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import process from 'node:process'

import { chromium, firefox, webkit } from 'playwright'

import { assertImprintInversion, assertInversion, assertLogoBounds, assertLogoPhotoInversion, assertPageInversion, imageDifference, pngPixels, pngRegion } from './assert-inversion.mjs'
import { isCanceledRoutePrefetch, replaceDocument } from './document-test-navigation.mjs'

import './check-logo-interpolation.mjs'

const frozenLogo = await readFile('public/images/logo-still.svg', 'utf8')
const motionLogo = await readFile('public/images/logo-scroll-motion.svg', 'utf8')
assert.doesNotMatch(frozenLogo, /<animate(?:Transform)?\b/)
const baseURL = process.env.STAGING_URL || 'http://127.0.0.1:3100'
const artifacts = 'artifacts/header-logo'
const failures = []
let checked = 0
await mkdir(artifacts, { recursive: true })

async function check(label, page, task) {
  if (process.env.STAGING_CHECK && !label.includes(process.env.STAGING_CHECK))
    return
  checked++
  try {
    await task()
    console.log(`PASS ${label}`)
  }
  catch (error) {
    failures.push(`${label}: ${error.stack}`)
    console.error(`FAIL ${label}: ${error.message}`)
    await page.screenshot({ path: `${artifacts}/${label}-failure.png` }).catch(() => {})
  }
}

async function ready(page, mode) {
  await page.waitForFunction(() => document.fonts.status === 'loaded')
  await page.waitForFunction((sample) => {
    const visual = document.querySelector(`[data-header-logo][data-logo-mode="${sample.mode}"]`)
    const svg = visual?.querySelector('svg')
    const limit = document.documentElement.scrollHeight - innerHeight
    const expected = limit > 0 ? scrollY / limit * 2 : 0
    const time = svg?.getCurrentTime()
    const valid = svg?.animationsPaused() && svg.getAttribute('viewBox') === '106 180 748 600' && svg.querySelector('#logo-body')?.getBoundingClientRect().width > 20
    const stable = valid && sample.y === scrollY && sample.limit === limit && sample.time === time && Math.abs(time - expected) < 0.015
    if (!stable)
      sample.stableSince = performance.now()
    sample.y = scrollY
    sample.limit = limit
    sample.time = time
    return sample.mode === 'scroll' ? stable && performance.now() - sample.stableSince >= 200 : valid
  }, { mode, y: null, limit: null, time: null, stableSince: 0 })
}

async function state(logo) {
  return logo.evaluate((svg) => {
    const bounds = svg.querySelector('#logo-body').getBBox()
    const matrix = svg.querySelector('#logo-word-face').getCTM()
    return {
      time: svg.getCurrentTime(),
      scrollTime: scrollY / (document.documentElement.scrollHeight - innerHeight) * 2,
      paused: svg.animationsPaused(),
      body: [bounds.x, bounds.y, bounds.width, bounds.height],
      lettering: [matrix.a, matrix.b, matrix.c, matrix.d, matrix.e, matrix.f],
      scale: svg.querySelector('#logo-word-scale').transform.animVal.getItem(0).matrix.d,
    }
  })
}

async function scroll(page, progress) {
  await page.waitForFunction(() => !document.documentElement.classList.contains('lenis-smooth'))
  await page.waitForFunction((progress) => {
    const limit = document.documentElement.scrollHeight - innerHeight
    const target = progress * limit
    if (Math.abs(scrollY - target) > 2) {
      scrollTo(0, target)
      return false
    }
    const svg = document.querySelector('[data-logo-mode="scroll"] svg')
    return svg && Math.abs(svg.getCurrentTime() - scrollY / limit * 2) < 0.015
  }, progress)
  await page.waitForFunction(() => !document.documentElement.classList.contains('lenis-smooth'))
  await ready(page, 'scroll')
}

async function navigate(page, name, path) {
  if (await page.getByRole('button', { name: 'Menu', exact: true }).isVisible()) {
    await page.getByRole('button', { name: 'Menu', exact: true }).click()
    await page.getByRole('dialog').waitFor()
    await page.waitForFunction(() => [...document.querySelectorAll('[role="dialog"] .menuItem')].every(element => Number(getComputedStyle(element).opacity) > 0.98))
  }
  await page.getByRole('link', { name, exact: true }).click()
  await page.waitForURL(`**${path}`)
}

async function assertSharedArtwork(page, logo) {
  // Compare approved geometry with matching source ink; page probes verify calibrated output.
  const markup = (await logo.evaluate(svg => svg.outerHTML)).replaceAll('#E7E7E7', '#E6E6E6').replaceAll('#000000', '#010101')
  await page.evaluate(async (markup) => {
    const box = document.createElement('div')
    box.id = 'artwork-probe'
    box.style.cssText = 'position:fixed;top:0;left:0;width:160px;height:80px;background:#E6E6E6;isolation:isolate;z-index:2147483647;pointer-events:none'
    const svg = new DOMParser().parseFromString(markup, 'image/svg+xml').documentElement
    // Keep probe references independent from the real page's SVG IDs.
    const ids = [...svg.querySelectorAll('[id]')].map(element => element.id)
    for (const element of [svg, ...svg.querySelectorAll('*')]) {
      for (const attribute of [...element.attributes]) {
        let value = attribute.value
        if (attribute.name === 'id') {
          value = `probe-${value}`
        }
        else {
          for (const id of ids) value = value.replaceAll(`#${id}`, `#probe-${id}`)
        }
        element.setAttribute(attribute.name, value)
      }
    }
    for (let index = 0; index < 2; index++) {
      const visual = document.createElement('div')
      visual.className = 'inverted-ui'
      visual.style.cssText = `position:absolute;top:0;left:${index * 80}px;width:80px;height:80px`
      if (index) {
        const image = new Image()
        image.src = '/images/logo-still.svg'
        image.style.cssText = 'display:block;width:80px;height:80px'
        visual.append(image)
        await image.decode()
      }
      else {
        visual.append(svg)
      }
      box.append(visual)
    }
    document.body.append(box)
    svg.pauseAnimations()
    svg.setCurrentTime(0)
    await new Promise(resolve => requestAnimationFrame(resolve))
  }, markup)
  try {
    const first = await page.screenshot({ clip: { x: 0, y: 0, width: 80, height: 80 } })
    const second = await page.screenshot({ clip: { x: 80, y: 0, width: 80, height: 80 } })
    const delta = await imageDifference(first, second)
    assert.ok(delta.mean < 0.15, `Frozen artwork matches the inline animated starting frame (${delta.mean.toFixed(3)} error)`)
  }
  finally {
    await page.locator('#artwork-probe').evaluate(element => element.remove())
  }
}

async function assertIntegerLogoBounds(page) {
  const slot = page.locator('.header-logo-slot').first()
  const original = await slot.getAttribute('style')
  try {
    await slot.evaluate((element) => {
      const bounds = element.getBoundingClientRect()
      element.style.transform = 'translate(0.375px, 0.625px)'
      element.style.width = `${bounds.width + 0.5}px`
      element.style.height = `${bounds.height + 0.25}px`
      window.dispatchEvent(new Event('resize'))
    })
    await page.waitForFunction(() => {
      const anchor = document.querySelector('.header-logo-slot').getBoundingClientRect()
      const visual = document.querySelector('[data-header-logo]').getBoundingClientRect()
      return ['left', 'top', 'width', 'height'].every(key => Number.isInteger(visual[key]) && visual[key] === Math.round(anchor[key]))
    })
  }
  finally {
    await slot.evaluate((element, original) => {
      original === null ? element.removeAttribute('style') : element.setAttribute('style', original)
      window.dispatchEvent(new Event('resize'))
    }, original)
  }
}

function borderContrast({ data, width, height }, bounds, clip) {
  const left = bounds.x - clip.x
  const top = bounds.y - clip.y
  const right = left + bounds.width
  const bottom = top + bounds.height
  function mean(position, start, end, vertical) {
    let total = 0
    for (let value = start; value <= end; value++) {
      const x = Math.max(0, Math.min(width - 1, vertical ? Math.round(position) : value))
      const y = Math.max(0, Math.min(height - 1, vertical ? value : Math.round(position)))
      total += data[(y * width + x) * 4]
    }
    return total / (end - start + 1)
  }
  const x1 = Math.ceil(left + 8)
  const x2 = Math.floor(right - 8)
  const y1 = Math.ceil(top + 8)
  const y2 = Math.floor(bottom - 8)
  const edges = []
  for (const offset of [-1, 0, 1]) {
    edges.push(['top', mean(top + offset, x1, x2, false) - mean(top - 4, x1, x2, false)])
    edges.push(['bottom', mean(bottom - 1 + offset, x1, x2, false) - mean(bottom + 3, x1, x2, false)])
    edges.push(['left', mean(left + offset, y1, y2, true) - mean(left - 4, y1, y2, true)])
    edges.push(['right', mean(right - 1 + offset, y1, y2, true) - mean(right + 3, y1, y2, true)])
  }
  return edges.reduce((worst, edge) => Math.abs(edge[1]) > Math.abs(worst[1]) ? edge : worst, ['none', 0])
}

async function captureRegisteredLogo(page, bounds, dpr) {
  const full = await page.screenshot({ scale: 'device' })
  const pixels = await pngPixels(full)
  let top = Infinity
  let bottom = -Infinity
  let count = 0
  for (let y = 0; y < pixels.height; y++) {
    for (let x = Math.ceil(4 * dpr); x < Math.floor(8 * dpr); x++) {
      const index = (y * pixels.width + x) * 4
      if (pixels.data[index] > 250 && pixels.data[index + 1] < 3 && pixels.data[index + 2] > 250) {
        top = Math.min(top, y)
        bottom = Math.max(bottom, y)
        count++
      }
    }
  }
  assert.ok(count >= 4 * dpr && bottom - top + 1 <= Math.ceil(4 * dpr) + 1, 'Every live frame has one unambiguous fixed registration marker')
  // Firefox reads scrollY before taking its document snapshot; register the actual viewport origin.
  const shift = (top + bottom + 1) / 2 - 202 * dpr
  const physical = { x: bounds.x * dpr, y: bounds.y * dpr + shift, width: bounds.width * dpr, height: bounds.height * dpr }
  const clip = { x: Math.max(0, Math.floor(physical.x) - 6), y: Math.max(0, Math.floor(physical.y) - 6) }
  clip.width = Math.min(pixels.width, Math.ceil(physical.x + physical.width) + 6) - clip.x
  clip.height = Math.min(pixels.height, Math.ceil(physical.y + physical.height) + 6) - clip.y
  const png = await pngRegion(full, { left: clip.x, top: clip.y, width: clip.width, height: clip.height })
  return { full, png, shift, physical, clip }
}

async function assertLogoPaintGuard(page, visual) {
  const style = await page.addStyleTag({ content: '[data-page-noise]{display:none!important}html,body{transition:none!important}' })
  const original = await visual.evaluate(element => ({ theme: document.documentElement.dataset.theme, style: element.getAttribute('style'), time: element.querySelector('svg').getCurrentTime() }))
  const bounds = await visual.boundingBox()
  const dpr = await page.evaluate(() => devicePixelRatio)
  const physical = { x: bounds.x * dpr, y: bounds.y * dpr, width: bounds.width * dpr, height: bounds.height * dpr }
  const clip = { x: Math.max(0, Math.floor(physical.x) - 6), y: Math.max(0, Math.floor(physical.y) - 6), width: Math.ceil(physical.width) + 13, height: Math.ceil(physical.height) + 13 }
  async function capture() {
    await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))))
    const full = await page.screenshot({ scale: 'device' })
    const pixels = await pngPixels(full)
    clip.width = Math.min(pixels.width, Math.ceil(physical.x + physical.width) + 6) - clip.x
    clip.height = Math.min(pixels.height, Math.ceil(physical.y + physical.height) + 6) - clip.y
    return pngRegion(full, { left: clip.x, top: clip.y, width: clip.width, height: clip.height })
  }
  try {
    const mask = await visual.evaluate((element) => {
      const computed = getComputedStyle(element)
      return { image: computed.maskImage, size: computed.maskSize, position: computed.maskPosition, repeat: computed.maskRepeat }
    })
    assert.match(mask.image, /linear-gradient/, 'The logo has a transparent paint guard')
    assert.equal(mask.size, 'calc(100% - 4px) calc(100% - 4px)', 'Only the spare two-pixel artwork frame is transparent')
    assert.equal(mask.position, '50% 50%')
    assert.equal(mask.repeat, 'no-repeat')
    for (const theme of ['light', 'dark']) {
      await page.evaluate(theme => document.documentElement.dataset.theme = theme, theme)
      for (const time of [0, 0.8, 1, 1.2, 2]) {
        await visual.locator('svg').evaluate((svg, time) => svg.setCurrentTime(time), time)
        const guarded = await capture()
        await visual.evaluate(element => element.style.maskImage = 'none')
        const unguarded = await capture()
        await visual.evaluate(element => element.style.removeProperty('mask-image'))
        const delta = await imageDifference(guarded, unguarded)
        const before = await pngPixels(unguarded)
        const after = await pngPixels(guarded)
        let interiorMaximum = 0
        let opaqueMaximum = 0
        for (let y = 0; y < before.height; y++) {
          for (let x = 0; x < before.width; x++) {
            const index = (y * before.width + x) * 4
            const difference = Math.max(...[0, 1, 2].map(channel => Math.abs(before.data[index + channel] - after.data[index + channel])))
            const localX = x + clip.x + 0.5 - physical.x
            const localY = y + clip.y + 0.5 - physical.y
            if (localX >= 2 * dpr && localX < physical.width - 2 * dpr && localY >= 2 * dpr && localY < physical.height - 2 * dpr)
              interiorMaximum = Math.max(interiorMaximum, difference)
            if (before.data[index] === (theme === 'light' ? 1 : 230))
              opaqueMaximum = Math.max(opaqueMaximum, difference)
          }
        }
        const preserved = interiorMaximum <= 3 && opaqueMaximum <= 1 && delta.mean < 0.01
        if (!preserved) {
          await writeFile(`${artifacts}/guard-preservation-before.png`, unguarded)
          await writeFile(`${artifacts}/guard-preservation-after.png`, guarded)
        }
        assert.ok(preserved, `Guard removes filter paint only within its transparent frame on ${theme} at ${time}s (interior ${interiorMaximum}/255, opaque body ${opaqueMaximum}/255, mean ${delta.mean.toFixed(5)})`)
      }
    }
    const baseline = await capture()
    await visual.evaluate((element) => {
      const border = document.createElement('span')
      border.id = 'logo-internal-seam-probe'
      border.style.cssText = 'position:absolute;inset:0;border:1px solid rgb(231 231 231 / 12%);pointer-events:none'
      element.append(border)
    })
    const guarded = await capture()
    const internalDelta = await imageDifference(baseline, guarded)
    assert.ok(internalDelta.maximum <= 1 && internalDelta.mean < 0.01, 'The alpha-zero frame blocks internal filter or animation edge paint')
    await visual.evaluate(element => element.style.visibility = 'hidden')
    const backdrop = await pngPixels(await capture())
    await visual.evaluate(element => element.style.removeProperty('visibility'))
    const actual = await pngPixels(guarded)
    let measured = 0
    for (let y = 0; y < actual.height; y++) {
      for (let x = 0; x < actual.width; x++) {
        const localX = x + clip.x + 0.5 - physical.x
        const localY = y + clip.y + 0.5 - physical.y
        if (localX < 0 || localX >= physical.width || localY < 0 || localY >= physical.height || (localX >= dpr && localX < physical.width - dpr && localY >= dpr && localY < physical.height - dpr))
          continue
        const index = (y * actual.width + x) * 4
        for (const channel of [0, 1, 2])
          assert.ok(Math.abs(actual.data[index + channel] - backdrop.data[index + channel]) <= 1, 'The outer logo frame equals the real backdrop, including underlying imprints')
        measured++
      }
    }
    assert.ok(measured >= bounds.width + bounds.height, 'Measure the full transparent frame around the logo')
    await visual.evaluate(element => element.style.maskImage = 'none')
    assert.ok((await imageDifference(baseline, await capture())).maximum > 5, 'The internal paint probe must be visible without the guard')
    await visual.evaluate(element => element.style.removeProperty('mask-image'))
    await page.locator('#logo-internal-seam-probe').evaluate(element => element.remove())
    await visual.evaluate((element) => {
      const bounds = element.getBoundingClientRect()
      const border = document.createElement('span')
      border.id = 'logo-external-seam-probe'
      border.style.cssText = `position:fixed;left:${bounds.left}px;top:${bounds.bottom}px;width:${bounds.width}px;height:1px;background:rgb(231 231 231 / 12%);z-index:2147483647;pointer-events:none`
      document.body.append(border)
    })
    const external = await capture()
    assert.ok(Math.abs(borderContrast(await pngPixels(external), physical, clip)[1]) > 5, 'The detector must reject a real faint one-pixel seam outside the guarded logo')
  }
  finally {
    await page.locator('#logo-internal-seam-probe, #logo-external-seam-probe').evaluateAll(elements => elements.forEach(element => element.remove()))
    await visual.evaluate((element, original) => {
      document.documentElement.dataset.theme = original.theme
      original.style === null ? element.removeAttribute('style') : element.setAttribute('style', original.style)
      element.querySelector('svg').setCurrentTime(original.time)
    }, original)
    await style.evaluate(element => element.remove())
  }
}

async function assertLiveScroll(page, label) {
  const visual = page.locator('[data-header-logo]').first()
  const slot = page.locator('.header-logo-slot').first()
  const original = await slot.getAttribute('style')
  const records = []
  let phase = 'fractional anchor'
  try {
    await page.evaluate(() => {
      const marker = document.createElement('span')
      marker.id = 'logo-registration-probe'
      marker.style.cssText = 'position:fixed;left:4px;top:200px;width:4px;height:4px;background:#ff00fe;z-index:2147483647;pointer-events:none'
      document.body.append(marker)
    })
    await slot.evaluate((element) => {
      const bounds = element.getBoundingClientRect()
      element.style.transform = 'translate(0.375px, 0.625px)'
      element.style.width = `${bounds.width + 0.5}px`
      element.style.height = `${bounds.height + 0.25}px`
      window.dispatchEvent(new Event('resize'))
    })
    await page.mouse.move(600, 400)
    phase = 'native wheel calibration'
    await page.evaluate(() => {
      window.__headerLogoWheelDelta = null
      addEventListener('wheel', event => window.__headerLogoWheelDelta = event.deltaY, { once: true, capture: true, passive: true })
    })
    await page.mouse.wheel(0, 100)
    await page.waitForFunction(() => window.__headerLogoWheelDelta > 0 && !document.documentElement.classList.contains('lenis-smooth'))
    const wheelScale = 100 / await page.evaluate(() => window.__headerLogoWheelDelta)
    assert.ok(Number.isFinite(wheelScale) && wheelScale > 0, 'Measure the actual native event rather than assuming automation delta units')
    phase = 'native approach to loop seam'
    await page.mouse.wheel(0, wheelScale * await page.evaluate(() => (document.documentElement.scrollHeight - innerHeight) * 0.99 - scrollY))
    await page.waitForFunction(() => {
      const progress = scrollY / (document.documentElement.scrollHeight - innerHeight)
      const time = document.querySelector('[data-header-logo] svg').getCurrentTime()
      return !document.documentElement.classList.contains('lenis-smooth') && progress > 0.97 && progress < 1 && Math.abs(time - progress * 2) < 0.015
    })
    phase = 'native loop crossing'
    await page.mouse.wheel(0, wheelScale * await page.evaluate(() => (document.documentElement.scrollHeight - innerHeight) * 0.03))
    await page.waitForFunction(() => !document.documentElement.classList.contains('lenis-smooth') && scrollY / (document.documentElement.scrollHeight - innerHeight) < 0.05 && document.documentElement.dataset.theme === 'dark')
    phase = 'native approach to Team'
    await page.mouse.wheel(0, wheelScale * await page.evaluate(() => (document.documentElement.scrollHeight - innerHeight) * 0.29 - scrollY))
    await page.waitForFunction(() => {
      const progress = scrollY / (document.documentElement.scrollHeight - innerHeight)
      const time = document.querySelector('[data-header-logo] svg').getCurrentTime()
      return !document.documentElement.classList.contains('lenis-smooth') && Math.abs(progress - 0.29) < 0.02 && Math.abs(time - progress * 2) < 0.015
    })
    phase = 'live frames'
    for (let frame = 0; frame < 34; frame++) {
      await page.mouse.wheel(0, 100 * wheelScale)
      const sample = await visual.evaluate(element => ({
        bounds: element.getBoundingClientRect().toJSON(),
        y: scrollY,
        time: element.querySelector('svg').getCurrentTime(),
        moving: document.documentElement.classList.contains('lenis-smooth'),
        noise: getComputedStyle(document.querySelector('[data-page-noise]')).display,
        noiseOpacity: getComputedStyle(document.querySelector('[data-page-noise]')).opacity,
        theme: document.documentElement.dataset.theme,
        dpr: devicePixelRatio,
      }))
      const bounds = sample.bounds
      assert.ok(['x', 'y', 'width', 'height'].every(key => Number.isInteger(bounds[key])), 'Fractional anchors must not produce fractional logo surfaces during scrolling')
      assert.notEqual(sample.noise, 'none', 'Animated noise must remain visible during the stripe regression')
      assert.equal(sample.noiseOpacity, '0.15')
      assert.equal(sample.theme, 'dark')
      const { full, png, shift, physical, clip } = await captureRegisteredLogo(page, bounds, sample.dpr)
      await writeFile(`${artifacts}/${label}-live-${frame}.png`, png)
      const pixels = await pngPixels(png)
      const edge = borderContrast(pixels, physical, clip)
      records.push({ frame, ...sample, wheelScale, captureShift: shift, edge })
      if (Math.abs(edge[1]) > 5)
        await writeFile(`${artifacts}/${label}-live-${frame}-full.png`, full)
      assert.ok(Math.abs(edge[1]) <= 5, `No coherent border seam during real scrolling (${edge[0]} contrast ${edge[1].toFixed(2)}/255, frame ${frame})`)
      if (frame === 0) {
        await visual.evaluate((element) => {
          const bounds = element.getBoundingClientRect()
          const border = document.createElement('span')
          border.id = 'logo-live-external-seam-probe'
          border.style.cssText = `position:fixed;left:${bounds.left}px;top:${bounds.bottom}px;width:${bounds.width}px;height:1px;background:rgb(231 231 231 / 12%);z-index:2147483647;pointer-events:none`
          document.body.append(border)
        })
        try {
          const probe = await captureRegisteredLogo(page, bounds, sample.dpr)
          await writeFile(`${artifacts}/${label}-live-detector-sensitivity.png`, probe.png)
          assert.ok(Math.abs(borderContrast(await pngPixels(probe.png), probe.physical, probe.clip)[1]) > 5, 'Registered live capture must detect a real external faint one-pixel stripe')
        }
        finally {
          await page.locator('#logo-live-external-seam-probe').evaluate(element => element.remove())
        }
      }
    }
    assert.ok(records.filter(sample => sample.moving).length >= 10, 'Capture frames while native wheel scrolling is active')
    assert.ok(records.at(-1).y - records[0].y > 2000, 'Native gestures must traverse the dark Team section and continue beyond it')
    assert.ok(records.at(-1).time - records[0].time > 0.5, 'Live captures must exercise the SVG animation rather than one frozen frame')
  }
  catch (error) {
    const state = await page.evaluate(() => ({ y: scrollY, limit: document.documentElement.scrollHeight - innerHeight, time: document.querySelector('[data-header-logo] svg').getCurrentTime(), theme: document.documentElement.dataset.theme, classes: document.documentElement.className }))
    await writeFile(`${artifacts}/${label}-error.json`, JSON.stringify({ phase, state, error: error.stack }, null, 2))
    throw error
  }
  finally {
    await page.evaluate(() => delete window.__headerLogoWheelDelta)
    await page.locator('#logo-registration-probe, #logo-live-external-seam-probe').evaluateAll(elements => elements.forEach(element => element.remove()))
    await slot.evaluate((element, original) => {
      original === null ? element.removeAttribute('style') : element.setAttribute('style', original)
      window.dispatchEvent(new Event('resize'))
    }, original)
    await writeFile(`${artifacts}/${label}-scroll.json`, JSON.stringify(records, null, 2))
  }
}

async function assertAutoplay(page, label) {
  await page.addInitScript(() => {
    const start = performance.now()
    let previous = 0
    let cycle = -1
    window.__headerLogoAudit = { samples: [] }
    function sample() {
      const svg = document.querySelector('[data-header-logo][data-logo-mode="autoplay"] svg')
      if (!svg)
        return
      const time = svg.getCurrentTime()
      if (time > 0 && previous === 0)
        cycle++
      previous = time
      const bounds = svg.querySelector('#logo-body').getBBox()
      const matrix = svg.querySelector('#logo-word-face').getCTM()
      window.__headerLogoAudit.samples.push({ wall: (performance.now() - start) / 1000, cycle, time, paused: svg.animationsPaused(), body: [bounds.x, bounds.y, bounds.width, bounds.height], lettering: [matrix.a, matrix.b, matrix.c, matrix.d, matrix.e, matrix.f], scale: svg.querySelector('#logo-word-scale').transform.animVal.getItem(0).matrix.d })
    }
    window.__headerLogoAudit.sample = sample
    sample()
    window.__headerLogoAudit.timer = setInterval(sample, 80)
  })
  await page.goto(`${baseURL}/pricing`)
  await ready(page, 'autoplay')
  const visual = page.locator('[data-header-logo]').first()
  const logo = visual.locator('svg')
  const style = await page.addStyleTag({ content: '[data-page-noise]{display:none!important}html,body{transition:none!important}' })
  const firstCycle = await page.evaluate(() => {
    window.__headerLogoAudit.sample()
    return window.__headerLogoAudit.samples.at(-1).cycle + 1
  })
  try {
    const restImages = []
    for (let index = 0; index < 4; index++) {
      const cycle = firstCycle + index
      await page.waitForFunction((cycle) => {
        const sample = window.__headerLogoAudit.samples.at(-1)
        return sample.cycle === cycle && sample.time > 0.6 && sample.time < 1.4
      }, cycle, { timeout: 15000, polling: 40 })
      await visual.screenshot({ path: `${artifacts}/${label}-cycle-${cycle}-active.png` })
      await page.waitForFunction((cycle) => {
        const sample = window.__headerLogoAudit.samples.at(-1)
        return sample.cycle === cycle && sample.time === 0
      }, cycle, { timeout: 5000 })
      restImages.push(await visual.screenshot({ path: `${artifacts}/${label}-cycle-${cycle}-rest.png` }))
      if (index === 0) {
        await page.evaluate(() => scrollTo(0, document.documentElement.scrollHeight / 2))
        assert.equal((await state(logo)).time, 0, 'Secondary page scrolling does not seek its idle animation')
        await page.evaluate(() => scrollTo(0, 0))
      }
    }
    const samples = await page.evaluate(() => window.__headerLogoAudit.samples)
    const starts = []
    const rest = samples.find(sample => sample.cycle === firstCycle && sample.time === 0)
    assert.ok(rest?.body[2] > 100, 'Measure rendered body geometry, not a zero-sized defs path')
    for (let index = 0; index < 4; index++) {
      const cycle = firstCycle + index
      const active = samples.filter(sample => sample.cycle === cycle && sample.time > 0.4 && sample.time < 1.6)
      const idle = samples.filter(sample => sample.cycle === cycle && sample.time === 0)
      assert.ok(active.length >= 3, `Cycle ${cycle}: visible playback has multiple measured frames`)
      assert.ok(active.some(sample => Math.abs(sample.body[3] - rest.body[3]) > 10), `Cycle ${cycle}: body actually animates`)
      assert.ok(active.some(sample => sample.scale < 0.5 && Math.abs(sample.lettering[3] - rest.lettering[3]) > Math.abs(rest.lettering[3]) * 0.5), `Cycle ${cycle}: lettering actually animates with the body`)
      assert.ok(idle.length > 0, `Cycle ${cycle}: idle interval exists`)
      for (const sample of idle) {
        // Firefox can vary a recomputed SVG bbox below 0.001 CSSpx; resting pixels remain exact below.
        assert.ok(sample.body.every((value, coordinate) => Math.abs(value - rest.body[coordinate]) <= 0.01), `Cycle ${cycle}: body endpoint stays fixed throughout rest`)
        assert.deepEqual(sample.lettering, rest.lettering, `Cycle ${cycle}: identical lettering endpoint throughout rest`)
      }
      assert.ok(samples.filter(sample => sample.cycle === cycle).every(sample => sample.paused && sample.time <= 2), `Cycle ${cycle}: native SMIL remains paused within the two-second animation`)
      const first = samples.find(sample => sample.cycle === cycle && sample.time > 0)
      starts.push(first.wall - first.time)
      assert.equal((await imageDifference(restImages[0], restImages[index])).maximum, 0, `Cycle ${cycle}: exact visible resting artwork`)
      if (index)
        assert.ok(starts[index] - starts[index - 1] >= 11.7 && starts[index] - starts[index - 1] <= 15, `Cycle ${cycle}: next playback starts about twelve seconds later (${starts[index] - starts[index - 1]})`)
    }
  }
  finally {
    const samples = await page.evaluate(() => {
      clearInterval(window.__headerLogoAudit.timer)
      return window.__headerLogoAudit.samples
    })
    await writeFile(`${artifacts}/${label}-autoplay.json`, JSON.stringify(samples, null, 2))
    await style.evaluate(element => element.remove())
  }
}

async function assertFallbackPixels(page, locator, theme, label) {
  // A disabled page does not dispatch the load event awaited by addStyleTag.
  await page.evaluate(() => {
    const style = document.createElement('style')
    style.id = 'fallback-probe-style'
    style.textContent = '[data-page-noise]{display:none!important}html,body{transition:none!important}'
    document.head.append(style)
  })
  try {
    assert.equal(await locator.evaluate(image => image.complete && image.naturalWidth > 0), true, `${label}: static artwork loaded`)
    assert.equal(await locator.isVisible(), true, `${label}: fallback is displayed`)
    const { data, width, height } = await pngPixels(await locator.screenshot({ path: `${artifacts}/${label}.png` }))
    let body = 0
    for (let i = 0; i < data.length; i += 4)
      body += Number(theme === 'dark' ? data[i] > 210 : data[i] < 30)
    assert.ok(body > width * height * 0.12, `${label}: fallback body is visible on the actual ${theme} background (${body}/${width * height} pixels)`)
  }
  finally {
    await page.locator('#fallback-probe-style').evaluate(element => element.remove())
  }
}

async function assertLoading(browser, options, label) {
  const context = await browser.newContext(options)
  try {
    for (const kind of ['pending', 'http-error', 'aborted', 'malformed', 'wrong-root', 'missing-artwork', 'missing-body']) {
      const page = await context.newPage()
      let release
      const pending = new Promise(resolve => release = resolve)
      let requested
      const requestSeen = new Promise(resolve => requested = resolve)
      await page.route('**/images/logo-scroll-motion.svg', async (route) => {
        requested()
        if (kind === 'pending') {
          await pending
          await route.fulfill({ contentType: 'image/svg+xml', body: motionLogo })
        }
        else if (kind === 'http-error') {
          await route.fulfill({ status: 404, body: 'Not found' })
        }
        else if (kind === 'aborted') {
          await route.abort()
        }
        else {
          const body = {
            'malformed': '<svg><broken',
            'wrong-root': '<html><body>not SVG</body></html>',
            'missing-artwork': '<svg xmlns="http://www.w3.org/2000/svg"><animate attributeName="opacity" dur="2s" values="0;1"/></svg>',
            'missing-body': '<svg xmlns="http://www.w3.org/2000/svg"><defs><path id="logo-outline" d="M0 0h20v20H0z"><animate attributeName="d" dur="2s" values="M0 0h20v20H0z;M0 0h10v10H0z"/></path></defs></svg>',
          }[kind]
          await route.fulfill({ contentType: 'image/svg+xml', body })
        }
      })
      try {
        await page.goto(baseURL)
        await requestSeen
        await page.waitForSelector('[data-header-logo]')
        await page.waitForTimeout(250)
        const visual = page.locator('[data-header-logo]').first()
        for (const theme of ['light', 'dark']) {
          await page.evaluate(theme => document.documentElement.dataset.theme = theme, theme)
          await page.waitForTimeout(250)
          await assertFallbackPixels(page, visual.locator('img'), theme, `${label}-${kind}-${theme}`)
        }
        assert.equal(await visual.locator('svg').count(), 0, `${kind}: invalid or pending artwork never replaces the static logo`)
        if (kind === 'pending') {
          release()
          await ready(page, 'scroll')
          assert.equal(await visual.locator('img').isVisible(), false, 'A valid fetched SVG replaces the loading artwork')
        }
        assert.equal(await page.locator('parsererror').count(), 0)
      }
      finally {
        release()
        await page.close()
      }
    }
  }
  finally {
    await context.close()
  }
}

async function assertInitial(browser, options, label) {
  for (const disabled of [false, true]) {
    const context = await browser.newContext({ ...options, javaScriptEnabled: !disabled })
    const page = await context.newPage()
    try {
      if (!disabled) {
        await page.addInitScript(() => localStorage.setItem('theme', 'dark'))
        await page.route('**/_next/**/*.js*', route => route.abort())
      }
      await page.goto(`${baseURL}/pricing`)
      const initial = page.locator('[data-header-logo-initial]')
      if (!disabled)
        await page.waitForFunction(() => document.documentElement.dataset.theme === 'dark')
      await assertFallbackPixels(page, initial, disabled ? 'light' : 'dark', `${label}-${disabled ? 'no-js' : 'cached-dark'}`)
      assert.equal(await page.locator('[data-header-logo]').count(), 0, 'Initial artwork works before hydration')
      const link = page.getByRole('link', { name: 'Klad Syndicate home' })
      assert.equal(await link.isVisible(), true)
      assert.equal(await link.getAttribute('href'), '/')
      if (disabled) {
        await link.click()
        await page.waitForURL(`${baseURL}/`)
        await assertFallbackPixels(page, page.locator('[data-header-logo-initial]'), 'light', `${label}-no-js-home`)
      }
    }
    finally {
      await context.close()
    }
  }
}

async function runLayout(browser, name, mobile) {
  const label = `${name}-${mobile ? 'touch' : 'desktop'}`
  const options = { viewport: mobile ? { width: 390, height: 844 } : { width: 1440, height: 900 }, hasTouch: mobile, ...(name === 'firefox' ? {} : { isMobile: mobile }), reducedMotion: 'no-preference' }
  const context = await browser.newContext(options)
  const page = await context.newPage()
  page.setDefaultTimeout(15000)
  const errors = []
  function recordError(page, error) {
    if (isCanceledRoutePrefetch(page, error)) {
      console.log(`${label}: outgoing route prefetch canceled during document replacement`)
      return
    }
    const message = `${page.url()}: ${error.stack || error.message}`
    errors.push(message)
    console.error(`${label} browser runtime error: ${message}`)
  }
  context.on('page', page => page.on('pageerror', error => recordError(page, error)))
  page.on('pageerror', error => recordError(page, error))
  // Home scroll changes the persisted theme; keep the playback pixel reference in its own storage context.
  const autoplayContext = await browser.newContext(options)
  const autoplayPage = await autoplayContext.newPage()
  autoplayPage.on('pageerror', error => recordError(autoplayPage, error))
  try {
    await check(`${label}-autoplay-four-cycles`, autoplayPage, () => assertAutoplay(autoplayPage, label)).finally(() => autoplayContext.close())
    await replaceDocument(page, () => page.goto(baseURL))
    await ready(page, 'scroll')
    const inkStyle = await page.locator('.page-imprints-ink').evaluate((ink) => {
      const bounds = ink.getBoundingClientRect()
      const computed = getComputedStyle(ink)
      return { position: computed.position, mask: computed.maskImage, x: bounds.x, width: bounds.width, height: bounds.height, rootContain: getComputedStyle(ink.parentElement).contain, scrollAnchor: getComputedStyle(document.body).overflowAnchor }
    })
    assert.equal(inkStyle.position, 'absolute', 'Load current CSS before running logo regressions')
    assert.equal(inkStyle.mask, 'none', 'Imprint ink must not be erased beneath the logo')
    assert.equal(inkStyle.x, 0)
    assert.equal(inkStyle.width, options.viewport.width)
    assert.equal(inkStyle.height, options.viewport.height)
    assert.match(inkStyle.rootContain, /layout/, 'Imprints do not extend the document scroll limit')
    if (name !== 'webkit')
      assert.equal(inkStyle.scrollAnchor, 'none', 'Native anchoring cannot move Lenis-controlled scroll position')
    const visual = page.locator('[data-header-logo]').first()
    const logo = visual.locator('svg')
    await check(`${label}-artwork-and-inversion`, page, async () => {
      assert.equal(await page.locator('[data-header-logo] object').count(), 0)
      assert.equal(await visual.evaluate(element => element.parentElement === document.body), true)
      assert.equal(await page.locator('[data-header-logo-initial]').isVisible(), false)
      const start = await logo.locator('#logo-outline').getAttribute('d')
      const frozen = await page.evaluate(source => new DOMParser().parseFromString(source, 'image/svg+xml').querySelector('#logo-outline').getAttribute('d'), frozenLogo)
      const geometry = path => path.match(/[a-z]|[-+]?(?:\d*\.)?\d+(?:e[-+]?\d+)?/gi).map(token => /^[a-z]$/i.test(token) ? token : Number(token))
      assert.deepEqual(geometry(start), geometry(frozen), 'Static and inline logos share approved geometry')
      await assertSharedArtwork(page, logo)
      assert.equal(await visual.evaluate(element => getComputedStyle(element).filter), 'none', 'Animated ink must not use an outer color-filter surface')
      await assertInversion(page, visual, 'light', visual.locator('img'))
      await assertPageInversion(page, visual)
      await assertLogoPhotoInversion(page, visual)
      await assertImprintInversion(page, visual)
      await assertLogoPaintGuard(page, visual)
      await assertLogoBounds(page, logo)
    })
    await check(`${label}-fractional-anchor`, page, () => assertIntegerLogoBounds(page))
    if (!mobile) {
      for (const deviceScaleFactor of [1.25, 1.5, 2]) {
        await check(`${label}-density-${deviceScaleFactor}`, page, async () => {
          const retina = await browser.newPage({ ...options, viewport: { width: 1438, height: 820 }, deviceScaleFactor })
          try {
            await retina.goto(baseURL)
            await ready(retina, 'scroll')
            await assertIntegerLogoBounds(retina)
            await assertLogoPaintGuard(retina, retina.locator('[data-header-logo]'))
            await assertLogoBounds(retina, retina.locator('[data-header-logo] svg'))
            await assertLiveScroll(retina, `${label}-density-${deviceScaleFactor}`)
          }
          finally {
            await retina.close()
          }
        })
      }
    }
    await check(`${label}-${mobile ? 'scroll-following' : 'live-scroll-frames'}`, page, async () => {
      if (!mobile)
        await assertLiveScroll(page, label)
      await scroll(page, 0.5)
      const before = await state(logo)
      await page.waitForTimeout(200)
      assert.deepEqual(await state(logo), before, 'Home never autoplays while scroll is stationary')
    })
    await check(`${label}-resize`, page, async () => {
      await scroll(page, 0.5)
      await page.setViewportSize(mobile ? { width: 390, height: 600 } : { width: 1440, height: 400 })
      await page.waitForTimeout(1200)
      const expected = await page.evaluate(() => scrollY / (document.documentElement.scrollHeight - innerHeight) * 2)
      const actual = (await state(logo)).time
      await writeFile(`${artifacts}/${label}-resize.json`, JSON.stringify({ expected, actual }, null, 2))
      assert.ok(Math.abs(actual - expected) < 0.015, `Resize resynchronizes without additional scrolling (expected ${expected}, actual ${actual})`)
      assert.equal((await visual.boundingBox()).width, 60, 'Compact logo sizing is preserved')
      await page.setViewportSize(options.viewport)
    })
    await check(`${label}-menu-and-hit-area`, page, async () => {
      await page.setViewportSize(options.viewport)
      const link = page.getByRole('link', { name: 'Klad Syndicate home' })
      const slot = page.locator('.header-logo-slot').first()
      for (const width of mobile ? [320, 390, 768] : [1024, 1440]) {
        await page.setViewportSize({ width, height: options.viewport.height })
        await page.waitForFunction(() => {
          const slot = document.querySelector('.header-logo-slot').getBoundingClientRect()
          const visual = document.querySelector('[data-header-logo]').getBoundingClientRect()
          return ['x', 'y', 'width', 'height'].every(key => Math.abs(slot[key] - visual[key]) < 0.5)
        })
        const a = await slot.boundingBox()
        const b = await visual.boundingBox()
        for (const key of ['x', 'y', 'width', 'height'])
          assert.ok(Math.abs(a[key] - b[key]) < 0.5, `Visible logo and clickable slot align at ${width}px (${key})`)
      }
      await page.setViewportSize(options.viewport)
      await link.focus()
      assert.equal(await link.evaluate(element => element.matches(':focus-visible') && Number.parseFloat(getComputedStyle(element).outlineWidth) > 0), true, 'Logo link has a visible keyboard focus')
      await link.evaluate(element => element.blur())
      if (mobile) {
        const beforeMenu = await page.evaluate(() => scrollY)
        await page.getByRole('button', { name: 'Menu', exact: true }).click()
        const menuLogo = page.locator('[data-logo-mode="static"]')
        await menuLogo.locator('img').evaluate(image => image.decode())
        assert.equal(await menuLogo.locator('img').getAttribute('src'), '/images/logo-still.svg')
        assert.equal(await menuLogo.locator('svg').count(), 0, 'Menu remains static')
        assert.equal(await visual.isVisible(), false, 'Main logo cannot show through the menu')
        await assertInversion(page, menuLogo, 'light', menuLogo.locator('img'))
        await page.waitForFunction(() => [...document.querySelectorAll('[role="dialog"] .menuItem')].every(element => Number(getComputedStyle(element).opacity) > 0.98))
        const afterMenu = await page.evaluate(() => scrollY)
        await writeFile(`${artifacts}/${label}-menu-scroll.json`, JSON.stringify({ beforeMenu, afterMenu }, null, 2))
        assert.ok(Math.abs(afterMenu - beforeMenu) < 2, 'Opening the mobile menu preserves scroll position')
        await page.screenshot({ path: `${artifacts}/${label}-menu.png` })
        await page.getByRole('button', { name: 'Close', exact: true }).click()
        await page.getByRole('button', { name: 'Menu', exact: true }).click()
        await page.setViewportSize({ width: 1024, height: 844 })
        await page.getByRole('dialog').waitFor({ state: 'hidden' })
        await page.setViewportSize(options.viewport)
      }
    })
    await check(`${label}-navigation-and-restoration`, page, async () => {
      await scroll(page, 0.55)
      const original = await page.evaluate(() => scrollY)
      await navigate(page, 'Pricing', '/pricing')
      await ready(page, 'autoplay')
      await page.goBack()
      await page.waitForURL(`${baseURL}/`)
      await ready(page, 'scroll')
      try {
        await page.waitForFunction(original => Math.abs(scrollY - original) < 5, original, { timeout: 5000 })
      }
      finally {
        await writeFile(`${artifacts}/${label}-history.json`, JSON.stringify(await page.evaluate(original => ({ original, restored: scrollY, height: document.documentElement.scrollHeight, viewport: innerHeight }), original), null, 2))
      }
      await ready(page, 'scroll')
      const restored = await state(logo)
      assert.ok(Math.abs(restored.time - restored.scrollTime) < 0.015, 'History restoration restores the logo frame')
      await page.getByRole('link', { name: 'Klad Syndicate home' }).click()
      await page.waitForFunction(() => scrollY < 3)
      await page.waitForFunction(() => document.querySelector('[data-logo-mode="scroll"] svg').getCurrentTime() < 0.015)
      assert.ok((await state(logo)).time < 0.015, 'Clicking the current home logo returns to frame zero')
      await navigate(page, 'Pricing', '/pricing')
      await ready(page, 'autoplay')
      await navigate(page, 'Process', '/process')
      await ready(page, 'autoplay')
      assert.equal(await page.locator('[data-header-logo] svg').count(), 1, 'Secondary route changes leave one animation')
      await replaceDocument(page, () => page.goto(`${baseURL}/work/datalane`))
      await page.waitForTimeout(250)
      assert.equal(await page.locator('[data-header-logo]').count(), 0, 'Case pages clean up the portal')
      assert.equal(await page.locator('[data-header-logo-initial]').isVisible(), false, 'Case pages never display initial artwork')
      await replaceDocument(page, () => page.goto(`${baseURL}/#team`))
      await ready(page, 'scroll')
      await page.waitForFunction(() => scrollY > 100)
      await ready(page, 'scroll')
      const hash = await state(logo)
      assert.ok(Math.abs(hash.time - hash.scrollTime) < 0.015, 'Direct hash positioning scrubs the right frame')
    })
    if (!mobile) {
      await check(`${label}-home-loop`, page, async () => {
        await replaceDocument(page, () => page.goto(baseURL))
        await ready(page, 'scroll')
        await scroll(page, 0.99)
        await page.mouse.move(600, 400)
        const delta = await page.evaluate(() => (document.documentElement.scrollHeight - innerHeight) * 0.03)
        await page.mouse.wheel(0, delta)
        await page.waitForFunction(() => scrollY / (document.documentElement.scrollHeight - innerHeight) < 0.05)
        await ready(page, 'scroll')
        assert.ok((await state(logo)).time < 0.2, 'Logo follows the infinite home seam')
      })
    }
    await check(`${label}-reduced-motion`, page, async () => {
      for (const path of ['/', '/pricing']) {
        await replaceDocument(page, () => page.goto(`${baseURL}${path}`))
        await ready(page, path === '/' ? 'scroll' : 'autoplay')
        for (let iteration = 0; iteration < 2; iteration++) {
          await page.emulateMedia({ reducedMotion: 'reduce' })
          await page.waitForFunction(() => !document.querySelector('[data-header-logo] svg'))
          await visual.locator('img').waitFor({ state: 'visible' })
          assert.equal(await visual.locator('img').isVisible(), true, 'Reduced motion shows the static logo')
          await page.emulateMedia({ reducedMotion: 'no-preference' })
          await ready(page, path === '/' ? 'scroll' : 'autoplay')
          assert.equal(await visual.locator('svg').count(), 1, 'Motion re-enabling has one SVG')
        }
      }
    })
    await check(`${label}-loading-and-validation`, page, () => assertLoading(browser, options, label))
    await check(`${label}-initial-fallback`, page, () => assertInitial(browser, options, label))
    await check(`${label}-client-errors`, page, async () => assert.deepEqual(errors, []))
  }
  finally {
    await context.close()
  }
}

const engines = { chromium, firefox, webkit }
if (process.env.STAGING_BROWSER)
  assert.ok(engines[process.env.STAGING_BROWSER], 'STAGING_BROWSER must be chromium, firefox or webkit')
// Timing and pixel probes must not compete with other rendered test pages.
for (const [name, engine] of Object.entries(engines)) {
  if (process.env.STAGING_BROWSER && name !== process.env.STAGING_BROWSER)
    continue
  const browser = await engine.launch()
  try {
    for (const mobile of [false, true]) {
      try {
        await runLayout(browser, name, mobile)
      }
      catch (error) {
        failures.push(`${name}: ${error.stack}`)
      }
    }
  }
  finally {
    await browser.close()
  }
}
const resultsPath = `${artifacts}/results${process.env.STAGING_BROWSER ? `-${process.env.STAGING_BROWSER}` : ''}${process.env.STAGING_CHECK ? `-${process.env.STAGING_CHECK.replaceAll(/[^a-z\d.-]/gi, '_')}` : ''}.json`
await writeFile(resultsPath, JSON.stringify({ checked, failures }, null, 2))
assert.ok(checked > 0, 'At least one requested logo check must run')
assert.deepEqual(failures, [], `Every logo regression must pass; see ${resultsPath}`)
console.log('All requested logo checks passed.')
