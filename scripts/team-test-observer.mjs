export const teamFrameURL = /\/images\/(?:team-mobile\/v5|team)\/\d+\.avif$/

export async function observeTeam(context) {
  await context.addInitScript(() => {
    const source = /\/images\/(?:team-mobile\/v5|team)\/(\d+)\.avif$/
    const identities = new WeakMap()
    const ready = new WeakSet()
    const nativeSource = Object.getOwnPropertyDescriptor(HTMLImageElement.prototype, 'src')
    const nativeDecode = HTMLImageElement.prototype.decode
    const nativeBitmap = window.createImageBitmap
    let nextImage = 0
    let visibility
    const visibilityGetter = Object.getOwnPropertyDescriptor(Document.prototype, 'visibilityState')?.get
    const originalVisibility = document.visibilityState
    Object.defineProperty(document, 'visibilityState', { configurable: true, get: () => visibility || visibilityGetter?.call(document) || originalVisibility })
    window.__teamSetVisibility = (value) => {
      visibility = value
      document.dispatchEvent(new Event('visibilitychange'))
    }
    window.__teamDecoded = new Set()
    window.__teamPaints = []
    window.__teamReleases = []
    window.__teamImages = []
    window.__teamDecodeActive = 0
    window.__teamDecodePeak = 0
    window.__teamResidentPeak = 0
    window.__teamSourcePeak = 0
    window.__teamBitmapCalls = 0
    window.__portraitDraws = 0
    window.__portraitFrames = []
    window.__portraitWidths = []

    function residency() {
      const images = window.__teamImages.filter(image => !image.cleared && !image.failed)
      window.__teamSourcePeak = Math.max(window.__teamSourcePeak, images.length)
      window.__teamResidentPeak = Math.max(window.__teamResidentPeak, images.filter(image => image.decoded).length)
    }

    function identify(url) {
      const match = url?.match(source)
      if (!match)
        return
      const frame = Number(match[1])
      const mobile = url.includes('/team-mobile/v5/')
      const size = mobile ? 832 : 1080
      return { id: nextImage++, url, frame, size, expectedWidth: size, expectedHeight: size, cleared: false }
    }

    Object.defineProperty(HTMLImageElement.prototype, 'src', {
      ...nativeSource,
      get() {
        return nativeSource.get.call(this)
      },
      set(value) {
        const previous = identities.get(this)
        nativeSource.set.call(this, value)
        if (value === '' && previous) {
          previous.cleared = true
          return
        }
        const info = identify(nativeSource.get.call(this))
        if (info) {
          identities.set(this, info)
          window.__teamImages.push(info)
          residency()
        }
      },
    })
    HTMLImageElement.prototype.decode = async function (...args) {
      const info = identities.get(this)
      if (!info)
        return nativeDecode.apply(this, args)
      info.decoding = true
      window.__teamDecodeActive++
      window.__teamDecodePeak = Math.max(window.__teamDecodePeak, window.__teamDecodeActive)
      try {
        await nativeDecode.apply(this, args)
        info.nativeDecoded = true
        if (window.__teamHold61 && info.frame === 61)
          await new Promise(resolve => window.__teamRelease61 = resolve)
        if (window.__teamHoldNonSeeds && info.frame % 8 !== 0 && ![30, 60, 90, 121].includes(info.frame))
          await new Promise(resolve => window.__teamReleases.push(resolve))
        ready.add(this)
        info.decoded = true
        window.__teamDecoded.add(info.url)
        residency()
      }
      catch (error) {
        info.failed = true
        throw error
      }
      finally {
        info.decoding = false
        window.__teamDecodeActive--
      }
    }
    if (nativeBitmap) {
      window.createImageBitmap = function (...args) {
        window.__teamBitmapCalls++
        return nativeBitmap.apply(this, args)
      }
    }
    const clear = CanvasRenderingContext2D.prototype.clearRect
    const draw = CanvasRenderingContext2D.prototype.drawImage
    let paint
    CanvasRenderingContext2D.prototype.clearRect = function (...args) {
      if (this.canvas.closest?.('#team')) {
        paint = { time: performance.now(), draws: [] }
        window.__teamPaints.push(paint)
      }
      return clear.apply(this, args)
    }
    CanvasRenderingContext2D.prototype.drawImage = function (...args) {
      const info = identities.get(args[0])
      if (this.canvas.closest?.('#team') && info) {
        const sourceWidth = args[0].naturalWidth
        const sourceHeight = args[0].naturalHeight
        const scale = Math.min(this.canvas.width / info.size, this.canvas.height / info.size)
        const stageX = (this.canvas.width - info.size * scale) / 2
        const stageY = (this.canvas.height - info.size * scale) / (innerWidth < 768 ? 2 : 1)
        const expected = [stageX, stageY, sourceWidth * scale, sourceHeight * scale]
        const mappingError = args.length === 5 ? Math.max(...expected.map((value, index) => Math.abs(value - args[index + 1]))) : Infinity
        paint?.draws.push({
          frame: info.frame,
          source: info.url,
          alpha: this.globalAlpha,
          operation: this.globalCompositeOperation,
          decoded: ready.has(args[0]),
          cleared: info.cleared,
          width: info.size,
          sourceWidth,
          sourceHeight,
          mappingError,
          sourceDimensionsValid: sourceWidth === info.expectedWidth && sourceHeight === info.expectedHeight,
        })
        window.__portraitDraws++
        if (this.globalCompositeOperation !== 'lighter')
          window.__portraitFrames.push(info.frame + 1 - this.globalAlpha)
        if (innerWidth < 768)
          window.__portraitWidths.push(args[3] / sourceWidth * info.size / this.canvas.width)
      }
      return draw.apply(this, args)
    }
  })
}
