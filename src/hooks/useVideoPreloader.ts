import { useState, useEffect, useCallback } from 'react'

const BASE = import.meta.env.BASE_URL

// 第一關需要的圖片
const ALL_IMAGES = [
  `${BASE}assets/images/22222.png`,
  `${BASE}assets/images/獲得華.png`,
  `${BASE}assets/images/MC.png`,
  `${BASE}assets/images/RRRRRR.png`,
  `${BASE}assets/images/超負荷挺toyz.png`,
  `${BASE}assets/images/溝通溝通.png`,
]

// 所有需要預載的影片
const ALL_VIDEOS = [
  // 第二關
  `${BASE}超負荷挺Toyz.mp4`,
  `${BASE}太LOW了.mp4`,
  `${BASE}溝通溝通.mp4`,
  `${BASE}哭蕊宿頭.mp4`,
  // 第三關
  `${BASE}斗影片.mp4`,
  `${BASE}你拉一下啊.mp4`,
  `${BASE}獲得華.mp4`,
  `${BASE}MC.mp4`,
]

const TOTAL_ASSETS = ALL_IMAGES.length + ALL_VIDEOS.length

interface PreloadState {
  isLoading: boolean
  progress: number // 0-100
  loadedCount: number
  totalCount: number
  error: string | null
}

export function useVideoPreloader() {
  const [state, setState] = useState<PreloadState>({
    isLoading: true,
    progress: 0,
    loadedCount: 0,
    totalCount: TOTAL_ASSETS,
    error: null,
  })

  const preloadImage = useCallback((src: string): Promise<void> => {
    return new Promise((resolve) => {
      const img = new Image()
      img.onload = () => resolve()
      img.onerror = () => {
        console.warn(`Failed to preload image: ${src}`)
        resolve()
      }
      img.src = src
    })
  }, [])

  const preloadVideo = useCallback((src: string): Promise<void> => {
    return new Promise((resolve) => {
      const video = document.createElement('video')
      video.preload = 'auto'
      video.muted = true
      video.playsInline = true

      const handleCanPlayThrough = () => {
        cleanup()
        resolve()
      }

      const handleError = () => {
        cleanup()
        // 不要因為單一影片失敗就中斷，繼續載入其他影片
        console.warn(`Failed to preload: ${src}`)
        resolve() // 還是 resolve，讓其他影片繼續載入
      }

      const handleTimeout = () => {
        cleanup()
        console.warn(`Timeout preloading: ${src}`)
        resolve() // timeout 也繼續
      }

      const cleanup = () => {
        video.removeEventListener('canplaythrough', handleCanPlayThrough)
        video.removeEventListener('error', handleError)
        clearTimeout(timeoutId)
      }

      // 30 秒超時
      const timeoutId = setTimeout(handleTimeout, 30000)

      video.addEventListener('canplaythrough', handleCanPlayThrough)
      video.addEventListener('error', handleError)
      video.src = src
      video.load()
    })
  }, [])

  const preloadAll = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, progress: 0, loadedCount: 0 }))

    let loadedCount = 0

    // 先載入第一關的圖片（優先）
    await Promise.all(
      ALL_IMAGES.map(async (src) => {
        await preloadImage(src)
        loadedCount++
        setState(prev => ({
          ...prev,
          loadedCount,
          progress: Math.round((loadedCount / TOTAL_ASSETS) * 100),
        }))
      })
    )

    // 再載入影片，限制同時載入數量
    const batchSize = 3
    for (let i = 0; i < ALL_VIDEOS.length; i += batchSize) {
      const batch = ALL_VIDEOS.slice(i, i + batchSize)
      await Promise.all(
        batch.map(async (src) => {
          await preloadVideo(src)
          loadedCount++
          setState(prev => ({
            ...prev,
            loadedCount,
            progress: Math.round((loadedCount / TOTAL_ASSETS) * 100),
          }))
        })
      )
    }

    setState(prev => ({ ...prev, isLoading: false, progress: 100 }))
  }, [preloadImage, preloadVideo])

  useEffect(() => {
    preloadAll()
  }, [preloadAll])

  return state
}
