import assert from 'node:assert/strict'
import { Buffer } from 'node:buffer'
import { readFile } from 'node:fs/promises'
import { stripTypeScriptTypes } from 'node:module'

const source = await readFile(new URL('../src/components/prepareLogoMotion.ts', import.meta.url), 'utf8')
const { prepareLogoMotion } = await import(`data:text/javascript;base64,${Buffer.from(stripTypeScriptTypes(source)).toString('base64')}`)

function fixture(values) {
  let attached = true
  const attributes = { d: values.split(';')[0] }
  const animation = {
    parentElement: null,
    getAttribute: name => ({ values, keyTimes: '0;0.5;1', calcMode: 'linear', dur: '2s' })[name],
    remove: () => attached = false,
  }
  animation.parentElement = {
    setAttribute: (name, value) => attributes[name] = value,
    append(child) {
      assert.equal(child, animation)
      attached = true
    },
  }
  return { animation, attributes, attached: () => attached }
}

const paths = [
  fixture('M0 0L10 -2z;M10 4L20 -6z;M0 0L10 -2z'),
  fixture('M0 0L10 -2z;M10 4L20 -6z;M0 0L10 -2z'),
  fixture('M1e-2 -.5L3 +4;M2e-2 .5L5 6;M1e-2 -.5L3 +4'),
]
const svg = {
  time: 0,
  querySelectorAll: () => paths.filter(path => path.attached()).map(path => path.animation),
  setCurrentTime(time) {
    assert.equal(this, svg, 'Native seeking keeps the SVG receiver')
    this.time = time
  },
}
const nativeSeek = svg.setCurrentTime
for (let install = 0; install < 3; install++) {
  const restore = prepareLogoMotion(svg)
  assert.ok(paths.every(path => !path.attached()), 'Prepared path timelines leave the native SMIL seek')
  for (const [time, expected] of [[0, [0, 0, 10, -2]], [0.5, [5, 2, 15, -4]], [1, [10, 4, 20, -6]], [1.5, [5, 2, 15, -4]], [2, [0, 0, 10, -2]]]) {
    svg.setCurrentTime(time)
    assert.equal(svg.time, time, 'Non-path SMIL still receives the original time')
    assert.deepEqual(paths[0].attributes.d.match(/[-+]?(?:\d*\.)?\d+(?:e[-+]?\d+)?/gi).map(Number), expected)
    assert.equal(paths[0].attributes.d, paths[1].attributes.d, 'Shared outline copies use the same pose')
  }
  svg.setCurrentTime(0.5)
  assert.deepEqual(paths[2].attributes.d.match(/[-+]?(?:\d*\.)?\d+(?:e[-+]?\d+)?/gi).map(Number), [0.015, 0, 4, 5], 'Exponents, signs and fractional coordinates interpolate')
  restore()
  assert.equal(svg.setCurrentTime, nativeSeek, 'Reinstall restores the original method without bound wrappers')
  assert.ok(paths.every(path => path.attached()), 'Cleanup restores the source timelines')
}
console.log('Logo path interpolation: fractional poses, shared paths, native seeking, looping and reinstall passed.')
