// Firefox reparses every SMIL path keyframe on each seek; interpolate the same coordinates once prepared.
export function prepareLogoMotion(svg: SVGSVGElement) {
  const number = /[-+]?(?:\d*\.)?\d+(?:e[-+]?\d+)?/gi
  const prepared = new Map<string, { frames: number[][], parts: string[], times: number[] }>()
  const paths = [...svg.querySelectorAll('animate[attributeName="d"]')].map((animation) => {
    const values = animation.getAttribute('values')!
    let motion = prepared.get(values)
    if (!motion) {
      const keys = values.split(';')
      const frames = keys.map(key => (key.match(number) || []).map(Number))
      const parts = keys[0].split(number)
      const times = animation.getAttribute('keyTimes')!.split(';').map(Number)
      if (animation.getAttribute('calcMode') !== 'linear' || animation.getAttribute('dur') !== '2s'
        || frames.length !== times.length || frames.some(frame => frame.length !== frames[0].length)) {
        throw new Error('Unsupported logo path animation')
      }
      motion = { frames, parts, times }
      prepared.set(values, motion)
    }
    const path = animation.parentElement!
    animation.remove()
    return { path, motion, animation }
  })
  const seek = svg.setCurrentTime
  svg.setCurrentTime = (time) => {
    seek.call(svg, time)
    const progress = ((time % 2) + 2) % 2 / 2
    const poses = new Map<object, string>()
    for (const { path, motion } of paths) {
      let pose = poses.get(motion)
      if (!pose) {
        const { frames, parts, times } = motion
        let index = 0
        while (index < times.length - 2 && times[index + 1] <= progress)
          index++
        const blend = (progress - times[index]) / (times[index + 1] - times[index])
        pose = parts[0]
        for (let coordinate = 0; coordinate < frames[index].length; coordinate++) {
          const start = frames[index][coordinate]
          pose += `${start + (frames[index + 1][coordinate] - start) * blend} ${parts[coordinate + 1]}`
        }
        poses.set(motion, pose)
      }
      path.setAttribute('d', pose)
    }
  }
  return () => {
    svg.setCurrentTime = seek
    paths.forEach(({ path, animation }) => path.append(animation))
  }
}
