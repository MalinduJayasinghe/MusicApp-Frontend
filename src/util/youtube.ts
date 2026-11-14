let apiPromise: Promise<void> | null = null

type YouTubeWindow = Window & {
  YT?: typeof YT
  onYouTubeIframeAPIReady?: () => void
}

// Loads https://www.youtube.com/iframe_api once and resolves when it is ready.
export const loadYouTubeApi = (): Promise<void> => {
  if (apiPromise) return apiPromise

  apiPromise = new Promise<void>((resolve, reject) => {
    const w = window as YouTubeWindow
    if (w.YT?.Player) return resolve()

    const previous = w.onYouTubeIframeAPIReady
    w.onYouTubeIframeAPIReady = () => {
      previous?.()
      resolve()
    }

    const script = document.createElement("script")
    script.src = "https://www.youtube.com/iframe_api"
    script.onerror = () => {
      apiPromise = null
      reject(new Error("Failed to load the YouTube player"))
    }
    document.head.appendChild(script)
  })

  return apiPromise
}
