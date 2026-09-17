import assert from 'node:assert/strict'
import { mkdir } from 'node:fs/promises'
import process from 'node:process'

import { chromium, firefox, webkit } from 'playwright'

const type = { chromium, firefox, webkit }[process.env.STAGING_BROWSER || 'chromium']
const baseURL = process.env.STAGING_URL || 'http://127.0.0.1:3100'
const browser = await type.launch()
const artifacts = `artifacts/work-fixes/${type.name()}`
await mkdir(artifacts, { recursive: true })
const errors = []

async function selected(page, name) {
  await page.waitForFunction(name => document.querySelector('button[aria-pressed="true"]')?.getAttribute('aria-label') === name && document.querySelector('h1')?.textContent.includes(name), name)
  await page.waitForFunction(() => [...document.querySelectorAll('.case-anim-target')].every(el => Number(getComputedStyle(el).opacity) > 0.99))
}

async function noise(page, overMedia) {
  await page.waitForFunction(overMedia => document.documentElement.dataset.theme === (overMedia ? 'light' : 'dark'), overMedia)
  const overlay = await page.evaluate(() => {
    const style = getComputedStyle(document.body, '::after')
    return { display: style.display, opacity: style.opacity, zIndex: Number(style.zIndex) }
  })
  assert.notEqual(overlay.display, 'none', 'Noise must remain on the page background and text')
  assert.equal(overlay.opacity, '0.15')
  if (!overMedia) {
    const media = await page.locator('main img, main video').evaluateAll(elements => elements.map((el) => {
      const style = getComputedStyle(el)
      return { position: style.position, zIndex: Number(style.zIndex), background: style.backgroundColor }
    }))
    assert.ok(media.length > 0 && media.every(el => el.position === 'relative' && el.zIndex > overlay.zIndex && el.background === 'rgb(0, 0, 0)'), 'Case media must cover the noise, including transparent or unloaded areas')
  }
}

try {
  const desktop = await browser.newContext({ baseURL, viewport: { width: 1440, height: 900 } })
  const page = await desktop.newPage()
  page.on('pageerror', error => errors.push(error.message))
  await page.goto('/work')
  await selected(page, 'Circus')
  await noise(page, true)
  for (const delay of [30, 60]) {
    await page.evaluate(async (delay) => {
      document.querySelector('button[aria-label="Stars+Honey"]').click()
      await new Promise(resolve => setTimeout(resolve, delay))
      document.querySelector('button[aria-label="Circus"]').click()
    }, delay)
    await selected(page, 'Circus')
  }

  await page.getByRole('button', { name: 'Chainviz', exact: true }).click()
  await selected(page, 'Chainviz')
  await page.getByRole('link', { name: 'View Chainviz case study' }).click()
  await page.waitForURL('**/work/chainviz')
  await noise(page, false)
  await page.locator('main img').first().evaluate(el => el.decode())
  await page.waitForTimeout(250)
  await page.screenshot({ path: `${artifacts}/case-clean-media.png` })
  await page.getByRole('link', { name: 'Close', exact: true }).click()
  await page.waitForURL('**/work?case=chainviz')
  await selected(page, 'Chainviz')
  await noise(page, true)
  await page.goBack()
  await page.waitForURL('**/work/chainviz')
  await page.goBack()
  await selected(page, 'Chainviz')
  await page.reload()
  await selected(page, 'Chainviz')
  await page.getByRole('link', { name: 'Pricing', exact: true }).click()
  await page.waitForURL('**/pricing')
  await page.getByRole('link', { name: 'Work', exact: true }).click()
  await selected(page, 'Circus')

  for (const name of ['Stars+Honey', 'Linux Mint', 'Shareio', 'Chainviz', 'Circus']) {
    await page.getByRole('button', { name, exact: true }).click()
    await selected(page, name)
    await page.getByRole('link', { name: `View ${name} case study` }).click()
    await noise(page, false)
    await page.getByRole('link', { name: 'Close', exact: true }).click()
    await selected(page, name)
  }
  await page.screenshot({ path: `${artifacts}/work-desktop.png` })
  for (const viewport of [{ width: 1024, height: 400 }, { width: 1024, height: 600 }, { width: 1440, height: 600 }]) {
    await page.setViewportSize(viewport)
    await page.getByRole('button', { name: 'Stars+Honey', exact: true }).click()
    await selected(page, 'Stars+Honey')
    await page.waitForTimeout(300)
    const headerBefore = await page.locator('.site-header').boundingBox()
    await page.evaluate(() => scrollTo(0, document.documentElement.scrollHeight))
    await page.waitForTimeout(400)
    const bounds = await page.evaluate(() => {
      const details = document.querySelectorAll('.case-anim-target')[2].getBoundingClientRect()
      const cover = document.querySelector('.case-anim-target img').getBoundingClientRect()
      const menu = document.querySelector('button[aria-pressed]').parentElement.getBoundingClientRect()
      return { y: scrollY, details: details.toJSON(), cover: cover.toJSON(), menu: menu.toJSON(), height: innerHeight }
    })
    assert.ok(bounds.y > 0 && bounds.details.bottom <= bounds.height + 1 && bounds.cover.bottom <= bounds.height + 1, `Short viewport must expose all project content: ${JSON.stringify(bounds)}`)
    assert.ok(bounds.menu.bottom <= bounds.details.top, `Pinned project titles must not overlap details: ${JSON.stringify(bounds)}`)
    const headerAfter = await page.locator('.site-header').boundingBox()
    assert.ok(Math.abs(headerAfter.y - headerBefore.y) < 1, 'The right navigation must remain fixed while Work scrolls')
    const pricing = await page.getByRole('link', { name: 'Pricing', exact: true }).boundingBox()
    assert.ok(pricing.y >= 0 && pricing.y + pricing.height <= viewport.height, 'Navigation links must remain visible in short windows')
    await page.screenshot({ path: `${artifacts}/short-${viewport.width}-${viewport.height}.png` })
    await page.evaluate(() => scrollTo(0, 0))
  }
  await page.setViewportSize({ width: 1024, height: 300 })
  await page.evaluate(() => scrollTo(0, 0))
  await page.waitForTimeout(400)
  const sidebar = await page.locator('.site-header').boundingBox()
  await page.mouse.move(sidebar.x + sidebar.width / 2, 150)
  await page.mouse.wheel(0, 400)
  await page.waitForTimeout(400)
  assert.ok(await page.locator('.site-header').evaluate(el => el.scrollTop) > 0, 'An extra-short sidebar must allow its own content to scroll')
  assert.equal(await page.evaluate(() => scrollY), 0, 'Scrolling inside the sidebar must not move the page')
  await desktop.close()

  for (const reducedMotion of ['no-preference', 'reduce']) {
    const context = await browser.newContext({ baseURL, viewport: { width: 390, height: 650 }, hasTouch: true, reducedMotion })
    const page = await context.newPage()
    page.on('pageerror', error => errors.push(error.message))
    await page.goto('/work')
    await selected(page, 'Circus')
    const client = type === chromium ? await context.newCDPSession(page) : null
    async function swipe(x, y = 0, cancel = false) {
      const cover = page.locator('.case-anim-target a')
      const box = await cover.boundingBox()
      const start = { x: box.x + box.width / 2 - x / 2, y: box.y + 100 }
      if (client) {
        await client.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [start] })
        for (let step = 1; step <= 6; step++) {
          await client.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: start.x + x * step / 6, y: start.y + y * step / 6 }] })
          await page.waitForTimeout(20)
        }
        await client.send('Input.dispatchTouchEvent', { type: cancel ? 'touchCancel' : 'touchEnd', touchPoints: [] })
      }
      else {
        // Other engines expose taps only; exercise touch-event sequences directly.
        await cover.evaluate((el, { start, x, y, cancel }) => {
          function touch(type, progress) {
            const point = { identifier: 1, clientX: start.x + x * progress, clientY: start.y + y * progress }
            const event = new Event(type, { bubbles: true, cancelable: true })
            Object.assign(event, { touches: type === 'touchend' || type === 'touchcancel' ? [] : [point], changedTouches: [point] })
            el.dispatchEvent(event)
          }
          touch('touchstart', 0)
          for (let step = 1; step <= 6; step++)
            touch('touchmove', step / 6)
          touch(cancel ? 'touchcancel' : 'touchend', 1)
        }, { start, x, y, cancel })
        if (!cancel && Math.abs(x) >= 10 && Math.abs(x) > Math.abs(y) * 1.2)
          await cover.dispatchEvent('click', { detail: 1 })
      }
      await page.waitForTimeout(650)
      assert.equal(new URL(page.url()).pathname, '/work', 'Swiping must not open the case')
    }
    await swipe(140)
    await selected(page, 'Circus')
    await swipe(-25)
    await selected(page, 'Circus')
    await swipe(-65)
    await selected(page, 'Circus')
    await page.locator('.case-anim-target a').click()
    await page.waitForURL('**/work/circus')
    await page.getByRole('link', { name: 'Close', exact: true }).click()
    await selected(page, 'Circus')
    await swipe(-140, 0, true)
    await selected(page, 'Circus')
    const initialY = await page.evaluate(() => scrollY)
    for (const name of ['Stars+Honey', 'Linux Mint', 'Shareio', 'Chainviz']) {
      await swipe(-140, 45)
      await selected(page, name)
      assert.ok(Math.abs(await page.evaluate(() => scrollY) - initialY) <= 1, 'A slightly diagonal horizontal swipe must not jerk the page vertically')
    }
    const title = await page.getByRole('button', { name: 'Chainviz', exact: true }).boundingBox()
    assert.ok(title.x >= 9 && title.x + title.width <= 381, 'Swiping must reveal the selected project title')
    await swipe(-140)
    await selected(page, 'Chainviz')
    await swipe(140)
    await selected(page, 'Shareio')
    await swipe(20, -100)
    await selected(page, 'Shareio')
    if (client)
      assert.ok(await page.evaluate(() => scrollY) > 0, 'Vertical touch scrolling must remain native')
    await page.screenshot({ path: `${artifacts}/swipe-${reducedMotion}.png` })
    await page.locator('.case-anim-target a').tap()
    await page.waitForURL('**/work/shareio')
    await noise(page, false)
    await page.getByRole('link', { name: 'Close', exact: true }).tap()
    await selected(page, 'Shareio')
    await noise(page, true)
    await context.close()
  }
  assert.deepEqual(errors, [])
  console.log(`Work checks passed in ${type.name()}: default project, rapid switching, Close/Back/reload, short-window content, touch swipes and case noise.`)
}
finally {
  await browser.close()
}
