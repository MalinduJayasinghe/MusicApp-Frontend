import { createContext } from "react"
import type { Track } from "../types/music"

export type RepeatMode = "off" | "all" | "one"

export interface PlayerContextValue {
  current: Track | null
  queue: Track[]
  index: number
  isPlaying: boolean
  isBuffering: boolean
  progress: number
  duration: number
  volume: number
  muted: boolean
  repeat: RepeatMode
  shuffle: boolean
  error: string | null
  expanded: boolean // full-screen "now playing" sheet on small screens

  playQueue: (tracks: Track[], startIndex?: number) => void
  shufflePlay: (tracks: Track[]) => void
  playAt: (index: number) => void
  togglePlay: () => void
  next: () => void
  previous: () => void
  seek: (seconds: number) => void
  setVolume: (value: number) => void
  toggleMute: () => void
  toggleShuffle: () => void
  cycleRepeat: () => void
  addToQueue: (track: Track) => void
  playNext: (track: Track) => void
  setExpanded: (value: boolean) => void
}

export const PlayerContext = createContext<PlayerContextValue | null>(null)
