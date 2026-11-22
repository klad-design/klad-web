import assert from 'node:assert/strict'
import process from 'node:process'

import { chromium, firefox, webkit } from 'playwright'

const baseURL = process.env.STAGING_URL || 'http://127.0.0.1:3100'
const isLocal = ['localhost', '127.0.0.1', '[::1]'].includes(new URL(baseURL).hostname)
const type = { chromium, firefox, webkit }[process.env.STAGING_BROWSER || 'chromium']
const projects = ['datalane', 'circus', 'stars-honey', 'linux-mint', 'shareio', 'chainviz']
const launchVideo = 'https://www.linkedin.com/posts/davidpattersoncole_today-we-are-launching-datalane-deployed-ugcPost-7528108677816512513-Xbte'
const browser = await type.launch()

try {
  const context = await browser.newContext({ baseURL, javaScriptEnabled: false })
  const page = await context.newPage()
  for (const path of ['/', '/work', '/process', '/pricing', '/expectations', ...projects.map(slug => `/work/${slug}`), '/work/outpost']) {
    const response = await page.goto(path)
    assert.equal(response.status(), 200, `${path} must be available without JavaScript`)
    assert.match(response.headers()['x-robots-tag'], /noindex/, 'Run this check against a staging build')
    assert.equal(await page.locator('link[rel="canonical"]').count(), 1, `${path} must have exactly one canonical`)
    const canonical = await page.locator('link[rel="canonical"]').getAttribute('href')
    assert.equal(new URL(canonical).href, new URL(path, 'https://klad.design').href, `${path} must use its production canonical`)
    assert.ok(await page.locator('meta[name="description"]').getAttribute('content'), `${path} needs a description`)
  }

  for (const path of ['/?src=omnia', '/work?case=circus&utm_source=seo']) {
    await page.goto(path)
    assert.equal(new URL(await page.locator('link[rel="canonical"]').getAttribute('href')).href, new URL(path.split('?')[0], 'https://klad.design').href)
  }
  for (const slug of projects) {
    const option = page.locator(`[data-case-option][href="/work/${slug}"]`)
    assert.equal(await option.count(), 1, `${slug} must have a crawlable link in Work before JavaScript runs`)
  }
  await page.locator('[data-case-option][href="/work/shareio"]').click()
  await page.waitForURL('**/work/shareio')

  await page.goto('/')
  assert.equal(await page.locator('#team .memberDescription').count(), 5)
  assert.equal(await page.locator('#team .memberDescription a').count(), 0, 'Team descriptions must not link to external sites or other pages')
  const memberButtons = page.locator('#team .memberDescription button[data-member]')
  assert.equal(await memberButtons.count(), 6, 'Team descriptions must retain their six member cross-links')
  for (const button of await memberButtons.all()) {
    assert.equal(await button.locator('img').count(), 1, 'Each member cross-link must include its mini-portrait')
  }
  await page.goto('/work/datalane')
  const launch = page.getByRole('link', { name: 'Launch video', exact: true })
  assert.equal(await launch.getAttribute('href'), launchVideo)
  assert.equal(await launch.getAttribute('target'), '_blank')
  assert.match(await launch.getAttribute('rel'), /noopener/)

  const legacyPaths = [
    '/projects',
    '/projects/',
    '/portfolio2023.pdf',
    '/storage/app/uploads/public/65a/fee/a80/65afeea8008db691085313.pdf',
    '/storage/app/uploads/public/64f/74e/f96/64f74ef969321270668268.pdf',
  ]
  for (const path of legacyPaths) {
    const redirect = await context.request.get(path, { maxRedirects: 0 })
    assert.equal(redirect.status(), 308, `${path} needs a permanent redirect`)
    assert.equal(redirect.headers().location, '/work', `${path} must go straight to Work`)
    assert.equal((await context.request.get(redirect.headers().location, { maxRedirects: 0 })).status(), 200)
    if (isLocal) {
      const www = await context.request.get(path, { headers: { host: 'www.klad.design' }, maxRedirects: 0 })
      assert.equal(www.status(), 308)
      assert.equal(www.headers().location, 'https://klad.design/work', 'www legacy paths must also go straight to the final portfolio URL')
    }
  }
  for (const path of ['/work/', '/process/', '/work/circus/']) {
    const response = await context.request.get(path, { maxRedirects: 0 })
    assert.equal(response.status(), 308)
    assert.equal(response.headers().location, path.slice(0, -1))
  }
  const query = await context.request.get('/projects/?case=circus&utm_source=legacy', { maxRedirects: 0 })
  assert.equal(query.headers().location, '/work?case=circus&utm_source=legacy', 'Legacy redirects must retain the selected case and tracking parameters')
  if (isLocal) {
    for (const path of ['/', '/work/circus', '/work/circus/']) {
      const response = await context.request.get(path, { headers: { host: 'www.klad.design' }, maxRedirects: 0 })
      assert.equal(response.status(), 308)
      assert.equal(new URL(response.headers().location).href, `https://klad.design${path === '/' ? '/' : path.replace(/\/$/, '')}`)
    }
  }
  const missing = await context.request.get('/seo-check-missing-page', { maxRedirects: 0 })
  assert.equal(missing.status(), 404, 'Unknown pages must keep their real 404 status')
  await context.close()

  const interactive = await browser.newContext({ baseURL, viewport: { width: 1440, height: 900 } })
  const work = await interactive.newPage()
  await work.goto('/work')
  await work.waitForSelector('[data-header-logo]')
  const circus = work.locator('[data-case-option][href="/work/circus"]')
  await circus.click()
  await work.waitForURL('**/work?case=circus')
  await work.waitForFunction(() => document.querySelector('[data-case-option][aria-current="true"]')?.getAttribute('href') === '/work/circus')
  assert.equal(await circus.getAttribute('aria-current'), 'true', 'Normal clicks must retain the existing Work selection behavior')
  const [popup] = await Promise.all([
    interactive.waitForEvent('page'),
    circus.click({ modifiers: ['ControlOrMeta'] }),
  ])
  await popup.waitForURL('**/work/circus')
  assert.match(work.url(), /\/work\?case=circus$/, 'Opening a case in a new tab must not navigate the portfolio')
  await interactive.close()
  console.log(`${type.name()}: canonicals, server-rendered project links, team cross-links with mini-portraits, Launch video and permanent redirects passed.`)
}
finally {
  await browser.close()
}
