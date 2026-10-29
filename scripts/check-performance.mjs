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
