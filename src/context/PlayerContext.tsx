import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react"
import { PlayerContext, type PlayerContextValue, type RepeatMode } from "./player-context"
import { addRecentlyPlayed } from "../service/library"
import { loadYouTubeApi } from "../util/youtube"
import type { Track } from "../types/music"

const VOLUME_KEY = "PLAYER_VOLUME"
const MAX_ERROR_STREAK = 5 // stop auto-skipping after this many unplayable tracks in a row

const readStoredVolume = (): number => {
    const stored = localStorage.getItem(VOLUME_KEY)
    const value = stored === null ? NaN : Number(stored)
    return Number.isFinite(value) ? Math.min(100, Math.max(0, value)) : 80
}
const INITIAL_VOLUME = readStoredVolume()

interface PlayerStore {
    queue: Track[]
    index: number
    repeat: RepeatMode
    shuffle: boolean
    volume: number
    muted: boolean
    pendingId: string | null
    lastLoggedId: string
    errorStreak: number
}

const PlayerProvider = ({ children }: { children: ReactNode }) => {
    const hostRef = useRef<HTMLDivElement>(null)
    const playerRef = useRef<YT.Player | null>(null)
    const readyRef = useRef(false)
    const store = useRef<PlayerStore>({
        queue: [],
        index: -1,
        repeat: "off",
        shuffle: false,
        volume: INITIAL_VOLUME,
        muted: false,
        pendingId: null,
        lastLoggedId: "",
        errorStreak: 0
    })

    const [queue, setQueue] = useState<Track[]>([])
    const [index, setIndex] = useState(-1)
    const [isPlaying, setIsPlaying] = useState(false)
    const [isBuffering, setIsBuffering] = useState(false)
    const [progress, setProgress] = useState(0)
    const [duration, setDuration] = useState(0)
    const [volume, setVolumeState] = useState(INITIAL_VOLUME)
    const [muted, setMuted] = useState(false)
    const [repeat, setRepeat] = useState<RepeatMode>("off")
    const [shuffle, setShuffle] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [expanded, setExpanded] = useState(false)

    const current = index >= 0 ? (queue[index] ?? null) : null


    const loadTrack = useCallback((i: number) => {
        const s = store.current
        const track = s.queue[i]
        if (!track) return

        s.index = i
        setIndex(i)
        setProgress(0)
        setDuration(track.duration)
        setError(null)

        const player = playerRef.current
        if (readyRef.current && player) {
            player.loadVideoById(track.videoId)
            setIsBuffering(true)
        } else {
            s.pendingId = track.videoId
        }
    }, [])

    const playQueue = useCallback(
        (tracks: Track[], startIndex = 0) => {
            if (!tracks.length) return
            store.current.queue = tracks
            setQueue(tracks)
            loadTrack(Math.min(Math.max(startIndex, 0), tracks.length - 1))

            if (window.matchMedia("(min-width: 1024px)").matches) setExpanded(true)
        },
        [loadTrack]
    )

    const shufflePlay = useCallback(
        (tracks: Track[]) => {
            if (!tracks.length) return
            store.current.shuffle = true
            setShuffle(true)
            playQueue(tracks, Math.floor(Math.random() * tracks.length))
        },
        [playQueue]
    )

    const next = useCallback(
        (fromEnded = false) => {
            const s = store.current
            const len = s.queue.length
            if (!len) return

            if (s.shuffle && len > 1) {
                let n = s.index
                while (n === s.index) n = Math.floor(Math.random() * len)
                loadTrack(n)
                return
            }

            const n = s.index + 1
            if (n < len) loadTrack(n)
            else if (s.repeat === "all") loadTrack(0)
            else if (fromEnded) {
                setIsPlaying(false)
                setProgress(0)
            }
        },
        [loadTrack]
    )

    const previous = useCallback(() => {
        const s = store.current
        const player = playerRef.current
        if (!s.queue.length) return

        if ((player?.getCurrentTime() ?? 0) > 3 || s.index <= 0) {
            player?.seekTo(0, true)
            setProgress(0)
        } else {
            loadTrack(s.index - 1)
        }
    }, [loadTrack])

    const play = useCallback(() => playerRef.current?.playVideo(), [])
    const pause = useCallback(() => playerRef.current?.pauseVideo(), [])

    const togglePlay = useCallback(() => {
        const player = playerRef.current
        if (!player || !readyRef.current || store.current.index < 0) return

        const state = player.getPlayerState()
        if (state === YT.PlayerState.PLAYING || state === YT.PlayerState.BUFFERING) {
            player.pauseVideo()
        } else {
            player.playVideo()
        }
    }, [])

    const seek = useCallback((seconds: number) => {
        playerRef.current?.seekTo(seconds, true)
        setProgress(seconds)
    }, [])

    const setVolume = useCallback((value: number) => {
        const v = Math.round(Math.min(100, Math.max(0, value)))
        const s = store.current
        s.volume = v
        localStorage.setItem(VOLUME_KEY, String(v))
        setVolumeState(v)

        if (v > 0 && s.muted) {
            s.muted = false
            setMuted(false)
            playerRef.current?.unMute()
        }
        if (readyRef.current) playerRef.current?.setVolume(v)
    }, [])

    const toggleMute = useCallback(() => {
        const s = store.current
        s.muted = !s.muted
        setMuted(s.muted)
        if (!readyRef.current) return
        if (s.muted) playerRef.current?.mute()
        else playerRef.current?.unMute()
    }, [])

    const toggleShuffle = useCallback(() => {
        store.current.shuffle = !store.current.shuffle
        setShuffle(store.current.shuffle)
    }, [])

    const cycleRepeat = useCallback(() => {
        const order: RepeatMode[] = ["off", "all", "one"]
        const nextMode = order[(order.indexOf(store.current.repeat) + 1) % order.length]
        store.current.repeat = nextMode
        setRepeat(nextMode)
    }, [])

    const addToQueue = useCallback(
        (track: Track) => {
            const s = store.current
            if (!s.queue.length) return playQueue([track])
            s.queue = [...s.queue, track]
            setQueue(s.queue)
        },
        [playQueue]
    )

    const playNext = useCallback(
        (track: Track) => {
            const s = store.current
            if (!s.queue.length) return playQueue([track])
            const copy = [...s.queue]
            copy.splice(s.index + 1, 0, track)
            s.queue = copy
            setQueue(copy)
        },
        [playQueue]
    )

    const handleEnded = useCallback(() => {
        if (store.current.repeat === "one") {
            playerRef.current?.seekTo(0, true)
            playerRef.current?.playVideo()
        } else {
            next(true)
        }
    }, [next])

    const handleError = useCallback(
        (code: number) => {
            const s = store.current
            const failedIndex = s.index
            const title = s.queue[failedIndex]?.title ?? "This track"

            s.errorStreak += 1
            setIsPlaying(false)
            setIsBuffering(false)
            // 101 / 150 = the video owner does not allow playback in embedded players
            setError(
                code === 101 || code === 150
                    ? `“${title}” can’t be played outside YouTube. Skipping…`
                    : `“${title}” is unavailable. Skipping…`
            )

            if (s.errorStreak < MAX_ERROR_STREAK && s.queue.length > 1) {
                window.setTimeout(() => {
                    if (store.current.index === failedIndex) next(true)
                }, 1500)
            }
        },
        [next]
    )

    useEffect(() => {
        const host = hostRef.current
        if (!host) return

        let cancelled = false
        let player: YT.Player | null = null

        loadYouTubeApi()
            .then(() => {
                if (cancelled) return

                const mount = document.createElement("div")
                host.appendChild(mount)

                player = new YT.Player(mount, {
                    width: "100%",
                    height: "100%",
                    playerVars: {
                        autoplay: 1,
                        controls: 0,
                        rel: 0,
                        playsinline: 1,
                        modestbranding: 1,
                        disablekb: 1,
                        fs: 0,
                        origin: window.location.origin
                    },
                    events: {
                        onReady: (e) => {
                            const s = store.current
                            readyRef.current = true
                            e.target.setVolume(s.volume)
                            if (s.pendingId) {
                                e.target.loadVideoById(s.pendingId)
                                s.pendingId = null
                            }
                        },
                        onStateChange: (e) => {
                            const s = store.current
                            const states = YT.PlayerState

                            if (e.data === states.PLAYING) {
                                setIsPlaying(true)
                                setIsBuffering(false)
                                s.errorStreak = 0
                                const realDuration = e.target.getDuration()
                                if (realDuration > 0) setDuration(realDuration)

                                const track = s.queue[s.index]
                                if (track && s.lastLoggedId !== track.videoId) {
                                    s.lastLoggedId = track.videoId
                                    addRecentlyPlayed(track).catch(() => undefined)
                                }
                            } else if (e.data === states.PAUSED) {
                                setIsPlaying(false)
                                setIsBuffering(false)
                            } else if (e.data === states.BUFFERING) {
                                setIsBuffering(true)
                            } else if (e.data === states.ENDED) {
                                setIsPlaying(false)
                                handleEnded()
                            }
                        },
                        onError: (e) => handleError(e.data)
                    }
                })
                playerRef.current = player
            })
            .catch(() => setError("Could not load the YouTube player. Check your connection."))

        return () => {
            cancelled = true
            readyRef.current = false
            playerRef.current = null
            try {
                player?.destroy()
            } catch {
                /* player was never created */
            }
            host.replaceChildren()
        }
    }, [handleEnded, handleError])

    useEffect(() => {
        if (!isPlaying) return
        const timer = window.setInterval(() => {
            if (readyRef.current && playerRef.current) {
                setProgress(playerRef.current.getCurrentTime())
            }
        }, 500)
        return () => window.clearInterval(timer)
    }, [isPlaying])


    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.code !== "Space") return
            const el = e.target as HTMLElement | null
            const tag = el?.tagName
            if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || tag === "BUTTON" || el?.isContentEditable) return
            e.preventDefault()
            togglePlay()
        }
        window.addEventListener("keydown", onKeyDown)
        return () => window.removeEventListener("keydown", onKeyDown)
    }, [togglePlay])

    useEffect(() => {
        if (!("mediaSession" in navigator) || !current) return
        navigator.mediaSession.metadata = new MediaMetadata({
            title: current.title,
            artist: current.artist,
            artwork: [{ src: current.thumbnail, sizes: "320x180", type: "image/jpeg" }]
        })
    }, [current])

    useEffect(() => {
        if (!("mediaSession" in navigator)) return
        navigator.mediaSession.playbackState = isPlaying ? "playing" : "paused"
        navigator.mediaSession.setActionHandler("play", play)
        navigator.mediaSession.setActionHandler("pause", pause)
        navigator.mediaSession.setActionHandler("previoustrack", previous)
        navigator.mediaSession.setActionHandler("nexttrack", () => next())
    }, [isPlaying, play, pause, previous, next])

    const value = useMemo<PlayerContextValue>(
        () => ({
            current,
            queue,
            index,
            isPlaying,
            isBuffering,
            progress,
            duration,
            volume,
            muted,
            repeat,
            shuffle,
            error,
            expanded,
            playQueue,
            shufflePlay,
            playAt: loadTrack,
            togglePlay,
            next: () => next(),
            previous,
            seek,
            setVolume,
            toggleMute,
            toggleShuffle,
            cycleRepeat,
            addToQueue,
            playNext,
            setExpanded
        }),
        [current, queue, index, isPlaying, isBuffering, progress, duration, volume, muted, repeat, shuffle, error, expanded, playQueue, shufflePlay, loadTrack, togglePlay, next, previous, seek, setVolume, toggleMute, toggleShuffle, cycleRepeat, addToQueue, playNext]
    )

    return (
        <PlayerContext.Provider value={value}>
            {children}
            <div
                ref={hostRef}
                aria-hidden="true"
                className="pointer-events-none fixed -left-[9999px] top-0 h-[200px] w-[200px] overflow-hidden"
            />
        </PlayerContext.Provider>
    )
}

export default PlayerProvider