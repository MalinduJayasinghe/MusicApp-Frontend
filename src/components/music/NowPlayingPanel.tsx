import React from "react"
import { usePlayer } from "../../hooks/usePlayer"
import { useLibrary } from "../../hooks/useLibrary"
import { Cover } from "./Cover"
import { EqualizerIcon } from "./EqualizerIcon"
import { SeekBar } from "./SeekBar"
import { PlayerControls } from "./PlayerControls"
import { TrackMenu } from "./TrackMenu"
import { ChevronDownIcon, HeartFilledIcon, HeartIcon } from "../common/Icons"
import { formatTime } from "../../util/format"


export const NowPlayingPanel: React.FC = () => {
  const { current, queue, index, isPlaying, error, expanded, setExpanded, playAt } = usePlayer()
  const { isLiked, toggleLike } = useLibrary()

  const open = expanded && !!current
  const liked = current ? isLiked(current.videoId) : false

  return (
      <aside
          aria-label="Now playing"
          aria-hidden={!open}
          inert={!open}
          className={`fixed inset-0 z-50 flex bg-neutral-950 transition-[transform,width,margin,opacity] duration-300 ease-out lg:static lg:inset-auto lg:z-auto lg:shrink-0 lg:overflow-hidden lg:rounded-lg lg:bg-neutral-900 ${
              open
                  ? "translate-y-0 lg:w-[360px]"
                  : "pointer-events-none translate-y-full lg:-ml-2 lg:w-0 lg:opacity-0"
          }`}
      >
        <div className="flex w-full flex-col overflow-y-auto p-4 lg:w-[360px] lg:shrink-0 lg:overflow-hidden">
          <div className="flex items-center justify-between">
            <button
                aria-label="Close player"
                onClick={() => setExpanded(false)}
                className="grid size-8 place-items-center rounded-full text-2xl text-neutral-300 transition hover:bg-white/10 hover:text-white"
            >
              <ChevronDownIcon />
            </button>
            <h2 className="text-sm font-bold">Now playing</h2>
            {current ? <TrackMenu track={current} hideQueueActions /> : <span className="size-8" />}
          </div>

          <div className="mx-auto mt-4 w-full max-w-sm">
            <Cover
                src={current?.thumbnail}
                alt={current ? `${current.title} cover` : ""}
                className="aspect-square w-full rounded-lg shadow-2xl"
            />
          </div>

          {current && (
              <div className="mt-5 flex items-center gap-3">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-lg font-extrabold">{current.title}</p>
                  <p className="truncate text-sm text-neutral-400">{current.artist}</p>
                </div>
                <button
                    aria-label={liked ? "Remove from Liked Songs" : "Save to Liked Songs"}
                    onClick={() => toggleLike(current)}
                    className={`text-2xl transition hover:scale-110 ${liked ? "text-brand" : "text-neutral-400 hover:text-white"}`}
                >
                  {liked ? <HeartFilledIcon /> : <HeartIcon />}
                </button>
              </div>
          )}

          {error && (
              <p role="alert" className="mt-3 rounded-md bg-rose-500/10 px-3 py-2 text-xs text-rose-300">
                {error}
              </p>
          )}

          {/* controls duplicated here for small screens (the desktop bar is hidden there) */}
          <div className="mt-4 space-y-2 lg:hidden">
            <SeekBar />
            <PlayerControls />
          </div>

          <div className="-mx-2 mt-5 flex min-h-0 flex-1 flex-col">
            <h3 className="px-2 pb-2 text-sm font-bold text-neutral-300">
              Queue {queue.length > 0 && <span className="font-normal text-neutral-500">· {queue.length}</span>}
            </h3>
            {queue.length === 0 ? (
                <p className="px-2 text-xs text-neutral-500">Songs you play will show up here.</p>
            ) : (
                <ul className="min-h-0 flex-1 overflow-y-auto pb-2">
                  {queue.map((track, i) => {
                    const active = i === index
                    return (
                        <li key={`${track.videoId}-${i}`}>
                          <button
                              onClick={() => playAt(i)}
                              className="flex w-full items-center gap-3 rounded-md px-2 py-1.5 text-left hover:bg-white/10"
                          >
                            <Cover src={track.thumbnail} alt="" className="size-10 shrink-0 rounded" />
                            <div className="min-w-0 flex-1">
                              <p className={`truncate text-sm ${active ? "font-semibold text-brand" : "text-white"}`}>
                                {track.title}
                              </p>
                              <p className="truncate text-xs text-neutral-400">{track.artist}</p>
                            </div>
                            {active ? (
                                <EqualizerIcon playing={isPlaying} />
                            ) : (
                                <span className="text-xs tabular-nums text-neutral-500">{formatTime(track.duration)}</span>
                            )}
                          </button>
                        </li>
                    )
                  })}
                </ul>
            )}
          </div>
        </div>
      </aside>
  )
}