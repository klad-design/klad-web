// Preserve text and vector ink; photos, videos and canvases leave only silhouettes.
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
    const hidden = element.closest('[aria-hidden="true"], [inert], script, style')
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
  const vectors: Promise<void>[] = []
  root.querySelectorAll('img, video, canvas, svg').forEach((media) => {
    const rect = media.getBoundingClientRect()
    if (!visible(media) || !inViewport(rect))
      return

    let vector: HTMLImageElement | undefined
    if (media instanceof HTMLImageElement && /\.svg(?:[?#]|$)|^data:image\/svg\+xml/i.test(media.currentSrc || media.src)) {
      const source = new URL(media.currentSrc || media.src, location.href)
      // Only sample local artwork so the session canvas stays readable and exportable.
      if (source.origin === location.origin || source.protocol === 'data:')
        vector = media
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
      vector = new Image()
      vector.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(new XMLSerializer().serializeToString(clone))}`
    }

    if (vector) {
      const ink = document.createElement('canvas')
      ink.width = canvas.width
      ink.height = canvas.height
      const inkContext = ink.getContext('2d')!
      // Freeze clipping before navigation can remove or scroll the outgoing page.
      clipToParents(media, inkContext)
      const image = vector
      vectors.push(image.decode().then(() => {
        inkContext.drawImage(image, rect.left, rect.top, rect.width, rect.height)
        const pixels = inkContext.getImageData(0, 0, ink.width, ink.height)
        for (let index = 0; index < pixels.data.length; index += 4) {
          pixels.data[index + 3] *= 1 - (pixels.data[index] + pixels.data[index + 1] + pixels.data[index + 2]) / 765
          pixels.data[index] = 0
          pixels.data[index + 1] = 0
          pixels.data[index + 2] = 0
        }
        inkContext.putImageData(pixels, 0, 0)
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
  await Promise.all(vectors)
  return canvas
}
