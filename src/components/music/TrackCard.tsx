import React from "react"
import { usePlayer } from "../../hooks/usePlayer"
import { Cover } from "./Cover"
import { PauseIcon, PlayIcon } from "../common/Icons"
import type { Track } from "../../types/music"

interface TrackCardProps {
  track: Track
  onPlay: () => void
}

export const TrackCard: React.FC<TrackCardProps> = ({ track, onPlay }) => {
  const { current, isPlaying, togglePlay } = usePlayer()
  const isCurrent = current?.videoId === track.videoId

  return (
    <button
      onClick={() => (isCurrent ? togglePlay() : onPlay())}
      className="group relative flex w-full flex-col rounded-lg bg-neutral-900 p-3 text-left transition hover:bg-neutral-800"
    >
      <div className="relative mb-3">
        <Cover src={track.thumbnail} alt="" className="aspect-square w-full rounded-md shadow-lg" />
        <span className="absolute bottom-2 right-2 grid size-11 translate-y-2 place-items-center rounded-full bg-brand text-xl text-black opacity-0 shadow-xl transition group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100 max-lg:translate-y-0 max-lg:opacity-100 max-lg:size-9">
          {isCurrent && isPlaying ? <PauseIcon /> : <PlayIcon />}
        </span>
      </div>
      <p className={`line-clamp-1 text-sm font-bold ${isCurrent ? "text-brand" : "text-white"}`}>{track.title}</p>
      <p className="line-clamp-2 text-xs text-neutral-400">{track.artist}</p>
    </button>
  )
}
