import assert from 'node:assert/strict'
import { mkdir, readdir } from 'node:fs/promises'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const sharp = require(require.resolve('sharp', { paths: [require.resolve('next')] }))
const source = 'public/images/team'
const destination = 'public/images/team-mobile/v3'
const frames = (await readdir(source)).filter(name => /^\d+\.avif$/.test(name))
assert.equal(frames.length, 122, 'Expected the complete 122-frame team sequence')
await mkdir(destination, { recursive: true })

let bytes = 0
for (let frame = 0; frame < frames.length; frame++) {
  // Match the mobile canvas at 1.5x without dropping animation frames.
  const image = await sharp(`${source}/${frame}.avif`)
    .resize(640, 640)
    .avif({ quality: 45, effort: 5, chromaSubsampling: '4:4:4' })
    .toFile(`${destination}/${frame}.avif`)
  assert.equal(image.width, 640)
  assert.equal(image.height, 640)
  assert.equal(image.channels, 4, `Frame ${frame} must preserve transparency`)
  bytes += image.size
}
console.log(`Prepared and validated ${frames.length} mobile frames (${bytes} bytes).`)
