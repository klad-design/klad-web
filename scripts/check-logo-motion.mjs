import assert from 'node:assert/strict'
import { Buffer } from 'node:buffer'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { gzipSync } from 'node:zlib'

import { chromium, webkit } from 'playwright'

const svg = await readFile('public/images/logo-scroll-motion.svg', 'utf8')
const original = await readFile('public/images/logotype.svg', 'utf8')
const reference = await readFile('scripts/fixtures/logo-motion-mask.png')
const tonalReference = await readFile('scripts/fixtures/logo-motion-reference.png')
const foldReference = await readFile('scripts/fixtures/logo-fold-reference.png')
assert.ok(Buffer.byteLength(svg) < 340_000, 'Keep the corner-aligned SVG under 340 KB')
assert.ok(gzipSync(svg).length < 80_000, 'Keep its compressed transfer under 80 KB')
assert.deepEqual([...new Set(svg.match(/#[\da-f]{3,8}\b/gi))].sort(), ['#010101', '#E6E6E6'], 'Use only the two exact brand paint colors')
assert.doesNotMatch(svg, /<(?:[\w-]+:)?(?:image|feImage|script|foreignObject)\b|data:|blob:|@import|https?:\/\/(?!www\.w3\.org\/2000\/svg)/i)
await mkdir('artifacts/logo-motion', { recursive: true })

for (const [name, engine] of Object.entries({ chromium, webkit })) {
  const browser = await engine.launch()
  try {
    const page = await browser.newPage({ viewport: { width: 960, height: 960 }, reducedMotion: 'no-preference' })
    const errors = []
    page.on('console', message => message.type() === 'error' && errors.push(message.text()))
    page.on('pageerror', error => errors.push(error.message))
    await page.setContent(`<style>html,body{margin:0;background:transparent}svg{display:block}</style>${svg}`)
    const audit = await page.evaluate((source) => {
      const document = new DOMParser().parseFromString(source, 'image/svg+xml')
      const elements = [...document.querySelectorAll('*')]
      const allowed = new Set(['svg', 'title', 'style', 'defs', 'g', 'path', 'filter', 'feGaussianBlur', 'feFlood', 'feComposite', 'feMerge', 'feMergeNode', 'animate', 'animateTransform', 'use', 'clipPath'])
      return {
        unsupported: elements.filter(element => element.namespaceURI !== 'http://www.w3.org/2000/svg' || !allowed.has(element.localName)).map(element => element.tagName),
        references: elements.flatMap(element => [...element.attributes].flatMap((attribute) => {
          if (attribute.localName === 'href')
            return [attribute.value]
          return [...attribute.value.matchAll(/url\(\s*['"]?([^)'"\s]+)['"]?\s*\)/g)].map(match => match[1])
        })),
        ids: elements.map(element => element.id).filter(Boolean),
      }
    }, svg)
    assert.deepEqual(audit.unsupported, [], `${name}: only SVG geometry, animation, and procedural filter elements`)
    for (const reference of audit.references) {
      assert.ok(reference.startsWith('#'), `${name}: no external or embedded image references`)
      assert.ok(audit.ids.includes(reference.slice(1)), `${name}: reference resolves inside this SVG`)
    }
    const animations = await page.locator('animate,animateTransform').evaluateAll(elements => elements.map(element => ({
      attribute: element.getAttribute('attributeName'),
      type: element.getAttribute('type'),
      duration: element.getAttribute('dur'),
      repeat: element.getAttribute('repeatCount'),
      mode: element.getAttribute('calcMode'),
      values: element.getAttribute('values').split(';'),
      times: element.getAttribute('keyTimes').split(';').map(Number),
      splines: element.getAttribute('keySplines')?.split(';').map(spline => spline.split(' ').map(Number)),
    })))
    assert.equal(animations.length, 16)
    const originalLetters = await page.evaluate(source => [...new DOMParser().parseFromString(source, 'image/svg+xml').querySelectorAll('path[fill="#E6E6E6"]')].map(path => path.getAttribute('d')), original)
    assert.equal(originalLetters.length, 9)
    assert.deepEqual(await page.locator('#logo-glyphs path').evaluateAll(paths => paths.map(path => path.getAttribute('d'))), originalLetters, `${name}: retain the original glyph geometry`)
    for (const animation of animations) {
      assert.equal(animation.duration, '2s')
      assert.equal(animation.repeat, 'indefinite')
      const translate = animation.type === 'translate' && animation.values.length === 62
      const projectedSoftness = animation.type === 'translate' && !translate
      const outline = animation.attribute === 'd'
      assert.equal(animation.mode, ['d', 'opacity'].includes(animation.attribute) || projectedSoftness ? 'linear' : 'spline')
      assert.equal(animation.values.length, translate ? 62 : 61)
      assert.equal(animation.times.length, animation.values.length)
      assert.equal(animation.values.at(-1), animation.values[0], `${name}: exact matching endpoint for ${animation.type || animation.attribute}`)
      animation.times.forEach((time, key) => assert.ok(Math.abs(time - (translate && key > 30 ? key - 1 : key) / 60) < 1e-8))
      if (outline) {
        const commands = animation.values[0].match(/[mlz]/gi)
        animation.values.forEach((value) => {
          assert.deepEqual(value.match(/[mlz]/gi), commands, `${name}: compatible morph topology`)
        })
      }

      if (animation.splines) {
        assert.equal(animation.splines.length, animation.values.length - 1)
        const start = animation.values[0].split(' ').map(Number)
        const next = animation.values[1].split(' ').map(Number)
        const previous = animation.values.at(-2).split(' ').map(Number)
        const first = animation.splines[0]
        const last = animation.splines.at(-1)
        start.forEach((value, component) => {
          const outgoing = (next[component] - value) / (animation.times[1] - animation.times[0]) * first[1] / first[0]
          const incoming = (value - previous[component]) / (animation.times.at(-1) - animation.times.at(-2)) * (1 - last[3]) / (1 - last[2])
          assert.ok(Math.abs(incoming - outgoing) < 1e-4, `${name}: matching loop velocity for ${animation.type || animation.attribute}`)
        })
      }
    }
    assert.equal(await page.locator('svg').getAttribute('role'), 'img')
    assert.match(await page.locator('svg > title').textContent(), /Klad Syndicate/)
    await page.evaluate(() => document.querySelector('svg').pauseAnimations())

    const motion = await page.evaluate(() => {
      const svg = document.querySelector('svg')
      const orientation = document.querySelector('#logo-word-orientation')
      const ink = document.querySelector('#logo-word-face')
      const outline = document.querySelector('#logo-outline')
      const point = svg.createSVGPoint()
      point.x = 480
      point.y = 483.4
      const centers = []
      for (let sample = 0; sample <= 480; sample++) {
        svg.setCurrentTime(sample / 240)
        const projection = orientation.getCTM().inverse().multiply(ink.getCTM())
        centers.push(point.matrixTransform(projection).y)
      }
      const outlinePoints = [0.2, 0.2 + 1 / 120, 0.2 + 2 / 120, 0.2 + 3 / 120].map((time) => {
        svg.setCurrentTime(time)
        const point = outline.getPointAtLength(0)
        return { x: point.x, y: point.y }
      })
      return { centers, outlinePoints }
    })
    for (let sample = 1; sample < motion.centers.length; sample++) {
      if (sample === 240)
        continue
      assert.ok(motion.centers[sample] >= motion.centers[sample - 1] - 0.001, `${name}: the projected lettering must not reverse at ${sample / 240}s`)
    }
    for (let sample = 1; sample < motion.outlinePoints.length; sample++) {
      const before = motion.outlinePoints[sample - 1]
      const after = motion.outlinePoints[sample]
      assert.ok(Math.hypot(after.x - before.x, after.y - before.y) > 0.01, `${name}: outline interpolates between the original 30 fps frames`)
    }

    const capture = async (time) => {
      await page.evaluate(async (time) => {
        document.querySelector('svg').setCurrentTime(time)
        await new Promise(resolve => requestAnimationFrame(resolve))
      }, time)
      return page.screenshot({ omitBackground: true })
    }
    const frames = []
    for (let frame = 0; frame < 60; frame++) {
      const png = await capture((frame + 0.5) / 30)
      const scale = await page.locator('#logo-word-scale').evaluate(element => ({
        actual: element.transform.animVal.getItem(0).matrix.d,
        values: element.querySelector('animateTransform').getAttribute('values').split(';').map(value => Number(value.split(' ')[1])),
      }))
      assert.ok(scale.actual >= Math.min(scale.values[frame], scale.values[frame + 1]) - 1e-5 && scale.actual <= Math.max(scale.values[frame], scale.values[frame + 1]) + 1e-5, `${name}: lettering rolls between frames ${frame} and ${frame + 1}`)
      const shift = await page.locator('#logo-word-shift').evaluate(element => ({
        actual: element.transform.animVal.getItem(0).matrix.f,
        values: element.querySelector('animateTransform').getAttribute('values').split(';').map(value => Number(value.split(' ')[1])),
      }))
      const shiftKey = frame < 30 ? frame : frame + 1
      assert.ok(shift.actual >= Math.min(shift.values[shiftKey], shift.values[shiftKey + 1]) - 1e-4 && shift.actual <= Math.max(shift.values[shiftKey], shift.values[shiftKey + 1]) + 1e-4, `${name}: lettering stays on the visible face at frame ${frame}`)
      frames.push(png)
      await writeFile(`artifacts/logo-motion/${name}-${String(frame).padStart(2, '0')}.png`, png)
    }
    assert.ok(new Set(frames.map(frame => frame.toString('base64'))).size > 55, `${name}: the animation must advance`)
    // A corner present in both keys must not disappear in the in-between shape.
    const lettering = page.locator('#logo-lettering')
    const fold = page.locator('#logo-fold')
    await lettering.evaluate(element => element.style.visibility = 'hidden')
    await fold.evaluate(element => element.style.visibility = 'hidden')
    for (const [progress, x, y] of [[20.833333333, 280, 235], [77.5, 180, 385]]) {
      const png = await capture(progress / 50)
      const brightness = await page.evaluate(async ({ png, x, y }) => {
        const image = new Image()
        image.src = `data:image/png;base64,${png}`
        await image.decode()
        const canvas = document.createElement('canvas')
        canvas.width = canvas.height = 960
        const context = canvas.getContext('2d')
        context.fillStyle = '#010101'
        context.fillRect(0, 0, 960, 960)
        context.drawImage(image, 0, 0)
        return context.getImageData(x, y, 1, 1).data[0]
      }, { png: png.toString('base64'), x, y })
      assert.ok(brightness > 200, `${name}: preserve the corner at ${progress}%`)
    }
    await lettering.evaluate(element => element.style.removeProperty('visibility'))
    await fold.evaluate(element => element.style.removeProperty('visibility'))
    const matchedFrames = []
    for (let frame = 0; frame < 60; frame++)
      matchedFrames.push((await capture(frame / 30)).toString('base64'))
    // Binary masks from the user's 60-frame video; exclude lettering to compare the fold itself.
    const fidelity = await page.evaluate(async ({ reference, tonalReference, images }) => {
      const source = new Image()
      source.src = `data:image/png;base64,${reference}`
      await source.decode()
      const tonalSource = new Image()
      tonalSource.src = `data:image/png;base64,${tonalReference}`
      await tonalSource.decode()
      const canvas = document.createElement('canvas')
      canvas.width = canvas.height = 240
      const context = canvas.getContext('2d')
      const scores = []
      for (const [frame, base64] of images.entries()) {
        context.drawImage(source, frame % 12 * 240, Math.floor(frame / 12) * 240, 240, 240, 0, 0, 240, 240)
        const expected = context.getImageData(0, 0, 240, 240).data
        context.drawImage(tonalSource, frame % 12 * 240, Math.floor(frame / 12) * 240, 240, 240, 0, 0, 240, 240)
        const tonalExpected = context.getImageData(0, 0, 240, 240).data
        const image = new Image()
        image.src = `data:image/png;base64,${base64}`
        await image.decode()
        context.fillStyle = '#010101'
        context.fillRect(0, 0, 240, 240)
        context.drawImage(image, 0, 0, 240, 240)
        const actual = context.getImageData(0, 0, 240, 240).data
        let intersection = 0
        let union = 0
        let typeError = 0
        let typePixels = 0
        for (let y = 0; y < 240; y++) {
          for (let x = 0; x < 240; x++) {
            const perpendicular = (x - 120) * Math.sin(34.8 * Math.PI / 180) + (y - 120) * Math.cos(34.8 * Math.PI / 180)
            const along = (x - 120) * Math.cos(34.8 * Math.PI / 180) - (y - 120) * Math.sin(34.8 * Math.PI / 180)
            if (Math.abs(perpendicular) < 23 && Math.abs(along) < 76) {
              const pixel = (y * 240 + x) * 4
              // The video uses 0/229; the required brand palette is 1/230.
              typeError += Math.abs(Math.min(255, tonalExpected[pixel] + 1) - actual[pixel])
              typePixels++
            }
            // Include the projected feathering in the tonal check, not the body mask.
            if (Math.abs(perpendicular) < 23)
              continue
            const pixel = (y * 240 + x) * 4
            const first = expected[pixel] > 110
            const second = actual[pixel] > 111
            intersection += Number(first && second)
            union += Number(first || second)
          }
        }
        scores.push({ overlap: intersection / union, typeError: typeError / typePixels })
      }
      return scores
    }, { reference: reference.toString('base64'), tonalReference: tonalReference.toString('base64'), images: matchedFrames })
    fidelity.forEach(({ overlap, typeError }, frame) => {
      assert.ok(overlap > 0.97, `${name}: preserve the original video silhouette at frame ${frame} (${(overlap * 100).toFixed(2)}% overlap)`)
      assert.ok(typeError < 15, `${name}: preserve the lettering weight and tone at frame ${frame} (${typeError.toFixed(2)} error)`)
    })
    const creaseError = await page.evaluate(async ({ actual, reference }) => {
      const canvas = document.createElement('canvas')
      canvas.width = 110
      canvas.height = 90
      const context = canvas.getContext('2d')
      const pixels = []
      for (const [index, src] of [reference, actual].entries()) {
        const image = new Image()
        image.src = `data:image/png;base64,${src}`
        await image.decode()
        context.fillStyle = '#010101'
        context.fillRect(0, 0, 110, 90)
        if (index)
          context.drawImage(image, 360, 400, 110, 90, 0, 0, 110, 90)
        else
          context.drawImage(image, 0, 0)
        pixels.push(context.getImageData(0, 0, 110, 90).data)
      }
      let error = 0
      for (let i = 0; i < pixels[0].length; i += 4)
        error += Math.abs(Math.min(255, pixels[0][i] + 1) - pixels[1][i])
      return error / (110 * 90)
    }, { actual: matchedFrames[30], reference: foldReference.toString('base64') })
    assert.ok(creaseError < 2.3, `${name}: preserve the fold's tonal taper (${creaseError.toFixed(2)} error)`)
    // Binary-exact times avoid WebKit's fractional seek rounding between cycles.
    assert.ok((await capture(0)).equals(await capture(2)), `${name}: exact first frame at the repeat boundary`)
    assert.ok((await capture(0.5)).equals(await capture(2.5)), `${name}: exact matching motion in consecutive cycles`)

    // Sample the wrap itself so the front-facing minimum is not skipped.
    const boundaryFrames = []
    for (const offset of [-2, -1, 0, 1, 2])
      boundaryFrames.push(await capture(2 + offset / 120))
    const steps = await page.evaluate(async (images) => {
      const canvas = document.createElement('canvas')
      canvas.width = canvas.height = 960
      const context = canvas.getContext('2d')
      const pixels = await Promise.all(images.map(async (base64) => {
        const image = new Image()
        image.src = `data:image/png;base64,${base64}`
        await image.decode()
        context.clearRect(0, 0, 960, 960)
        context.drawImage(image, 0, 0)
        return context.getImageData(0, 0, 960, 960).data
      }))
      return pixels.slice(1).map((frame, index) => {
        const before = pixels[index]
        let difference = 0
        for (let pixel = 0; pixel < frame.length; pixel += 4) {
          for (let channel = 0; channel < 3; channel++)
            difference += Math.abs(frame[pixel + channel] * frame[pixel + 3] / 255 - before[pixel + channel] * before[pixel + 3] / 255)
        }
        return difference / (960 * 960 * 3)
      })
    }, boundaryFrames.map(frame => frame.toString('base64')))
    for (const step of steps.slice(1, 3)) {
      assert.ok(step >= 0.85 * Math.min(steps[0], steps[3]), `${name}: no extra held frame at the wrap`)
      assert.ok(step <= 1.15 * Math.max(steps[0], steps[3]), `${name}: no extra jump at the wrap`)
    }

    const body = page.locator('#logo-body')
    await fold.evaluate(element => element.style.visibility = 'hidden')
    for (const time of [0.975, 1, 1.005, 1.01, 1.016667, 1.033333, 1.05]) {
      await body.evaluate(element => element.style.filter = 'none')
      await lettering.evaluate(element => element.style.visibility = 'hidden')
      const geometry = await capture(time)
      await body.evaluate(element => element.style.opacity = '0')
      await lettering.evaluate(element => element.style.removeProperty('visibility'))
      const ink = await capture(time)
      const clipping = await page.evaluate(async (images) => {
        const canvas = document.createElement('canvas')
        canvas.width = canvas.height = 960
        const context = canvas.getContext('2d')
        const [geometry, ink] = await Promise.all(images.map(async (base64) => {
          const image = new Image()
          image.src = `data:image/png;base64,${base64}`
          await image.decode()
          context.clearRect(0, 0, 960, 960)
          context.drawImage(image, 0, 0)
          return context.getImageData(0, 0, 960, 960).data
        }))
        let visible = 0
        let outside = 0
        for (let y = 1; y < 959; y++) {
          for (let x = 1; x < 959; x++) {
            if (ink[(y * 960 + x) * 4 + 3] <= 25)
              continue
            visible++
            let inside = false
            for (let dy = -1; dy <= 1; dy++) {
              for (let dx = -1; dx <= 1; dx++)
                inside ||= geometry[((y + dy) * 960 + x + dx) * 4 + 3] > 64
            }
            if (!inside)
              outside++
          }
        }
        return { visible, outside }
      }, [geometry, ink].map(image => image.toString('base64')))
      assert.equal(clipping.outside, 0, `${name}: no lettering outside the logo at ${time}s`)
      if (time === 1)
        assert.equal(clipping.visible, 0, `${name}: the face change is invisible at zero scale`)
      await body.evaluate(element => element.removeAttribute('style'))
      await lettering.evaluate(element => element.removeAttribute('style'))
    }
    await fold.evaluate(element => element.style.removeProperty('visibility'))

    const alpha = await page.evaluate(async (base64) => {
      const image = new Image()
      image.src = `data:image/png;base64,${base64}`
      await image.decode()
      const canvas = document.createElement('canvas')
      canvas.width = canvas.height = 960
      const context = canvas.getContext('2d')
      context.drawImage(image, 0, 0)
      const { data } = context.getImageData(0, 0, 960, 960)
      return {
        corners: [0, 959, 960 * 959, 960 * 960 - 1].map(pixel => data[pixel * 4 + 3]),
        glow: data.some((value, index) => index % 4 === 3 && value > 0 && value < 255),
        mark: data.some((value, index) => index % 4 === 3 && value === 255),
      }
    }, frames[0].toString('base64'))
    assert.deepEqual(alpha.corners, [0, 0, 0, 0], `${name}: transparent background`)
    assert.ok(alpha.glow && alpha.mark, `${name}: translucent glow and opaque artwork`)

    await page.emulateMedia({ reducedMotion: 'reduce' })
    assert.equal(await page.locator('.motion').evaluate(element => getComputedStyle(element).display), 'none')
    assert.equal(await page.locator('.still').evaluate(element => getComputedStyle(element).display), 'inline')
    assert.ok((await capture(0)).equals(await capture(1)), `${name}: reduced motion stays still`)
    assert.deepEqual(errors, [], `${name}: no SVG parsing or playback errors`)

    await page.emulateMedia({ reducedMotion: 'no-preference' })
    await page.setContent(`<style>body{margin:0;background:transparent}</style><img width="960" height="960" alt="Klad Syndicate" src="data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}">`)
    await page.locator('img').evaluate(image => image.decode())
    const first = await page.screenshot({ omitBackground: true })
    await page.waitForTimeout(450)
    assert.ok(!first.equals(await page.screenshot({ omitBackground: true })), `${name}: animate inside an img element`)
    console.log(`${name}: continuous outline, coherent roll, clipped lettering, seamless repeat, transparency, reduced motion, and img playback passed.`)
  }
  finally {
    await browser.close()
  }
}
console.log(`SVG: ${Buffer.byteLength(svg).toLocaleString()} bytes; gzip: ${gzipSync(svg).length.toLocaleString()} bytes.`)
