import assert from 'node:assert/strict'
import { mkdir } from 'node:fs/promises'
import process from 'node:process'

import { chromium } from 'playwright'

const baseURL = process.env.STAGING_URL || 'http://127.0.0.1:3100'
const browser = await chromium.launch()
const errors = []
await mkdir('artifacts/staging', { recursive: true })

try {
  for (const width of [1440, 768, 390, 320]) {
    const context = await browser.newContext({ baseURL, viewport: { width, height: 900 }, hasTouch: width < 1024 })
    const page = await context.newPage()
    page.on('pageerror', error => errors.push(error.message))
    page.on('console', (message) => {
      if (message.type() === 'error' && /hydration|cannot update/i.test(message.text()))
        errors.push(message.text())
    })
    const frames = new Set()
    page.on('request', (request) => {
      if (request.url().includes('/images/team/'))
        frames.add(request.url())
    })

    const response = await page.goto(`${baseURL}/`)
    assert.equal(response.status(), 200)
    assert.match(response.headers()['x-robots-tag'] || '', /noindex/, 'Use a staging build for this check')
    await page.waitForTimeout(600)
    assert.equal(await page.locator('[aria-label="[object Object]"]').count(), 0)
    assert.equal(await page.locator('#team').count(), 1)
    assert.ok(frames.size < 122, 'Portrait sequence should wait until Team approaches the viewport')
    if (width >= 768)
      assert.equal(await page.locator('.p5').first().evaluate(el => getComputedStyle(el).fontSize), '10px')

    if (width === 1440) {
      const member = page.locator('.memberLink').last()
      await member.scrollIntoViewIfNeeded()
      await member.focus()
      await member.press('Enter')
      await page.waitForFunction(() => document.querySelector('.memberLink.button--active')?.textContent?.includes('Dasha'))
      await page.waitForTimeout(1200)
      await page.screenshot({ path: 'artifacts/staging/team-desktop.png' })
    }

    await page.goto(`${baseURL}/work`)
    await page.evaluate(() => document.fonts.ready)
    await page.waitForTimeout(600)
    assert.equal(await page.getByRole('button', { name: 'DataLane' }).count(), 0)
    const titleFits = await page.locator('h1').evaluate((el) => {
      const range = document.createRange()
      range.selectNodeContents(el.lastElementChild.lastElementChild)
      return range.getBoundingClientRect().right <= window.innerWidth
    })
    assert.ok(titleFits, `Project title is clipped at ${width}px`)
    await page.screenshot({ path: `artifacts/staging/work-${width}.png` })

    const circus = page.getByRole('button', { name: 'Circus', exact: true })
    await page.keyboard.press('Tab')
    await circus.focus()
    await page.waitForFunction(() => document.activeElement?.matches(':focus-visible') && getComputedStyle(document.activeElement).outlineWidth === '1px')
    await circus.press('Enter')
    await page.waitForFunction(() => document.querySelector('h1')?.textContent?.includes('Circus'))

    if (width < 768) {
      await page.getByRole('button', { name: 'Menu', exact: true }).click()
      assert.equal(await page.getByRole('dialog').count(), 1)
      await page.keyboard.press('Escape')
      assert.equal(await page.getByRole('dialog').count(), 0)
    }

    await page.goto(`${baseURL}/process`)
    assert.equal(await page.locator('[aria-hidden] a:not([inert] a)').count(), 0, 'Decorative links must be inert')
    assert.ok(!(await page.locator('meta[property="og:image"]').getAttribute('content')).includes('localhost'))

    await page.goto(`${baseURL}/work/stars-honey`)
    await page.waitForFunction(() => document.documentElement.dataset.theme === 'dark')
    assert.ok(await page.locator('video[src]').count() <= 1, 'Offscreen videos should not all load at once')
    const video = page.locator('video').first()
    await video.scrollIntoViewIfNeeded()
    await page.waitForFunction(() => !!document.querySelector('video')?.getAttribute('src'))
    assert.equal(await video.evaluate(el => el.controls), true)
    assert.ok(await video.getAttribute('poster'))
    assert.ok((await page.request.get(await page.locator('link[rel="icon"]').first().getAttribute('href'))).ok())

    await page.getByRole('link', { name: 'Close', exact: true }).click()
    await page.waitForFunction(() => document.documentElement.dataset.theme === 'light')
    if (width >= 1024) {
      for (let visit = 0; visit < 3; visit++) {
        await page.getByRole('link', { name: 'About', exact: true }).click()
        await page.waitForTimeout(300)
        assert.equal(await page.locator('html').getAttribute('data-theme'), 'light')
        await page.getByRole('link', { name: 'Work', exact: true }).click()
      }
    }
    await context.close()
  }

  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' })
  const page = await context.newPage()
  await page.goto(`${baseURL}/`)
  await page.waitForTimeout(600)
  const marquee = page.locator('.service').first()
  const before = await marquee.evaluate(el => getComputedStyle(el).transform)
  await page.waitForTimeout(300)
  assert.equal(await marquee.evaluate(el => getComputedStyle(el).transform), before, 'Reduced motion must stop the marquee')
  assert.equal(await page.locator('.team-track').evaluate(el => getComputedStyle(el).flexDirection), 'column')
  assert.equal(await page.locator('.home-loop').evaluate(el => getComputedStyle(el).display), 'none')
  const sitemap = await page.request.get(`${baseURL}/sitemap.xml`)
  assert.ok(!(await sitemap.text()).includes('/work/datalane'), 'DataLane must remain hidden')
  assert.deepEqual(errors, [], 'Browser runtime errors')
  await context.close()
  console.log('Staging smoke check passed at 1440, 768, 390 and 320px, including keyboard and reduced-motion checks.')
}
finally {
  await browser.close()
}
