import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"
import { useLibrary } from "../hooks/useLibrary"
import { usePlayer } from "../hooks/usePlayer"
import { getTrending } from "../service/music"
import { getRecentlyPlayed } from "../service/library"
import { TrackCard } from "../components/music/TrackCard"
import { Cover, PlaylistCover } from "../components/music/Cover"
import { HeartFilledIcon } from "../components/common/Icons"
import { getErrorMessage } from "../util/error"
import { greeting, songCount } from "../util/format"
import type { Track } from "../types/music"

const GRID = "grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6"

export const Home: React.FC = () => {
  const { user } = useAuth()
  const { playlists, likedSongs } = useLibrary()
  const { playQueue } = usePlayer()

  const [trending, setTrending] = useState<{ tracks: Track[]; error: string } | null>(null)
  const [recent, setRecent] = useState<Track[]>([])

  useEffect(() => {
    getTrending()
      .then((tracks) => setTrending({ tracks, error: "" }))
      .catch((err) => setTrending({ tracks: [], error: getErrorMessage(err, "Could not load trending music") }))

    getRecentlyPlayed().then(setRecent).catch(console.error)
  }, [])

  const tileClass =
    "group flex items-center gap-3 overflow-hidden rounded-md bg-white/10 pr-3 transition hover:bg-white/20"

  return (
    <div className="space-y-8">
      <h1 className="pt-2 text-2xl font-extrabold sm:text-3xl">
        {greeting()}
        {user?.name ? `, ${user.name.split(" ")[0]}` : ""}
      </h1>

      {/* quick access tiles */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
        <Link to="/liked" className={tileClass}>
          <span className="grid size-14 shrink-0 place-items-center bg-linear-to-br from-indigo-600 to-fuchsia-400 text-2xl">
            <HeartFilledIcon />
          </span>
          <span className="min-w-0">
            <span className="block truncate text-sm font-bold">Liked Songs</span>
            <span className="block text-xs text-neutral-400">{songCount(likedSongs.length)}</span>
          </span>
        </Link>
        {playlists.slice(0, 5).map((p) => (
          <Link key={p._id} to={`/playlist/${p._id}`} className={tileClass}>
            {p.tracks.length ? (
              <PlaylistCover tracks={p.tracks} className="size-14 shrink-0" />
            ) : (
              <Cover className="size-14 shrink-0" />
            )}
            <span className="min-w-0 truncate text-sm font-bold">{p.name}</span>
          </Link>
        ))}
      </div>

      {recent.length > 0 && (
        <section>
          <h2 className="mb-3 text-xl font-bold">Recently played</h2>
          <div className={GRID}>
            {recent.slice(0, 6).map((track, i) => (
              <TrackCard key={track.videoId} track={track} onPlay={() => playQueue(recent, i)} />
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="mb-3 text-xl font-bold">Trending music</h2>
        {trending === null ? (
          <div className={`${GRID} animate-pulse`}>
            {Array.from({ length: 6 }, (_, i) => (
              <div key={i} className="aspect-[3/4] rounded-lg bg-neutral-800" />
            ))}
          </div>
        ) : trending.error ? (
          <p className="rounded-lg bg-rose-500/10 p-4 text-sm text-rose-300">{trending.error}</p>
        ) : (
          <div className={GRID}>
            {trending.tracks.map((track, i) => (
              <TrackCard key={track.videoId} track={track} onPlay={() => playQueue(trending.tracks, i)} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
