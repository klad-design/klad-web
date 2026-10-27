// Preserve text ink and image/canvas pixels, including transparent areas.
export async function captureImprint(root: HTMLElement) {
  const canvas = document.createElement('canvas')
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  const context = canvas.getContext('2d')
  if (!context)
    return null

  const styles = new Map<Element, CSSStyleDeclaration>()
  function styleFor(element: Element) {
    if (!styles.has(element))
      styles.set(element, getComputedStyle(element))
    return styles.get(element)!
  }

  function visible(element: Element) {
    // Modal accessibility hiding must not erase the visible page from its snapshot.
    const hidden = element.closest('[aria-hidden="true"]:not([data-aria-hidden="true"]), [inert], script, style')
    // The menu and repeated hero hide visible content from assistive technology.
    return (!hidden || hidden.contains(root) || hidden.matches('.home-loop'))
      && element.checkVisibility({ checkOpacity: true, checkVisibilityCSS: true })
  }

  function inViewport(rect: DOMRect) {
    return rect.width > 0 && rect.height > 0 && rect.bottom > 0 && rect.top < canvas.height && rect.right > 0 && rect.left < canvas.width
  }

  function clipToParents(element: Element, target = context!) {
    for (let parent = element.parentElement; parent && parent !== root; parent = parent.parentElement) {
      const style = styleFor(parent)
      if (/hidden|clip|scroll|auto/.test(`${style.overflowX} ${style.overflowY}`)) {
        const rect = parent.getBoundingClientRect()
        target.beginPath()
        target.rect(rect.left, rect.top, rect.width, rect.height)
        target.clip()
      }
    }
  }

  context.fillStyle = '#000'
  context.globalAlpha = 0.5
  const images: Promise<void>[] = []
  root.querySelectorAll('img, video, canvas, svg').forEach((media) => {
    const rect = media.getBoundingClientRect()
    if (!visible(media) || !inViewport(rect))
      return

    if (media.hasAttribute('data-case-cover')) {
      context.save()
      clipToParents(media)
      context.fillStyle = '#ABABAB'
      context.globalAlpha = 1
      context.fillRect(rect.left, rect.top, rect.width, rect.height)
      context.restore()
      return
    }

    let artwork: HTMLImageElement | HTMLCanvasElement | undefined
    if (media instanceof HTMLImageElement) {
      const source = new URL(media.currentSrc || media.src, location.href)
      // Only sample local artwork so the session canvas stays readable and exportable.
      if (source.origin === location.origin || source.protocol === 'data:') {
        artwork = media
      }
    }
    else if (media instanceof HTMLCanvasElement) {
      if (!media.width || !media.height)
        return
      const frozen = document.createElement('canvas')
      frozen.width = media.width
      frozen.height = media.height
      const frozenContext = frozen.getContext('2d')!
      try {
        frozenContext.drawImage(media, 0, 0)
        frozenContext.getImageData(0, 0, 1, 1)
        artwork = frozen
      }
      catch {
        // Never let an unreadable cross-origin canvas taint stored imprints.
        return
      }
    }
    else if (media instanceof SVGSVGElement) {
      const clone = media.cloneNode(true) as SVGSVGElement
      clone.removeAttribute('style')
      const originals = [media, ...media.querySelectorAll('*')]
      const copies = [clone, ...clone.querySelectorAll('*')]
      originals.forEach((element, index) => {
        const style = styleFor(element)
        for (const property of ['color', 'fill', 'stroke', 'stroke-width', 'opacity', 'font-family', 'font-size'])
          (copies[index] as SVGElement).style.setProperty(property, style.getPropertyValue(property))
      })
      clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
      clone.setAttribute('width', String(rect.width))
      clone.setAttribute('height', String(rect.height))
      artwork = new Image()
      artwork.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(new XMLSerializer().serializeToString(clone))}`
    }

    if (artwork) {
      const ink = document.createElement('canvas')
      ink.width = canvas.width
      ink.height = canvas.height
      const inkContext = ink.getContext('2d')!
      // Freeze clipping before navigation can remove or scroll the outgoing page.
      clipToParents(media, inkContext)
      inkContext.beginPath()
      inkContext.rect(rect.left, rect.top, rect.width, rect.height)
      inkContext.clip()
      const fit = styleFor(media).objectFit
      const image = artwork
      const decoded = image instanceof HTMLImageElement ? image.decode() : Promise.resolve()
      images.push(decoded.then(() => {
        let width = rect.width
        let height = rect.height
        if (fit === 'cover' || fit === 'contain') {
          const naturalWidth = image instanceof HTMLImageElement ? image.naturalWidth : image.width
          const naturalHeight = image instanceof HTMLImageElement ? image.naturalHeight : image.height
          const scale = Math[fit === 'cover' ? 'max' : 'min'](width / naturalWidth, height / naturalHeight)
          width = naturalWidth * scale
          height = naturalHeight * scale
        }
        // shortcut: crops use the site's centered object-position; extend for positioned images.
        inkContext.drawImage(image, rect.left + (rect.width - width) / 2, rect.top + (rect.height - height) / 2, width, height)
        context.save()
        context.globalAlpha = 1
        context.globalCompositeOperation = 'destination-over'
        context.drawImage(ink, 0, 0)
        context.restore()
      }).catch(() => {
        // Unavailable artwork must never interrupt navigation or session history.
      }))
      return
    }

    context.save()
    clipToParents(media)
    context.fillRect(rect.left, rect.top, rect.width, rect.height)
    context.restore()
  })

  context.globalAlpha = 1
  context.textBaseline = 'top'
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT)
  const range = document.createRange()
  while (walker.nextNode()) {
    const node = walker.currentNode
    const element = node.parentElement!
    if (!node.textContent?.trim() || !visible(element) || element.closest('svg'))
      continue
    range.selectNodeContents(node)
    if (![...range.getClientRects()].some(inViewport))
      continue

    const style = styleFor(element)
    context.font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`
    let angle = 0
    for (let parent: Element | null = element; parent && parent !== root; parent = parent.parentElement) {
      const ancestor = styleFor(parent)
      const matrix = new DOMMatrix(ancestor.transform)
      angle += Math.atan2(matrix.b, matrix.a) + (Number.parseFloat(ancestor.rotate) || 0) * Math.PI / 180
    }

    context.save()
    clipToParents(element)
    // Character ranges preserve wrapping, spacing and the site's rotated headings.
    for (let index = 0; index < node.textContent.length; index++) {
      const character = node.textContent[index]
      if (!character.trim())
        continue
      range.setStart(node, index)
      range.setEnd(node, index + 1)
      const rect = range.getBoundingClientRect()
      if (!inViewport(rect))
        continue
      context.save()
      context.translate(rect.left + (angle < 0 ? Math.sin(-angle) * rect.height : 0), rect.top + (angle < 0 ? Math.sin(-angle) * rect.width : 0))
      context.rotate(angle)
      context.fillText(style.textTransform === 'uppercase' ? character.toUpperCase() : character, 0, 0)
      context.restore()
    }
    context.restore()
  }
  await Promise.all(images)
  return canvas
}
