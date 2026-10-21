// Draw only text and media silhouettes; never copy live page elements or media pixels.
export function captureImprint(root: HTMLElement) {
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
    // The mobile menu temporarily hides the whole page from assistive technology.
    return (!hidden || hidden.contains(root))
      && element.checkVisibility({ checkOpacity: true, checkVisibilityCSS: true })
  }

  function inViewport(rect: DOMRect) {
    return rect.width > 0 && rect.height > 0 && rect.bottom > 0 && rect.top < canvas.height && rect.right > 0 && rect.left < canvas.width
  }

  function clipToParents(element: Element) {
    for (let parent = element.parentElement; parent && parent !== root; parent = parent.parentElement) {
      const style = styleFor(parent)
      if (/hidden|clip|scroll|auto/.test(`${style.overflowX} ${style.overflowY}`)) {
        const rect = parent.getBoundingClientRect()
        context!.beginPath()
        context!.rect(rect.left, rect.top, rect.width, rect.height)
        context!.clip()
      }
    }
  }

  context.fillStyle = '#000'
  context.globalAlpha = 0.5
  root.querySelectorAll('img, video, canvas, svg').forEach((media) => {
    const rect = media.getBoundingClientRect()
    if (!visible(media) || !inViewport(rect))
      return
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
    if (!node.textContent?.trim() || !visible(element))
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
  return canvas
}
