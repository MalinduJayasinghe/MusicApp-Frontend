import React from "react"
import { usePlayer } from "../../hooks/usePlayer"
import { useLibrary } from "../../hooks/useLibrary"
import { Cover } from "./Cover"
import { SeekBar } from "./SeekBar"
import { PlayerControls } from "./PlayerControls"
import {
  HeartFilledIcon,
  HeartIcon,
  PauseIcon,
  PlayIcon,
  QueueIcon,
  VolumeIcon,
  VolumeOffIcon
} from "../common/Icons"

export const PlayerBar: React.FC = () => {
  const {
    current,
    isPlaying,
    volume,
    muted,
    progress,
    duration,
    expanded,
    setVolume,
    toggleMute,
    togglePlay,
    setExpanded
  } = usePlayer()
  const { isLiked, toggleLike } = useLibrary()

  const liked = current ? isLiked(current.videoId) : false
  const shownVolume = muted ? 0 : volume

  return (
      <>
        {/* ---------- desktop bar ---------- */}
        <footer
            inert={!current}
            className={`hidden shrink-0 overflow-hidden transition-[height] duration-300 ease-out lg:block ${
                current ? "h-[88px]" : "h-0"
            }`}
        >
          <div className="grid h-[88px] grid-cols-[minmax(0,1fr)_minmax(0,640px)_minmax(0,1fr)] items-center gap-4 px-4">
            <div className="flex min-w-0 items-center gap-3">
              {current && (
                  <>
                    <Cover src={current.thumbnail} alt="" className="size-14 shrink-0 rounded" />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">{current.title}</p>
                      <p className="truncate text-xs text-neutral-400">{current.artist}</p>
                    </div>
                    <button
                        aria-label={liked ? "Remove from Liked Songs" : "Save to Liked Songs"}
                        onClick={() => toggleLike(current)}
                        className={`shrink-0 text-lg transition hover:scale-110 ${liked ? "text-brand" : "text-neutral-400 hover:text-white"}`}
                    >
                      {liked ? <HeartFilledIcon /> : <HeartIcon />}
                    </button>
                  </>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <PlayerControls />
              <SeekBar />
            </div>

            <div className="flex items-center justify-end gap-2">
              <button
                  aria-label={expanded ? "Hide now playing" : "Show now playing"}
                  aria-pressed={expanded}
                  onClick={() => setExpanded(!expanded)}
                  className={`mr-1 text-lg transition ${expanded ? "text-brand" : "text-neutral-400 hover:text-white"}`}
              >
                <QueueIcon />
              </button>
              <button
                  aria-label={muted ? "Unmute" : "Mute"}
                  onClick={toggleMute}
                  className="text-lg text-neutral-400 transition hover:text-white"
              >
                {shownVolume === 0 ? <VolumeOffIcon /> : <VolumeIcon />}
              </button>
              <input
                  type="range"
                  aria-label="Volume"
                  className="range !w-28"
                  min={0}
                  max={100}
                  value={shownVolume}
                  style={{ "--fill": `${shownVolume}%` } as React.CSSProperties}
                  onChange={(e) => setVolume(Number(e.target.value))}
              />
            </div>
          </div>
        </footer>

        {/* ---------- mobile mini player ---------- */}
        {current && (
            <div className="mx-2 mb-1 shrink-0 overflow-hidden rounded-lg bg-neutral-800 lg:hidden">
              <div className="flex items-center gap-3 p-2">
                <button
                    aria-label="Open player"
                    onClick={() => setExpanded(true)}
                    className="flex min-w-0 flex-1 items-center gap-3 text-left"
                >
                  <Cover src={current.thumbnail} alt="" className="size-11 shrink-0 rounded" />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">{current.title}</p>
                    <p className="truncate text-xs text-neutral-400">{current.artist}</p>
                  </div>
                </button>
                <button
                    aria-label={liked ? "Remove from Liked Songs" : "Save to Liked Songs"}
                    onClick={() => toggleLike(current)}
                    className={`text-xl ${liked ? "text-brand" : "text-neutral-300"}`}
                >
                  {liked ? <HeartFilledIcon /> : <HeartIcon />}
                </button>
                <button
                    aria-label={isPlaying ? "Pause" : "Play"}
                    onClick={togglePlay}
                    className="grid size-9 place-items-center rounded-full bg-white text-lg text-black"
                >
                  {isPlaying ? <PauseIcon /> : <PlayIcon />}
                </button>
              </div>
              <div className="h-0.5 bg-white/20">
                <div
                    className="h-full bg-white"
                    style={{ width: `${duration > 0 ? Math.min(100, (progress / duration) * 100) : 0}%` }}
                />
              </div>
            </div>
        )}
      </>
  )
}