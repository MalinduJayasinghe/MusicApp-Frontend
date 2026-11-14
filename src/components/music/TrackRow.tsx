import React from "react"
import { usePlayer } from "../../hooks/usePlayer"
import { useLibrary } from "../../hooks/useLibrary"
import { Cover } from "./Cover"
import { EqualizerIcon } from "./EqualizerIcon"
import { TrackMenu } from "./TrackMenu"
import { HeartFilledIcon, HeartIcon, PauseIcon, PlayIcon } from "../common/Icons"
import { formatTime } from "../../util/format"
import type { Track } from "../../types/music"

interface TrackRowProps {
  track: Track
  position: number
  onPlay: () => void // starts the whole list from this song
  onRemove?: () => void
}

export const TrackRow: React.FC<TrackRowProps> = ({ track, position, onPlay, onRemove }) => {
  const { current, isPlaying, togglePlay } = usePlayer()
  const { isLiked, toggleLike } = useLibrary()

  const isCurrent = current?.videoId === track.videoId
  const liked = isLiked(track.videoId)

  const handleClick = () => (isCurrent ? togglePlay() : onPlay())

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={(e) => e.key === "Enter" && handleClick()}
      className="group grid cursor-pointer grid-cols-[2rem_minmax(0,1fr)_auto_auto_auto] items-center gap-3 rounded-md px-3 py-2 hover:bg-white/10 focus-visible:bg-white/10 focus-visible:outline-none"
    >
      <div className="grid place-items-center text-sm text-neutral-400">
        <span className="group-hover:hidden group-focus-visible:hidden">
          {isCurrent ? <EqualizerIcon playing={isPlaying} /> : position}
        </span>
        <span className="hidden text-lg text-white group-hover:block group-focus-visible:block">
          {isCurrent && isPlaying ? <PauseIcon /> : <PlayIcon />}
        </span>
      </div>

      <div className="flex min-w-0 items-center gap-3">
        <Cover src={track.thumbnail} alt="" className="size-10 shrink-0 rounded" />
        <div className="min-w-0">
          <p className={`truncate text-sm font-medium ${isCurrent ? "text-brand" : "text-white"}`}>{track.title}</p>
          <p className="truncate text-xs text-neutral-400">{track.artist}</p>
        </div>
      </div>

      <button
        aria-label={liked ? "Remove from Liked Songs" : "Save to Liked Songs"}
        onClick={(e) => {
          e.stopPropagation()
          toggleLike(track)
        }}
        className={`text-lg transition ${liked ? "text-brand" : "text-neutral-400 opacity-0 hover:text-white group-hover:opacity-100 group-focus-visible:opacity-100 max-lg:opacity-100"}`}
      >
        {liked ? <HeartFilledIcon /> : <HeartIcon />}
      </button>

      <span className="hidden w-10 text-right text-sm tabular-nums text-neutral-400 sm:block">
        {formatTime(track.duration)}
      </span>

      <TrackMenu track={track} onRemove={onRemove} />
    </div>
  )
}
