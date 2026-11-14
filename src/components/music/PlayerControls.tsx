import React from "react"
import { usePlayer } from "../../hooks/usePlayer"
import {
  NextIcon,
  PauseIcon,
  PlayIcon,
  PrevIcon,
  RepeatIcon,
  RepeatOneIcon,
  ShuffleIcon
} from "../common/Icons"

export const PlayerControls: React.FC<{ className?: string }> = ({ className = "" }) => {
  const { current, isPlaying, isBuffering, shuffle, repeat, togglePlay, next, previous, toggleShuffle, cycleRepeat } =
    usePlayer()

  const side = "text-xl transition hover:text-white disabled:opacity-40 disabled:hover:text-neutral-400"

  return (
    <div className={`flex items-center justify-center gap-5 text-neutral-400 ${className}`}>
      <button
        aria-label="Shuffle"
        aria-pressed={shuffle}
        onClick={toggleShuffle}
        className={`${side} ${shuffle ? "!text-brand" : ""}`}
      >
        <ShuffleIcon />
      </button>
      <button aria-label="Previous" onClick={previous} disabled={!current} className={`${side} text-2xl`}>
        <PrevIcon />
      </button>
      <button
        aria-label={isPlaying ? "Pause" : "Play"}
        onClick={togglePlay}
        disabled={!current}
        className="grid size-10 place-items-center rounded-full bg-white text-xl text-black transition hover:scale-105 disabled:opacity-40 disabled:hover:scale-100"
      >
        {isBuffering && !isPlaying ? (
          <span className="size-4 animate-spin rounded-full border-2 border-black/30 border-t-black" />
        ) : isPlaying ? (
          <PauseIcon />
        ) : (
          <PlayIcon />
        )}
      </button>
      <button aria-label="Next" onClick={next} disabled={!current} className={`${side} text-2xl`}>
        <NextIcon />
      </button>
      <button
        aria-label={`Repeat: ${repeat}`}
        onClick={cycleRepeat}
        className={`${side} ${repeat !== "off" ? "!text-brand" : ""}`}
      >
        {repeat === "one" ? <RepeatOneIcon /> : <RepeatIcon />}
      </button>
    </div>
  )
}
