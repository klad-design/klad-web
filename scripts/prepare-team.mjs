import assert from 'node:assert/strict'
import { Buffer } from 'node:buffer'
import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const sharp = require(require.resolve('sharp', { paths: [require.resolve('next')] }))
const source = 'public/images/team-mobile/v4'
const destination = 'public/images/team-mobile/v5'
const frames = (await readdir(source)).filter(name => /^\d+\.avif$/.test(name))
assert.equal(frames.length, 122, 'Expected the complete 122-frame team sequence')
const images = []

function errorPercent(source, candidate) {
  let black = 0
  let white = 0
  let foreground = 0
  for (let i = 0; i < source.length; i += 4) {
    const alpha = source[i + 3]
    const otherAlpha = candidate[i + 3]
    if (alpha)
      foreground++
    for (let channel = 0; channel < 3; channel++) {
      const delta = (source[i + channel] * alpha - candidate[i + channel] * otherAlpha) / 255
      black += delta * delta
      white += (delta + otherAlpha - alpha) ** 2
    }
  }
  return 100 * Math.sqrt(Math.max(black, white) / (foreground * 3)) / 255
}

const sample = Buffer.from([255, 0, 0, 255, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
assert.equal(errorPercent(sample, sample), 0)
assert.ok(errorPercent(sample, Buffer.alloc(sample.length)) > 0)

for (let frame = 0; frame < frames.length; frame++) {
  const { data, info } = await sharp(`${source}/${frame}.avif`).raw().toBuffer({ resolveWithObject: true })
  assert.equal(info.width, 832)
  assert.equal(info.height, 832)
  assert.equal(info.channels, 4, `Frame ${frame} must preserve transparency`)
  let encoded
  let error
  for (const quality of [54, 56]) {
    encoded = await sharp(data, { raw: { width: 832, height: 832, channels: 4 } })
      .avif({ quality, effort: 8, chromaSubsampling: '4:4:4' })
      .toBuffer()
    const decoded = await sharp(encoded).ensureAlpha().raw().toBuffer()
    error = errorPercent(data, decoded)
    // Leave room for browser compositing rounding at the 1% visual threshold.
    if (error <= 0.99)
      break
  }
  assert.ok(error <= 1, `Mobile frame ${frame} exceeded 1% RMS: ${error}`)
  assert.ok(encoded.length < (await readFile(`${source}/${frame}.avif`)).length, `Mobile frame ${frame} did not improve its source size`)
  images.push(encoded)
}

// Preserve v4 and validate the complete sequence before writing the versioned assets.
await mkdir(destination, { recursive: true })
for (let frame = 0; frame < images.length; frame++)
  await writeFile(`${destination}/${frame}.avif`, images[frame])
console.log(`Prepared and validated ${images.length} mobile frames (${images.reduce((sum, image) => sum + image.length, 0)} bytes).`)
