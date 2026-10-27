import assert from 'node:assert/strict'
import { mkdir } from 'node:fs/promises'
import process from 'node:process'

import { chromium, webkit } from 'playwright'

const type = { chromium, webkit }[process.env.STAGING_BROWSER || 'chromium']
const baseURL = process.env.STAGING_URL || 'http://127.0.0.1:3106'
const browser = await type.launch()
const artifacts = `artifacts/case-motion/${type.name()}`
await mkdir(artifacts, { recursive: true })
const errors = []

async function scrollReveal(page, section, fraction) {
  await section.evaluate((element, fraction) => {
    scrollTo({ top: element.getBoundingClientRect().top + scrollY - innerHeight * fraction, behavior: 'instant' })
  }, fraction)
  await page.waitForTimeout(200)
}

try {
  for (const width of [1440, 390]) {
    const context = await browser.newContext({ baseURL, viewport: { width, height: 900 }, hasTouch: width < 768 })
    const page = await context.newPage()
    page.on('pageerror', error => errors.push(error.message))
    await page.goto('/work')
    await page.evaluate(() => document.fonts.ready)
    await page.waitForTimeout(600)
    const cover = page.getByRole('link', { name: 'View Datalane case study', exact: true })
    const bounds = await cover.boundingBox()
    const recording = page.evaluate(() => new Promise((resolve) => {
      const animations = new Map()
      const end = performance.now() + 3000
      function sample() {
        for (const animation of document.getAnimations()) {
          if (animation.animationName?.includes('case-'))
            animations.set(animation.animationName, { frames: animation.effect.getKeyframes(), duration: animation.effect.getTiming().duration })
        }
        if (performance.now() < end)
          requestAnimationFrame(sample)
        else
          resolve([...animations])
      }
      sample()
    }))
    await cover.click()
    await page.waitForURL('**/work/datalane')
    const animations = new Map(await recording)
    const expansion = [...animations.values()].find(animation => animation.frames[0]?.width && animation.frames.at(-1)?.height)
    assert.ok(expansion, 'Opening a cover must run a shared-element expansion')
    assert.ok(Math.abs(Number.parseFloat(expansion.frames[0].width) - bounds.width) < 2, 'Expansion must start at the selected cover width')
    assert.equal(Number.parseFloat(expansion.frames.at(-1).width), width, 'Expansion must reach the full viewport width')
    assert.equal(Number.parseFloat(expansion.frames.at(-1).height), 900, 'Expansion must reach the full viewport height')
    assert.ok(animations.has('case-content-in'), 'Case content must appear after the expansion')
    assert.equal(await page.locator('.page-imprints').isVisible(), false)

    const close = page.locator('.case-close')
    const before = await close.boundingBox()
    const section = page.locator('[data-case-reveal]').nth(3)
    const image = section.locator('img')
    assert.equal(await image.evaluate(el => getComputedStyle(el).filter), 'blur(6px)', 'Upcoming content starts softly blurred')
    await scrollReveal(page, section, 0.8)
    const middle = await image.evaluate(el => ({ blur: Number.parseFloat(getComputedStyle(el).filter.slice(5)), opacity: Number(getComputedStyle(el).opacity) }))
    assert.ok(middle.blur > 0 && middle.blur < 6 && middle.opacity > 0.4 && middle.opacity < 1, 'Scrolling must progressively sharpen content through intermediate states')
    await page.screenshot({ path: `${artifacts}/reveal-mid-${width}.png` })
    await scrollReveal(page, section, 0.6)
    assert.equal(await image.evaluate(el => getComputedStyle(el).filter), 'blur(0px)')
    const after = await close.boundingBox()
    assert.ok(Math.abs(before.y - after.y) < 1 && Math.abs(before.x - after.x) < 1, 'Close must remain fixed while the case scrolls')
    await page.screenshot({ path: `${artifacts}/reveal-clear-${width}.png` })
    const textSection = page.locator('[data-case-reveal]:not(:has(img, video))').nth(1)
    await scrollReveal(page, textSection, 0.8)
    const textBlur = await textSection.locator(':scope > div').evaluate(el => Number.parseFloat(getComputedStyle(el).filter.slice(5)))
    assert.ok(textBlur > 0 && textBlur < 6, 'Upcoming text must sharpen progressively too')
    await scrollReveal(page, textSection, 0.6)
    assert.equal(await textSection.locator(':scope > div').evaluate(el => getComputedStyle(el).filter), 'blur(0px)')

    await close.getByRole('link', { name: 'Close', exact: true }).focus()
    const footer = page.locator('main > footer')
    await footer.scrollIntoViewIfNeeded()
    await page.evaluate(() => scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' }))
    await page.waitForTimeout(200)
    assert.equal(await page.locator('[data-case-reveal] img').last().evaluate(el => getComputedStyle(el).filter), 'blur(0px)', 'The final image must become fully clear at the scroll limit')
    await page.waitForFunction(() => document.querySelector('.case-close').hidden)
    const footerClose = footer.getByRole('link', { name: 'Close', exact: true })
    assert.equal(await footerClose.evaluate(el => el === document.activeElement), true, 'Focus must transfer to the footer Close when the fixed control disappears')
    assert.deepEqual(await footer.getByRole('link').allTextContents(), ['Previous', 'Close', 'Next'])
    await page.screenshot({ path: `${artifacts}/footer-${width}.png` })
    await footerClose.click()
    await page.waitForURL('**/work?case=datalane')
    await page.waitForFunction(() => document.querySelector('button[aria-pressed="true"]')?.getAttribute('aria-label') === 'Datalane')
    await page.goBack()
    await page.waitForURL('**/work/datalane')
    await page.waitForTimeout(300)
    await page.evaluate(() => scrollTo(0, 0))
    await page.waitForFunction(() => !document.querySelector('.case-close').hidden)
    await page.locator('main > footer').scrollIntoViewIfNeeded()
    await page.locator('main > footer').getByRole('link', { name: 'Next', exact: true }).click()
    await page.waitForURL('**/work/chainviz')
    await page.waitForFunction(() => !document.querySelector('.case-close').hidden)
    await page.waitForFunction(() => getComputedStyle([...document.querySelectorAll('[data-case-reveal] img')].at(-1)).filter === 'blur(6px)')
    await page.waitForLoadState('networkidle')
    await context.close()
  }

  const reduced = await browser.newContext({ baseURL, reducedMotion: 'reduce' })
  await reduced.route('https://player.vimeo.com/**', route => route.fulfill({ contentType: 'text/html', body: '<!doctype html><title>Video fixture</title>' }))
  const page = await reduced.newPage()
  page.on('pageerror', error => errors.push(error.message))
  for (const slug of ['datalane', 'circus', 'stars-honey', 'linux-mint', 'shareio', 'chainviz', 'case', 'another-case']) {
    await page.goto(`/work/${slug}`)
    assert.equal(await page.getByRole('main').count(), 1)
    assert.equal(await page.locator('.case-close a').count(), 1)
    assert.equal(await page.locator('main > footer a[aria-label="Close"]').count(), 1)
    assert.ok(await page.locator('[data-case-reveal] img, [data-case-reveal] video').evaluateAll(elements => elements.every(el => getComputedStyle(el).filter === 'none' && getComputedStyle(el).opacity === '1')), 'Reduced motion must keep case media clear and visible')
    // Finish link prefetches before replacing the document in WebKit.
    await page.waitForLoadState('networkidle')
  }
  await reduced.close()

  const fallback = await browser.newContext({ baseURL })
  await fallback.addInitScript(() => {
    document.startViewTransition = undefined
  })
  const fallbackPage = await fallback.newPage()
  fallbackPage.on('pageerror', error => errors.push(error.message))
  await fallbackPage.goto('/work?case=circus')
  await fallbackPage.getByRole('link', { name: 'View Circus case study', exact: true }).click()
  await fallbackPage.waitForURL('**/work/circus')
  assert.equal(await fallbackPage.locator('.case-close').isVisible(), true, 'Case navigation must work without View Transitions API support')
  await fallbackPage.waitForLoadState('networkidle')
  await fallback.close()
  const withoutJavaScript = await browser.newContext({ baseURL, javaScriptEnabled: false })
  const staticPage = await withoutJavaScript.newPage()
  await staticPage.goto('/work/datalane')
  assert.equal(await staticPage.getByRole('main').count(), 1)
  const colors = await staticPage.evaluate(() => ({
    body: getComputedStyle(document.body).backgroundColor,
    surface: getComputedStyle(document.querySelector('.case-surface')).backgroundColor,
    text: getComputedStyle(document.querySelector('main')).color,
  }))
  assert.equal(colors.surface, colors.body, 'The transition surface must preserve the page background without JavaScript')
  assert.notEqual(colors.text, colors.surface, 'Case text must stay readable without JavaScript')
  await withoutJavaScript.close()
  assert.deepEqual(errors, [])
  console.log(`${type.name()}: cover-to-fullscreen expansion, content entrance, progressive sharpening, fixed/footer Close and focus handoff, all case routes, history, reduced motion and unsupported-browser fallback passed`)
}
finally {
  await browser.close()
}
