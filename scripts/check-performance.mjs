import assert from 'node:assert/strict'
import { mkdir, writeFile } from 'node:fs/promises'
import process from 'node:process'

import { chromium, firefox, webkit } from 'playwright'

import { isCanceledRoutePrefetch } from './document-test-navigation.mjs'

const baseURL = process.env.STAGING_URL || 'http://127.0.0.1:3100'
const type = { chromium, firefox, webkit }[process.env.STAGING_BROWSER || 'chromium']
const browser = await type.launch()
const artifacts = `artifacts/performance/${type.name()}`
await mkdir(artifacts, { recursive: true })

try {
  const page = await browser.newPage({ viewport: { width: 1512, height: 982 }, deviceScaleFactor: 2 })
  const errors = []
  page.on('pageerror', (error) => {
    if (!isCanceledRoutePrefetch(page, error))
      errors.push(error.message)
  })
  await page.goto(baseURL)
  await page.waitForFunction(() => !!document.querySelector('[data-header-logo] svg'))
  await page.waitForFunction(() => document.querySelector('[data-world-map]')?.hasAttribute('data-map-raster'))
  const map = await page.locator('[data-world-map]').first().evaluate((element) => {
    const images = [...element.querySelectorAll('img')]
    const image = images.at(-1)
    return { width: image.getBoundingClientRect().width, pixels: image.naturalWidth, dpr: devicePixelRatio, layers: images.length, loading: images[0].loading, priority: images[0].fetchPriority }
  })
  assert.equal(map.layers, 4, 'The cached vector must retain all four scroll-trail layers')
  assert.ok(Math.abs(map.pixels - Math.round(map.width * map.dpr)) <= 1, `The map cache must preserve the current pixel density: ${JSON.stringify(map)}`)
  assert.equal(map.loading, 'eager', 'The initial map must not wait for lazy loading')
  assert.equal(map.priority, 'high', 'The initial map must have high fetch priority')
  const legacy = await page.request.get(`${baseURL}/images/team/0.avif`, { maxRedirects: 0 })
  assert.equal(legacy.status(), 308, 'Already-open pages must retain their legacy portrait URLs')
  assert.equal(legacy.headers().location, '/images/team/v1/0.avif')
  for (const path of ['/images/team/v1/0.avif', '/images/team-mobile/v5/0.avif']) {
    const response = await page.request.get(`${baseURL}${path}`)
    assert.equal(response.status(), 200)
    assert.match(response.headers()['cache-control'], /max-age=31536000.*immutable/, 'Versioned portraits must have immutable caching')
  }
  const staticAssets = await page.evaluate(() => performance.getEntriesByType('resource').map(entry => entry.name).filter(url => /\/_next\/static\/.*(?:world.*\.svg|noise.*\.webp|\.woff2)$/.test(url)))
  assert.ok(staticAssets.length >= 3, 'Map, grain, and font must use generated static URLs')
  for (const url of staticAssets) {
    const response = await page.request.get(url)
    assert.match(response.headers()['cache-control'], /max-age=31536000.*immutable/, `Generated asset must have immutable caching: ${url}`)
  }
  await page.waitForTimeout(1500)
  const rendering = await page.evaluate(async () => {
    const intervals = []
    const switches = []
    for (let index = 0; index < 6; index++) {
      await new Promise(requestAnimationFrame)
      const gaps = []
      let previous = performance.now()
      let running = true
      let frame = 0
      function sample(now) {
        gaps.push(now - previous)
        previous = now
        if (running)
          frame = requestAnimationFrame(sample)
      }
      frame = requestAnimationFrame(sample)
      const theme = index % 2 ? 'light' : 'dark'
      document.documentElement.dataset.theme = theme
      await new Promise(resolve => setTimeout(resolve, 400))
      running = false
      cancelAnimationFrame(frame)
      // Include stalls that outlast the sampling timer before the next RAF can run.
      gaps.push(performance.now() - previous)
      intervals.push(...gaps)
      gaps.sort((a, b) => a - b)
      switches.push({ theme, frames: gaps.length, p95: gaps[Math.floor(gaps.length * 0.95)], max: gaps.at(-1) })
    }
    intervals.sort((a, b) => a - b)
    const svg = document.querySelector('[data-header-logo] svg')
    const started = performance.now()
    for (let index = 0; index < 100; index++)
      svg.setCurrentTime(index / 50)
    return {
      frames: intervals.length,
      p95: intervals[Math.floor(intervals.length * 0.95)],
      max: intervals.at(-1),
      seek100: performance.now() - started,
      switches,
    }
  })
  // CI hardware varies; keep timing data and reject hangs, rather than enforcing a local smoothness budget.
  assert.ok(rendering.frames > 10 && rendering.max < 2000, `Theme changes must not hang for two seconds: ${JSON.stringify(rendering)}`)

  const memory = []
  if (type === chromium) {
    const session = await page.context().newCDPSession(page)
    for (const ratio of [1, 2]) {
      await session.send('Emulation.setDeviceMetricsOverride', { width: 1512, height: 982, deviceScaleFactor: ratio, mobile: false })
      // CDP metric overrides need media reevaluation to emit native resolution changes.
      await session.send('Emulation.setEmulatedMedia', { media: 'screen', features: [{ name: 'prefers-color-scheme', value: ratio === 1 ? 'light' : 'dark' }] })
      await page.waitForFunction(() => {
        const map = document.querySelector('[data-world-map]')
        const image = map?.querySelector('img')
        return map?.hasAttribute('data-map-raster') && image?.complete
          && Math.abs(image.naturalWidth - Math.round(image.getBoundingClientRect().width * devicePixelRatio)) <= 1
      })
    }
    async function cycle() {
      console.log(`Navigation cycle from ${page.url()}`)
      for (const path of ['/pricing', '/expectations', '/process', '/work']) {
        await page.locator(`.site-header a[href="${path}"]`).first().evaluate(link => link.click())
        await page.waitForURL(`**${path}`)
        await page.waitForTimeout(250)
      }
      await page.locator('a[href="/work/datalane"]').first().click()
      await page.waitForURL('**/work/datalane')
      await page.waitForTimeout(1400)
      await page.locator('.case-close a').click()
      await page.waitForURL('**/work?case=datalane')
      await page.waitForTimeout(250)
      await page.locator('.site-header a[href="/"]').first().click()
      await page.waitForURL(`${baseURL}/`)
      await page.waitForFunction(() => !!document.querySelector('[data-header-logo] svg'))
      await page.waitForTimeout(600)
    }
    await cycle()
    await cycle()
    for (let index = 0; index < 4; index++) {
      if (index)
        await cycle()
      await session.send('Runtime.discardConsoleEntries')
      await session.send('HeapProfiler.collectGarbage')
      memory.push(await session.send('Memory.getDOMCounters'))
    }
    assert.ok(memory.at(-1).jsEventListeners <= memory[0].jsEventListeners + 2, `Warmed navigation must release its listeners: ${JSON.stringify(memory)}`)
    assert.ok(memory.at(-1).nodes <= memory[0].nodes + 100, `Warmed navigation must release its DOM: ${JSON.stringify(memory)}`)
  }
  assert.deepEqual(errors, [], 'Performance scenarios must not raise page errors')
  await writeFile(`${artifacts}/measurements.json`, JSON.stringify({ rendering, memory }, null, 2))
  console.log(`${type.name()}: theme p95 ${rendering.p95.toFixed(1)}ms, max ${rendering.max.toFixed(1)}ms; 100 logo seeks ${rendering.seek100.toFixed(1)}ms; ${memory.length ? 'navigation retention passed' : 'rendering checked; retention is covered in Chromium'}.`)
}
finally {
  await browser.close()
}
