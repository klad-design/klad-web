import assert from 'node:assert/strict'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import process from 'node:process'

import { chromium, firefox, webkit } from 'playwright'

import { assertImprintExclusion, assertInversion, assertLogoBounds, assertLogoPhotoInversion, assertPageInversion, imageDifference, pngPixels } from './assert-inversion.mjs'
import { observeRoutePrefetches } from './route-test-observer.mjs'

const frozenLogo = await readFile('public/images/logo-still.svg', 'utf8')
const motionLogo = await readFile('public/images/logo-scroll-motion.svg', 'utf8')
assert.doesNotMatch(frozenLogo, /<animate(?:Transform)?\b/)
const baseURL = process.env.STAGING_URL || 'http://127.0.0.1:3100'
const artifacts = 'artifacts/header-logo'
const failures = []
await mkdir(artifacts, { recursive: true })

async function check(label, page, task) {
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
    const valid = svg?.animationsPaused() && svg.getAttribute('viewBox') === '106 180 748 600' && svg.querySelector('#logo-body')?.getBoundingClientRect().width > 20
    sample.stable = valid && sample.y === scrollY && sample.limit === limit && Math.abs(svg.getCurrentTime() - expected) < 0.015 ? sample.stable + 1 : 0
    sample.y = scrollY
    sample.limit = limit
    return sample.mode === 'scroll' ? sample.stable >= 4 : valid
  }, { mode, y: null, limit: null, stable: 0 })
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
  const markup = await logo.evaluate(svg => svg.outerHTML)
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

async function assertLiveScroll(page, label, mobile) {
  const visual = page.locator('[data-header-logo]').first()
  const logo = visual.locator('svg')
  const style = await page.addStyleTag({ content: 'html,body{transition:none!important}' })
  const records = []
  try {
    for (const theme of ['light', 'dark']) {
      for (const progress of [0, 0.1, 0.25, 0.4, 0.45, 0.48, 0.49, 0.5, 0.51, 0.52, 0.55, 0.6, 0.75, mobile ? 1 : 0.99]) {
        await scroll(page, progress)
        await page.waitForTimeout(200)
        await page.evaluate(theme => document.documentElement.dataset.theme = theme, theme)
        const bounds = await visual.boundingBox()
        const body = await logo.locator('#logo-body').boundingBox()
        const clip = { x: Math.max(0, Math.floor(bounds.x) - 8), y: Math.max(0, Math.floor(bounds.y) - 8) }
        clip.width = Math.min(page.viewportSize().width, Math.ceil(bounds.x + bounds.width) + 8) - clip.x
        clip.height = Math.min(page.viewportSize().height, Math.ceil(bounds.y + bounds.height) + 8) - clip.y
        await page.screenshot({ clip, path: `${artifacts}/${label}-${theme}-scroll-${Math.round(progress * 100)}-live.png` })
        await visual.evaluate(element => element.style.visibility = 'hidden')
        const background = await page.screenshot({ clip })
        // Freeze the captured page pixels for comparison; moving text or noise is not logo paint.
        await page.evaluate(async ({ source, clip }) => {
          const image = new Image()
          image.id = 'logo-backdrop-freeze'
          image.src = `data:image/png;base64,${source}`
          image.style.cssText = `position:fixed;left:${clip.x}px;top:${clip.y}px;width:${clip.width}px;height:${clip.height}px;z-index:39;pointer-events:none`
          await image.decode()
          document.body.append(image)
        }, { source: background.toString('base64'), clip })
        const baseline = await pngPixels(await page.screenshot({ clip, path: `${artifacts}/${label}-${theme}-scroll-${Math.round(progress * 100)}-backdrop.png` }))
        await visual.evaluate(element => element.style.removeProperty('visibility'))
        const png = await page.screenshot({ clip, path: `${artifacts}/${label}-${theme}-scroll-${Math.round(progress * 100)}.png` })
        const pixels = await pngPixels(png)
        await page.locator('#logo-backdrop-freeze').evaluate(element => element.remove())
        let stripes = 0
        let stableBackdrop = 0
        for (let y = 0; y < pixels.height; y++) {
          for (let x = 0; x < pixels.width; x++) {
            const worldX = x + clip.x
            const worldY = y + clip.y
            if (worldX >= body.x - 2 && worldX <= body.x + body.width + 2 && worldY >= body.y - 2 && worldY <= body.y + body.height + 2)
              continue
            const index = (y * pixels.width + x) * 4
            // The approved SVG has a soft halo; detect high-contrast stray lines beyond it.
            stableBackdrop++
            if ([0, 1, 2].some(channel => Math.abs(pixels.data[index + channel] - baseline.data[index + channel]) > 39))
              stripes++
          }
        }
        records.push({ theme, progress, stripes, stableBackdrop, ...(await state(logo)), scroll: await page.evaluate(() => scrollY) })
        assert.ok(stableBackdrop >= 100, 'Live spill check measures stable background beyond the actual body')
        assert.equal(stripes, 0, `No visible stripes beyond the rendered body during actual ${theme} scrolling at ${progress}`)
      }
    }
  }
  finally {
    await page.locator('#logo-backdrop-freeze').evaluateAll(elements => elements.forEach(element => element.remove()))
    await visual.evaluate(element => element.style.removeProperty('visibility'))
    await writeFile(`${artifacts}/${label}-scroll.json`, JSON.stringify(records, null, 2))
    await style.evaluate(element => element.remove())
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
  const style = await page.addStyleTag({ content: 'body::after{display:none!important}html,body{transition:none!important}' })
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
        assert.deepEqual(sample.body, rest.body, `Cycle ${cycle}: identical body endpoint throughout rest`)
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
    style.textContent = 'body::after{display:none!important}html,body{transition:none!important}'
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
  const settleRoutes = observeRoutePrefetches(page, baseURL)
  page.setDefaultTimeout(15000)
  const errors = []
  context.on('page', page => page.on('pageerror', error => errors.push(`${page.url()}: ${error.stack}`)))
  page.on('pageerror', error => errors.push(`${page.url()}: ${error.stack}`))
  // Home scroll changes the persisted theme; keep the playback pixel reference in its own storage context.
  const autoplayContext = await browser.newContext(options)
  const autoplayPage = await autoplayContext.newPage()
  const settleAutoplay = observeRoutePrefetches(autoplayPage, baseURL)
  autoplayPage.on('pageerror', error => errors.push(`${autoplayPage.url()}: ${error.stack}`))
  try {
    await check(`${label}-autoplay-four-cycles`, autoplayPage, () => assertAutoplay(autoplayPage, label)).finally(async () => {
      try {
        await settleAutoplay()
      }
      finally {
        await autoplayContext.close()
      }
    })
    await page.goto(baseURL)
    await ready(page, 'scroll')
    const inkStyle = await page.locator('.page-imprints-ink').evaluate((ink) => {
      const bounds = ink.getBoundingClientRect()
      const computed = getComputedStyle(ink)
      return { position: computed.position, mask: computed.maskImage, x: bounds.x, width: bounds.width, height: bounds.height, rootContain: getComputedStyle(ink.parentElement).contain, scrollAnchor: getComputedStyle(document.body).overflowAnchor }
    })
    assert.equal(inkStyle.position, 'absolute', 'Load current CSS before running logo regressions')
    assert.match(inkStyle.mask, /radial-gradient/, 'Decorative ink uses the current padded exclusion mask')
    assert.equal(inkStyle.x, -16)
    assert.equal(inkStyle.width, options.viewport.width + 32)
    assert.equal(inkStyle.height, options.viewport.height + 32)
    assert.match(inkStyle.rootContain, /layout/, 'Padded imprints do not extend the document scroll limit')
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
      assert.equal(start, frozen, 'Static and inline logos share approved geometry')
      await assertSharedArtwork(page, logo)
      await assertInversion(page, visual)
      await assertPageInversion(page, visual)
      await assertLogoPhotoInversion(page, visual)
      await assertImprintExclusion(page, visual)
      await assertLogoBounds(page, logo)
    })
    await check(`${label}-actual-scroll-frames`, page, async () => {
      await assertLiveScroll(page, label, mobile)
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
        await assertInversion(page, menuLogo)
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
      await settleRoutes()
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
      await settleRoutes()
      await page.goto(`${baseURL}/work/datalane`)
      await page.waitForTimeout(250)
      assert.equal(await page.locator('[data-header-logo]').count(), 0, 'Case pages clean up the portal')
      assert.equal(await page.locator('[data-header-logo-initial]').isVisible(), false, 'Case pages never display initial artwork')
      await settleRoutes()
      await page.goto(`${baseURL}/#team`)
      await ready(page, 'scroll')
      await page.waitForFunction(() => scrollY > 100)
      await ready(page, 'scroll')
      const hash = await state(logo)
      assert.ok(Math.abs(hash.time - hash.scrollTime) < 0.015, 'Direct hash positioning scrubs the right frame')
    })
    if (!mobile) {
      await check(`${label}-home-loop`, page, async () => {
        await settleRoutes()
        await page.goto(baseURL)
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
        await settleRoutes()
        await page.goto(`${baseURL}${path}`)
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
    await settleRoutes()
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
await writeFile(`${artifacts}/results.json`, JSON.stringify({ failures }, null, 2))
assert.deepEqual(failures, [], 'Every logo regression must pass; see artifacts/header-logo/results.json')
console.log('All logo checks passed across the requested desktop and touch browser matrix.')
