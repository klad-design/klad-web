import assert from 'node:assert/strict'

export function observeRoutePrefetches(page, baseURL) {
  const origin = new URL(baseURL).origin
  const requests = new Set()
  let activity = Date.now()
  page.on('request', (request) => {
    const url = new URL(request.url())
    if (url.origin === origin && url.searchParams.has('_rsc')) {
      requests.add(request)
      activity = Date.now()
    }
  })
  const finish = (request) => {
    if (requests.delete(request))
      activity = Date.now()
  }
  page.on('requestfinished', finish)
  page.on('requestfailed', finish)
  return async () => {
    const deadline = Date.now() + 30000
    activity = Date.now()
    // Media streams can stay open; only route prefetches matter during teardown.
    while (requests.size || Date.now() - activity < 500) {
      assert.ok(Date.now() < deadline, `Local route prefetches must finish before document teardown: ${[...requests].map(request => request.url()).join(', ')}`)
      await page.waitForTimeout(50)
    }
  }
}
