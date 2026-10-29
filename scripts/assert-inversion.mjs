import assert from 'node:assert/strict'
import { createRequire } from 'node:module'

const sharp = createRequire(import.meta.resolve('next'))('sharp')

export async function pngPixels(buffer) {
  const { data, info } = await sharp(buffer).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
  return { data, width: info.width, height: info.height }
}

export async function imageDifference(first, second) {
  const a = await pngPixels(first)
  const b = await pngPixels(second)
  assert.equal(a.data.length, b.data.length, 'Compared images have identical dimensions')
  let total = 0
  let maximum = 0
  for (let i = 0; i < a.data.length; i++) {
    const delta = Math.abs(a.data[i] - b.data[i])
    total += delta
    maximum = Math.max(maximum, delta)
  }
  return { mean: total / a.data.length, maximum }
}

export async function assertPageInversion(page, logo) {
  const style = await page.addStyleTag({ content: 'body::after{display:none!important}html,body{transition:none!important}' })
  const original = await page.evaluate(() => {
    const cursor = document.querySelector('[data-cursor-ghost]')
    return { theme: document.documentElement.dataset.theme, hidden: cursor.hidden, opacity: cursor.firstElementChild.style.opacity, transform: cursor.firstElementChild.style.transform }
  })
  try {
    for (const theme of ['light', 'dark']) {
      const point = await page.evaluate(async (theme) => {
        document.documentElement.dataset.theme = theme
        const cursor = document.querySelector('[data-cursor-ghost]')
        const x = innerWidth < 768 ? 180 : 1100
        const y = innerWidth < 768 ? 20 : 180
        cursor.hidden = false
        cursor.firstElementChild.style.opacity = '1'
        cursor.firstElementChild.style.transform = `translate3d(${x}px,${y}px,0)`
        await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))
        return { x: x + 8, y: y + 8 }
      }, theme)
      const cursorPng = await page.screenshot({ clip: { ...point, width: 1, height: 1 } })
      const logoPng = await logo.screenshot()
      const pixels = await page.evaluate(async (sources) => {
        const results = []
        for (const source of sources) {
          const image = new Image()
          image.src = `data:image/png;base64,${source}`
          await image.decode()
          const canvas = document.createElement('canvas')
          canvas.width = image.width
          canvas.height = image.height
          const context = canvas.getContext('2d')
          context.drawImage(image, 0, 0)
          const data = context.getImageData(0, 0, image.width, image.height).data
          let dark = 0
          let light = 0
          for (let i = 0; i < data.length; i += 4) {
            dark += Number(data[i] < 30)
            light += Number(data[i] > 210)
          }
          results.push({ first: data[0], dark, light, count: image.width * image.height })
        }
        return results
      }, [cursorPng, logoPng].map(png => png.toString('base64')))
      assert.equal(pixels[0].first, theme === 'light' ? 1 : 230, `Cursor inverts the actual ${theme} page background`)
      assert.ok(pixels[1][theme === 'light' ? 'dark' : 'light'] > pixels[1].count * 0.12, `Logo body remains visible against the actual ${theme} page`)
    }
  }
  finally {
    await page.evaluate((original) => {
      document.documentElement.dataset.theme = original.theme
      const cursor = document.querySelector('[data-cursor-ghost]')
      cursor.hidden = original.hidden
      cursor.firstElementChild.style.opacity = original.opacity
      cursor.firstElementChild.style.transform = original.transform
    }, original)
    await style.evaluate(element => element.remove())
  }
}

export async function assertLogoBounds(page, logo) {
  const visual = page.locator('[data-header-logo]').first()
  assert.equal(await visual.evaluate(element => getComputedStyle(element).clipPath), 'inset(1px)')
  const style = await page.addStyleTag({ content: 'body::after{display:none!important}html,body{transition:none!important}' })
  const theme = await page.evaluate(() => document.documentElement.dataset.theme)
  const time = await logo.evaluate(svg => svg.getCurrentTime())
  const bounds = await visual.boundingBox()
  const viewport = page.viewportSize()
  const clip = { x: Math.max(0, Math.floor(bounds.x) - 8), y: Math.max(0, Math.floor(bounds.y) - 8) }
  clip.width = Math.min(viewport.width, Math.ceil(bounds.x + bounds.width) + 8) - clip.x
  clip.height = Math.min(viewport.height, Math.ceil(bounds.y + bounds.height) + 8) - clip.y
  try {
    for (const currentTheme of ['light', 'dark']) {
      await page.evaluate(theme => document.documentElement.dataset.theme = theme, currentTheme)
      await visual.evaluate(element => element.style.visibility = 'hidden')
      const baseline = (await page.screenshot({ clip, scale: 'css' })).toString('base64')
      await visual.evaluate(element => element.style.removeProperty('visibility'))
      const progress = viewport.width < 768 ? [0, 0.4, 0.48, 0.5, 0.52, 0.6, 1] : [0, 0.1, 0.25, ...Array.from({ length: 25 }, (_, i) => 0.4 + i / 120), 0.75, 1]
      for (const value of progress) {
        await logo.evaluate(async (svg, value) => {
          svg.setCurrentTime(value * 2)
          await new Promise(resolve => requestAnimationFrame(resolve))
        }, value)
        const png = await page.screenshot({ clip, scale: 'css' })
        const spill = await page.evaluate(async ({ baseline, actual, clip, bounds }) => {
          const canvas = document.createElement('canvas')
          canvas.width = clip.width
          canvas.height = clip.height
          const context = canvas.getContext('2d')
          const pixels = []
          for (const source of [baseline, actual]) {
            const image = new Image()
            image.src = `data:image/png;base64,${source}`
            await image.decode()
            context.drawImage(image, 0, 0)
            pixels.push(context.getImageData(0, 0, clip.width, clip.height).data)
          }
          let changed = 0
          for (let y = 0; y < clip.height; y++) {
            for (let x = 0; x < clip.width; x++) {
              const worldX = x + clip.x
              const worldY = y + clip.y
              if (worldX >= bounds.x + 1 && worldX < bounds.x + bounds.width - 1 && worldY >= bounds.y + 1 && worldY < bounds.y + bounds.height - 1)
                continue
              const index = (y * clip.width + x) * 4
              if ([0, 1, 2].some(channel => Math.abs(pixels[0][index + channel] - pixels[1][index + channel]) > 1))
                changed++
            }
          }
          return changed
        }, { baseline, actual: png.toString('base64'), clip, bounds })
        assert.equal(spill, 0, `No lines outside the logo at ${Math.round(value * 100)}% on ${currentTheme}`)
      }
    }
  }
  finally {
    await page.evaluate(theme => document.documentElement.dataset.theme = theme, theme)
    await logo.evaluate((svg, time) => svg.setCurrentTime(time), time)
    await visual.evaluate(element => element.style.removeProperty('visibility'))
    await style.evaluate(element => element.remove())
  }
}

export async function assertImprintExclusion(page, visual) {
  const style = await page.addStyleTag({ content: 'body::after{display:none!important}html,body{transition:none!important}' })
  const original = await page.evaluate(() => ({
    theme: document.documentElement.dataset.theme,
    layer: document.querySelector('.page-imprints').getAttribute('style'),
    canvases: [...document.querySelectorAll('.page-imprints canvas')].map(canvas => ({ width: canvas.width, height: canvas.height, image: canvas.toDataURL() })),
  }))
  try {
    for (const theme of ['light', 'dark']) {
      await page.evaluate((theme) => {
        document.documentElement.dataset.theme = theme
        const layer = document.querySelector('.page-imprints')
        layer.style.setProperty('--imprint-top', `${scrollY}px`)
        for (const canvas of layer.querySelectorAll('canvas')) {
          canvas.width = innerWidth
          canvas.height = innerHeight
          canvas.getContext('2d').fillRect(0, 0, canvas.width, canvas.height)
        }
        layer.style.visibility = 'hidden'
      }, theme)
      const clean = await pngPixels(await visual.screenshot())
      const bounds = await visual.boundingBox()
      const point = { x: Math.floor(bounds.x - 36), y: Math.floor(bounds.y + bounds.height / 2), width: 1, height: 1 }
      const outsideClean = await pngPixels(await page.screenshot({ clip: point }))
      await page.locator('.page-imprints').evaluate(layer => layer.style.removeProperty('visibility'))
      const imprinted = await pngPixels(await visual.screenshot())
      const outsideInk = await pngPixels(await page.screenshot({ clip: point }))
      let bodyPixels = 0
      let changedBody = 0
      for (let i = 0; i < clean.data.length; i += 4) {
        if (theme === 'dark' ? clean.data[i] > 225 : clean.data[i] < 5) {
          bodyPixels++
          if ([0, 1, 2].some(channel => Math.abs(clean.data[i + channel] - imprinted.data[i + channel]) > 1))
            changedBody++
        }
      }
      assert.ok(bodyPixels >= 100, `Measure real opaque logo body pixels on ${theme} (${bodyPixels} sampled)`)
      assert.ok(Math.abs(outsideClean.data[0] - outsideInk.data[0]) > 30, `Decorative ink is actually visible outside the logo on ${theme}`)
      assert.equal(changedBody, 0, `Decorative imprints cannot erase the actual logo body on ${theme}`)
    }
  }
  finally {
    await page.evaluate(async (original) => {
      document.documentElement.dataset.theme = original.theme
      const layer = document.querySelector('.page-imprints')
      original.layer === null ? layer.removeAttribute('style') : layer.setAttribute('style', original.layer)
      await Promise.all([...layer.querySelectorAll('canvas')].map(async (canvas, i) => {
        const saved = original.canvases[i]
        canvas.width = saved.width
        canvas.height = saved.height
        if (saved.width && saved.height) {
          const image = new Image()
          image.src = saved.image
          await image.decode()
          canvas.getContext('2d').drawImage(image, 0, 0)
        }
      }))
    }, original)
    await style.evaluate(element => element.remove())
  }
}

export async function assertLogoPhotoInversion(page, visual) {
  await visual.evaluate(async (element) => {
    const bounds = element.getBoundingClientRect()
    const image = document.createElement('img')
    image.id = 'logo-photo-probe'
    image.src = `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80"><path fill="rgb(245,130,45)" d="M0 0h80v80H0z"/></svg>')}`
    image.style.cssText = `position:fixed;left:${bounds.left}px;top:${bounds.top}px;width:${bounds.width}px;height:${bounds.height}px;z-index:39;pointer-events:none`
    document.body.append(image)
    await image.decode()
  })
  try {
    await visual.evaluate(element => element.style.mixBlendMode = 'normal')
    const source = await pngPixels(await visual.screenshot())
    await visual.evaluate(element => element.style.removeProperty('mix-blend-mode'))
    const inverted = await pngPixels(await visual.screenshot())
    let body = 0
    let ink = 0
    for (let i = 0; i < source.data.length; i += 4) {
      if (source.data[i] === 231 && source.data[i + 1] === 231 && source.data[i + 2] === 231) {
        body++
        assert.deepEqual([...inverted.data.subarray(i, i + 3)], [14, 101, 186], 'Actual logo body inverts the underlying image')
      }
      if (source.data[i] < 30 && source.data[i + 1] === source.data[i] && source.data[i + 2] === source.data[i]) {
        ink++
        assert.deepEqual([...inverted.data.subarray(i, i + 3)], [245, 130, 45].map(value => Math.abs(value - source.data[i])), 'Actual logo lettering inverts the underlying image')
      }
    }
    assert.ok(body >= 100 && ink > 10, `Photo check covers actual body and lettering pixels (body ${body}, ink ${ink})`)
  }
  finally {
    await visual.evaluate(element => element.style.removeProperty('mix-blend-mode'))
    await page.locator('#logo-photo-probe').evaluate(element => element.remove())
  }
}

export async function assertInversion(page, element, source = 'light') {
  const filter = await element.evaluate(element => getComputedStyle(element).filter)
  assert.equal(await element.evaluate(element => getComputedStyle(element).mixBlendMode), 'difference')
  await page.evaluate(async ({ filter, source }) => {
    const colors = ['#E6E6E6', source === 'cursor' ? '#E6E6E6' : '#010101']
    const box = document.createElement('div')
    box.id = 'inversion-probe'
    box.style.cssText = 'position:fixed;top:0;left:0;width:120px;height:20px;z-index:2147483647;isolation:isolate;pointer-events:none'
    const background = document.createElement('img')
    const image = document.createElement('img')
    for (const child of [background, image])
      child.style.cssText = 'position:absolute;inset:0;width:120px;height:20px'
    background.src = `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="120" height="20"><path fill="#E6E6E6" d="M0 0h40v20H0z"/><path fill="#010101" d="M40 0h40v20H40z"/><path fill="rgb(245,130,45)" d="M80 0h40v20H80z"/></svg>')}`
    image.src = `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="120" height="20">${Array.from({ length: 6 }, (_, i) => `<path fill="${colors[i % 2]}" d="M${i * 20} 0h20v20H${i * 20}z"/>`).join('')}</svg>`)}`
    image.style.filter = filter
    image.style.mixBlendMode = 'difference'
    box.append(background, image)
    document.body.append(box)
    await Promise.all([background.decode(), image.decode()])
  }, { filter, source })
  const png = await page.screenshot({ clip: { x: 0, y: 0, width: 120, height: 20 }, scale: 'css' })
  const colors = await page.evaluate(async (source) => {
    document.querySelector('#inversion-probe').remove()
    const image = new Image()
    image.src = `data:image/png;base64,${source}`
    await image.decode()
    const canvas = document.createElement('canvas')
    canvas.width = 120
    canvas.height = 20
    const context = canvas.getContext('2d')
    context.drawImage(image, 0, 0)
    return [10, 30, 50, 70, 90, 110].map(x => [...context.getImageData(x, 10, 1, 1).data])
  }, png.toString('base64'))
  const gray = [230, 230, 230, 255]
  const black = [1, 1, 1, 255]
  const photo = [245, 130, 45, 255]
  const inversePhoto = [14, 101, 186, 255]
  assert.deepEqual(colors, source === 'cursor' ? [black, black, gray, gray, inversePhoto, inversePhoto] : [black, gray, gray, black, inversePhoto, photo], 'Invert the actual light, dark, and colored image backdrops without a theme change')
}
