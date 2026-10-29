import assert from 'node:assert/strict'
import { mkdir } from 'node:fs/promises'
import process from 'node:process'

import { chromium, firefox, webkit } from 'playwright'

import { isCanceledRoutePrefetch, replaceDocument } from './document-test-navigation.mjs'

const type = { chromium, firefox, webkit }[process.env.STAGING_BROWSER || 'chromium']
const baseURL = process.env.STAGING_URL || 'http://127.0.0.1:3100'
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
    const recording = page.evaluate(() => new Promise((resolve) => {
      const transitions = new Set()
      const samples = []
      const end = performance.now() + 2100
      function sample() {
        for (const animation of document.getAnimations()) {
          if (animation.effect?.pseudoElement?.includes('view-transition'))
            transitions.add(animation.effect.pseudoElement)
        }
        const title = document.querySelector('.case-study > header > div:nth-child(2)')
        if (title) {
          const style = getComputedStyle(title)
          samples.push({ opacity: Number(style.opacity), blur: style.filter === 'none' ? 0 : Number.parseFloat(style.filter.slice(5)), y: new DOMMatrix(style.transform).f })
        }
        if (performance.now() < end)
          requestAnimationFrame(sample)
        else
          resolve({ transitions: [...transitions], samples })
      }
      sample()
    }))
    await cover.click()
    await page.waitForURL('**/work/datalane')
    const opening = await recording
    assert.deepEqual(opening.transitions, [], 'Case opening must use normal navigation without a fullscreen transition')
    assert.ok(opening.samples.some(frame => frame.opacity < 0.25 && frame.blur > 5 && frame.y > 15), 'Case content must start softly blurred, faded and slightly lowered')
    assert.ok(opening.samples.some(frame => frame.opacity > 0.1 && frame.opacity < 0.95 && frame.blur > 0 && frame.y > 0), 'Case opening must reveal content through intermediate fade, blur and position states')
    assert.ok(opening.samples.at(-1).opacity === 1 && opening.samples.at(-1).blur === 0 && opening.samples.at(-1).y === 0, 'The opening reveal must settle fully')
    assert.equal(await page.locator('.page-imprints').isVisible(), false)

    const close = page.locator('.case-close')
    const controlTops = await page.locator('.case-close a > span, main > header > div:first-child a > span').evaluateAll(elements => elements.map(el => el.getBoundingClientRect().top))
    assert.ok(Math.max(...controlTops) - Math.min(...controlTops) < 1, `Close, Previous and Next must align at the top: ${controlTops}`)
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
    await context.close()
  }

  const reduced = await browser.newContext({ baseURL, reducedMotion: 'reduce' })
  const page = await reduced.newPage()
  page.on('pageerror', (error) => {
    if (!isCanceledRoutePrefetch(page, error))
      errors.push(error.message)
  })
  for (const slug of ['datalane', 'circus', 'stars-honey', 'linux-mint', 'shareio', 'chainviz']) {
    const response = await replaceDocument(page, () => page.goto(`/work/${slug}`))
    assert.equal(response.status(), 200, `${slug}: published case must remain available`)
    assert.equal(await page.getByRole('main').count(), 1)
    assert.equal(await page.locator('.case-close a').count(), 1)
    assert.equal(await page.locator('main > footer a[aria-label="Close"]').count(), 1)
    assert.ok(await page.locator('[data-case-reveal] img, [data-case-reveal] video').evaluateAll(elements => elements.every(el => getComputedStyle(el).filter === 'none' && getComputedStyle(el).opacity === '1')), 'Reduced motion must keep case media clear and visible')
    assert.ok(await page.locator('main > header > div').evaluateAll(elements => elements.every(el => el.style.opacity === '' && el.style.transform === '')), 'Reduced motion must skip opening motion')
  }
  for (const slug of ['case', 'another-case'])
    assert.equal((await page.request.get(`/work/${slug}`)).status(), 404, `${slug}: deleted template must stay unavailable`)
  await reduced.close()

  const withoutJavaScript = await browser.newContext({ baseURL, javaScriptEnabled: false })
  const staticPage = await withoutJavaScript.newPage()
  await staticPage.goto('/work/datalane')
  assert.equal(await staticPage.getByRole('main').count(), 1)
  const colors = await staticPage.evaluate(() => ({
    body: getComputedStyle(document.body).backgroundColor,
    text: getComputedStyle(document.querySelector('main')).color,
  }))
  assert.notEqual(colors.text, colors.body, 'Case text must stay readable without JavaScript')
  await withoutJavaScript.close()
  assert.deepEqual(errors, [])
  console.log(`${type.name()}: smooth case entrance, aligned fixed/footer Close and focus handoff, progressive sharpening, all case routes, history, reduced motion and no-JavaScript rendering passed`)
}
finally {
  await browser.close()
}
