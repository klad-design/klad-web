import assert from 'node:assert/strict'
import { Buffer } from 'node:buffer'
import { execFile } from 'node:child_process'
import { access, mkdir, readdir, readFile, writeFile } from 'node:fs/promises'
import { dirname } from 'node:path'
import { promisify } from 'node:util'

const exec = promisify(execFile)
const sources = []
for (const name of await readdir('src/app/work')) {
  let page
  try {
    page = await readFile(`src/app/work/${name}/CasePage.tsx`, 'utf8')
  }
  catch {
    continue
  }
  for (const [, src, poster] of page.matchAll(/<CaseVideo[^>]*src="([^"]+)"[^>]*poster="([^"]+)"/g))
    sources.push({ src, standard: poster.replace('/images/posters/', '/videos/').replace('.jpg', '.mp4') })
}
assert.ok(sources.length, 'No case-study videos found')

// H.264 frame-size and macroblocks/second limits for the levels used by these assets.
const limits = { 41: [8192, 245760], 42: [8704, 522240], 50: [22080, 589824], 51: [36864, 983040], 52: [36864, 2073600], 60: [139264, 4177920] }
function fitsLevel(video) {
  const [size, rate] = limits[video.level] || []
  const blocks = Math.ceil(video.width / 16) * Math.ceil(video.height / 16)
  const [numerator, denominator] = video.r_frame_rate.split('/').map(Number)
  return blocks <= size && blocks * numerator / denominator <= rate
}
async function probe(file) {
  const { stdout } = await exec('ffprobe', ['-v', 'error', '-select_streams', 'v:0', '-show_streams', '-of', 'json', file])
  return JSON.parse(stdout).streams[0]
}
const manifest = {}
await Promise.all(Array.from({ length: 2 }, async () => {
  while (sources.length) {
    const { src, standard } = sources.shift()
    const cached = `artifacts/video-sources${standard}`
    await mkdir(dirname(cached), { recursive: true })
    await mkdir(dirname(`public${standard}`), { recursive: true })
    try {
      await access(cached)
    }
    catch {
      const response = await fetch(src)
      assert.ok(response.ok, `Download failed: ${src}`)
      await writeFile(cached, Buffer.from(await response.arrayBuffer()))
    }
    const original = await probe(cached)
    let high = src
    if (!fitsLevel(original)) {
      high = standard.replace('.mp4', '-hd.mp4')
      // Repair SPS metadata without re-encoding or changing the full-resolution pixels.
      await exec('ffmpeg', ['-v', 'error', '-y', '-i', cached, '-map', '0:v:0', '-c:v', 'copy', '-bsf:v', 'h264_metadata=level=auto', '-movflags', '+faststart', `public${high}`])
      const corrected = await probe(`public${high}`)
      assert.ok(fitsLevel(corrected), `Invalid corrected encoding: ${high}`)
      assert.equal(corrected.width, original.width)
      assert.equal(corrected.height, original.height)
    }
    const [numerator, denominator] = original.r_frame_rate.split('/').map(Number)
    const fps = Math.min(30, numerator / denominator)
    await exec('ffmpeg', ['-v', 'error', '-y', '-i', cached, '-map', '0:v:0', '-an', '-vf', `scale=w='min(1920,iw)':h='min(1080,ih)':force_original_aspect_ratio=decrease:force_divisible_by=2:flags=lanczos,setsar=1,fps=${fps}`, '-c:v', 'libx264', '-threads', '2', '-preset', 'medium', '-crf', '18', '-profile:v', 'high', '-level:v', '4.1', '-pix_fmt', 'yuv420p', '-maxrate', '12M', '-bufsize', '24M', '-movflags', '+faststart', `public${standard}`])
    const compatible = await probe(`public${standard}`)
    assert.ok(fitsLevel(compatible) && compatible.level === 41 && compatible.width <= 1920 && compatible.height <= 1080 && compatible.pix_fmt === 'yuv420p', `Invalid compatibility rendition: ${standard}`)
    manifest[src] = { high, standard }
    console.log(`Prepared ${standard}`)
  }
}))
await mkdir('src/data', { recursive: true })
await writeFile('src/data/videos.json', `${JSON.stringify(Object.fromEntries(Object.entries(manifest).sort(([a], [b]) => a.localeCompare(b))), null, 2)}\n`)
console.log(`Validated ${Object.keys(manifest).length} video pairs.`)
