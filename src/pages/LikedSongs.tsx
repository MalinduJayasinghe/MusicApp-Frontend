import React from "react"
import { Link } from "react-router-dom"
import { useLibrary } from "../hooks/useLibrary"
import { usePlayer } from "../hooks/usePlayer"
import { TrackRow } from "../components/music/TrackRow"
import { EmptyState } from "../components/common/EmptyState"
import { Button } from "../components/common/Button"
import { HeartFilledIcon, PlayIcon, ShuffleIcon } from "../components/common/Icons"
import { formatTotal } from "../util/format"

export const LikedSongs: React.FC = () => {
  const { likedSongs, loading } = useLibrary()
  const { playQueue, shufflePlay } = usePlayer()

  const total = likedSongs.reduce((sum, t) => sum + t.duration, 0)

  return (
    <div className="space-y-6">
      <div className="-mx-4 -mt-2 flex flex-col items-center gap-4 bg-linear-to-b from-indigo-600/60 to-transparent px-4 pb-6 pt-6 text-center sm:-mx-6 sm:flex-row sm:items-end sm:px-6 sm:text-left">
        <div className="grid size-40 shrink-0 place-items-center rounded-lg bg-linear-to-br from-indigo-600 to-fuchsia-400 text-6xl shadow-2xl sm:size-52 sm:text-7xl">
          <HeartFilledIcon />
        </div>
        <div>
          <p className="text-xs font-bold uppercase">Playlist</p>
          <h1 className="text-4xl font-black sm:text-6xl">Liked Songs</h1>
          <p className="mt-2 text-sm text-neutral-300">
            {likedSongs.length} {likedSongs.length === 1 ? "song" : "songs"}
            {likedSongs.length > 0 && ` · ${formatTotal(total)}`}
          </p>
        </div>
      </div>

      {loading ? null : likedSongs.length === 0 ? (
        <EmptyState title="Songs you like will appear here" description="Tap the heart on any song to save it.">
          <Link to="/search">
            <Button variant="secondary">Find songs</Button>
          </Link>
        </EmptyState>
      ) : (
        <>
          <div className="flex items-center gap-3">
            <button
              aria-label="Play all"
              onClick={() => playQueue(likedSongs)}
              className="grid size-14 place-items-center rounded-full bg-brand text-3xl text-black transition hover:scale-105"
            >
              <PlayIcon />
            </button>
            <button
              aria-label="Shuffle play"
              onClick={() => shufflePlay(likedSongs)}
              className="text-3xl text-neutral-400 transition hover:text-white"
            >
              <ShuffleIcon />
            </button>
          </div>
          <div>
            {likedSongs.map((track, i) => (
              <TrackRow key={track.videoId} track={track} position={i + 1} onPlay={() => playQueue(likedSongs, i)} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
