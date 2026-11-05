import assert from 'node:assert/strict'
import { mkdir, readdir, writeFile } from 'node:fs/promises'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const sharp = require(require.resolve('sharp', { paths: [require.resolve('next')] }))
await mkdir('src/assets/team-fav', { recursive: true })

for (const name of await readdir('public/images/team-fav')) {
  const image = sharp(`public/images/team-fav/${name}`).resize({ width: 48, height: 65 }).ensureAlpha()
  const png = await image.clone().png().toBuffer()
  assert.deepEqual(await sharp(png).ensureAlpha().raw().toBuffer(), await image.raw().toBuffer())
  await writeFile(`src/assets/team-fav/${name.replace('.avif', '.png')}`, png)
}

const source = sharp('public/images/noise.gif', { animated: true })
const webp = await source.clone().webp({ lossless: true, effort: 6 }).toBuffer()
const original = await source.clone().ensureAlpha().raw().toBuffer()
const decoded = await sharp(webp, { animated: true }).ensureAlpha().raw().toBuffer()
assert.equal(decoded.length, original.length)
for (let index = 0; index < original.length; index += 4) {
  assert.equal(decoded[index + 3], original[index + 3], 'Grain alpha must remain exact')
  if (original[index + 3])
    assert.deepEqual(decoded.subarray(index, index + 3), original.subarray(index, index + 3), 'Visible grain pixels must remain exact')
}
const before = await source.metadata()
const after = await sharp(webp, { animated: true }).metadata()
for (const key of ['width', 'height', 'pages', 'pageHeight', 'delay', 'loop'])
  assert.deepEqual(after[key], before[key], `Grain ${key} must remain unchanged`)
await writeFile('src/assets/noise.webp', webp)
console.log(`Prepared 48×65 lossless thumbnails and ${webp.length}-byte grain with identical decoded frames and timing.`)
