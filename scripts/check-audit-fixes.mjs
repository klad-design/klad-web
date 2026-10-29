import assert from 'node:assert/strict'
import { EventEmitter } from 'node:events'
import process from 'node:process'

import { chromium, firefox, webkit } from 'playwright'

import { isCanceledRoutePrefetch, replaceDocument } from './document-test-navigation.mjs'

const baseURL = process.env.STAGING_URL || 'http://127.0.0.1:3100'
const browserType = { chromium, firefox, webkit }[process.env.STAGING_BROWSER || 'chromium']
assert.ok(browserType, 'STAGING_BROWSER must be chromium, firefox or webkit')
const browser = await browserType.launch()
const errors = []

async function assertScrollUnlocked(page) {
  await page.waitForFunction(() => {
    const root = document.documentElement
    return !root.classList.contains('lenis-stopped')
      && !document.body.hasAttribute('data-scroll-locked')
      && !['hidden', 'clip'].includes(getComputedStyle(root).overflowY)
      && !['hidden', 'clip'].includes(getComputedStyle(document.body).overflowY)
  })
  assert.equal(await page.getByRole('dialog').count(), 0, 'History must close the menu')
  const { before, delta } = await page.evaluate(() => ({
    before: scrollY,
    delta: scrollY > (document.documentElement.scrollHeight - innerHeight) / 2 ? -400 : 400,
  }))
  await page.mouse.move(195, 500)
  await page.mouse.wheel(0, delta)
  await page.waitForFunction(before => Math.abs(scrollY - before) > 80, before)
}

try {
  const frame = {}
  const probePage = Object.assign(new EventEmitter(), { url: () => baseURL, mainFrame: () => frame })
  const origin = new URL(baseURL)
  const cancellation = { name: `Fetch API cannot load ${origin.protocol.slice(0, -1)}`, message: `/${origin.host}/work?_rsc=probe due to access control checks.` }
  assert.equal(isCanceledRoutePrefetch(probePage, cancellation), false, 'Active-page errors must never be suppressed')
  assert.equal(await replaceDocument(probePage, async () => {
    assert.equal(isCanceledRoutePrefetch(probePage, cancellation), true)
    assert.equal(isCanceledRoutePrefetch(probePage, { ...cancellation, name: 'TypeError' }), false, 'Real JavaScript errors remain fatal during teardown')
    assert.equal(isCanceledRoutePrefetch(probePage, { ...cancellation, message: cancellation.message.replace(origin.host, 'external.invalid') }), false)
    assert.equal(isCanceledRoutePrefetch(probePage, { ...cancellation, message: cancellation.message.replace('_rsc=probe', 'asset=probe') }), false)
    assert.equal(isCanceledRoutePrefetch(probePage, { ...cancellation, message: cancellation.message.replace('_rsc=probe', 'not_rsc=probe') }), false)
    assert.equal(isCanceledRoutePrefetch(probePage, { ...cancellation, message: cancellation.message.replace('_rsc=probe', 'value=_rsc=probe') }), false)
    assert.equal(isCanceledRoutePrefetch(probePage, { ...cancellation, message: '/[invalid due to access control checks.' }), false)
    probePage.emit('framenavigated', {})
    assert.equal(isCanceledRoutePrefetch(probePage, cancellation), true, 'Subframes do not end the outgoing main-document window')
    probePage.emit('framenavigated', frame)
    assert.equal(isCanceledRoutePrefetch(probePage, cancellation), false, 'New-document errors remain fatal before load completes')
    return 42
  }), 42)
  assert.equal(isCanceledRoutePrefetch(probePage, cancellation), false)
  await assert.rejects(replaceDocument(probePage, async () => {
    throw new Error('Navigation failed')
  }), /Navigation failed/)
  assert.equal(isCanceledRoutePrefetch(probePage, cancellation), false, 'Failed navigation must release its teardown guard')

  const mobile = await browser.newContext({ baseURL, viewport: { width: 390, height: 844 }, hasTouch: true })
  const page = await mobile.newPage()
  page.on('pageerror', error => errors.push(error.message))
  await page.goto('/work/stars-honey')
  await page.locator('.case-close').getByRole('link', { name: 'Close', exact: true }).click()
  await page.waitForURL('**/work?case=stars-honey')
  await page.getByRole('button', { name: 'Menu', exact: true }).click()
  await page.getByRole('dialog').waitFor()
  await page.waitForFunction(() => document.documentElement.classList.contains('lenis-stopped'))
  await page.goBack()
  await page.waitForURL('**/work/stars-honey')
  await assertScrollUnlocked(page)

  assert.ok(await page.locator('video:not([src])').count() > 0, 'Offscreen videos must retain lazy sources')
  const video = page.locator('video').first()
  await video.scrollIntoViewIfNeeded()
  await page.waitForFunction(() => !!document.querySelector('video')?.getAttribute('src'))
  assert.ok(await video.evaluate(el => el.muted && el.loop && el.hasAttribute('playsinline') && !el.controls), 'Normal playback must remain muted, inline and looping')

  await page.goForward()
  await page.waitForURL('**/work?case=stars-honey')
  assert.equal(await page.getByRole('dialog').count(), 0, 'Forward navigation must not resurrect the menu')
  await page.getByRole('button', { name: 'Menu', exact: true }).click()
  await page.getByRole('dialog').getByRole('link', { name: 'Process', exact: true }).click()
  await page.waitForURL('**/process')
  await assertScrollUnlocked(page)

  await page.getByRole('button', { name: 'Menu', exact: true }).click()
  await page.getByRole('dialog').waitFor()
  await page.goBack()
  await page.waitForURL('**/work?case=stars-honey')
  assert.equal(await page.getByRole('dialog').count(), 0, 'Back navigation between visible headers must close the menu')
  await page.goForward()
  await page.waitForURL('**/process')
  await assertScrollUnlocked(page)

  await page.getByRole('button', { name: 'Menu', exact: true }).click()
  await page.waitForFunction(() => document.documentElement.classList.contains('lenis-stopped'))
  await page.evaluate(() => window.dispatchEvent(new PageTransitionEvent('pageshow', { persisted: false })))
  assert.equal(await page.getByRole('dialog').count(), 1, 'Initial page load must not dismiss an open menu')
  await page.evaluate(() => window.dispatchEvent(new PageTransitionEvent('pageshow', { persisted: true })))
  await assertScrollUnlocked(page)
  await mobile.close()
  console.log(`${browserType.name()}: mobile menu/history checks passed`)

  const withoutJavaScript = await browser.newContext({ baseURL, javaScriptEnabled: false })
  const staticPage = await withoutJavaScript.newPage()
  for (const route of ['/', '/process', '/pricing', '/expectations', '/work', '/work/stars-honey']) {
    const response = await staticPage.goto(route)
    assert.equal(response.status(), 200, route)
    assert.equal(await staticPage.locator('main').count(), 1, `${route} must render exactly one main`)
    assert.equal(await staticPage.getByRole('main').count(), 1, `${route} must expose exactly one main landmark`)
    assert.equal(await staticPage.locator('main main').count(), 0, `${route} must not nest main landmarks`)
  }
  const posters = await staticPage.locator('video').evaluateAll(elements => elements.map(el => ({
    poster: el.getAttribute('poster'),
    src: el.getAttribute('src'),
    preload: el.preload,
  })))
  assert.ok(posters.length > 0, 'The no-JavaScript case must contain videos')
  for (const { poster, src, preload } of posters) {
    assert.ok(poster, 'Every video must have a poster in server HTML')
    assert.equal(src, null, 'Server rendering must not eagerly load media')
    assert.equal(preload, 'none')
    const response = await staticPage.request.get(poster)
    assert.equal(response.status(), 200, poster)
    assert.match(response.headers()['content-type'], /^image\//, 'Posters must resolve to images')
  }
  const staticVideo = staticPage.locator('video').first()
  await staticVideo.scrollIntoViewIfNeeded()
  assert.ok(await staticVideo.isVisible(), 'The no-JavaScript video poster must be visible')
  for (const route of ['/work/case', '/work/another-case'])
    assert.equal((await staticPage.request.get(route)).status(), 404, `${route} must be retired`)
  const policyResponse = await staticPage.request.get('/llm.txt')
  assert.equal(policyResponse.status(), 200)
  const policy = await policyResponse.text()
  assert.ok(policy.split('\n').includes('https://klad.design/'), 'The homepage must be a preferred source')
  assert.doesNotMatch(policy, /\/about|Disallow: \/work\/(?:case|another-case)/)
  await withoutJavaScript.close()
  console.log(`${browserType.name()}: no-JavaScript posters, landmarks and retired routes passed`)

  const reduced = await browser.newContext({ baseURL, reducedMotion: 'reduce' })
  const reducedPage = await reduced.newPage()
  reducedPage.on('pageerror', error => errors.push(error.message))
  await reducedPage.goto('/work/stars-honey')
  await reducedPage.locator('video').first().scrollIntoViewIfNeeded()
  await reducedPage.waitForFunction(() => {
    const video = document.querySelector('video')
    return video?.getAttribute('src') && video.controls && video.paused
  })
  assert.ok(await reducedPage.evaluate(async () => {
    const image = new Image()
    image.src = document.querySelector('video').poster
    await image.decode()
    return image.naturalWidth > 0 && image.naturalHeight > 0
  }), 'The same case poster must decode in the browser')
  await reduced.close()

  assert.deepEqual(errors, [], 'Browser runtime errors')
  console.log(`${browserType.name()}: mobile menu/history scrolling, restored pages, server posters, main landmarks, retired routes and reduced-motion video controls passed`)
}
finally {
  await browser.close()
}
