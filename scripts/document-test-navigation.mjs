const replacing = new WeakSet()

export async function replaceDocument(page, action) {
  const committed = (frame) => {
    if (frame === page.mainFrame())
      replacing.delete(page)
  }
  replacing.add(page)
  page.on('framenavigated', committed)
  try {
    return await action()
  }
  finally {
    replacing.delete(page)
    page.off('framenavigated', committed)
  }
}

export function isCanceledRoutePrefetch(page, error) {
  if (!replacing.has(page))
    return false
  const url = new URL(page.url())
  const suffix = ' due to access control checks.'
  // WebKit reports this native diagnostic while tearing down an outgoing fetch.
  if (!['http:', 'https:'].includes(url.protocol)
    || error.name !== `Fetch API cannot load ${url.protocol.slice(0, -1)}`
    || !error.message.startsWith('/') || !error.message.endsWith(suffix)) {
    return false
  }
  try {
    const request = new URL(`${url.protocol}/${error.message.slice(0, -suffix.length)}`)
    return request.origin === url.origin && request.searchParams.has('_rsc')
  }
  catch {
    return false
  }
}
