import React, { useState } from "react"
import { Link, NavLink, useNavigate } from "react-router-dom"
import { useLibrary } from "../../hooks/useLibrary"
import { useToast } from "../../hooks/useToast"
import { Cover, PlaylistCover } from "../music/Cover"
import { PlaylistFormModal } from "../music/PlaylistFormModal"
import { songCount } from "../../util/format"
import { HeartFilledIcon, HomeIcon, LibraryIcon, PlusIcon, SearchIcon } from "../common/Icons"

export const Logo: React.FC = () => (
  <Link to="/" className="flex items-center gap-2 text-xl font-black tracking-tight">
    <span className="grid size-8 place-items-center rounded-full bg-brand text-black">
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round">
        <path d="M4 14c2-5 4-5 6 0s4 5 6 0 3-4 4-2" />
        <path d="M4 9c2-4 4-4 6 0s4 4 6 0 3-3 4-1.5" opacity=".55" />
      </svg>
    </span>
    Wavely
  </Link>
)

const navClass = ({ isActive }: { isActive: boolean }) =>
  `flex items-center gap-4 text-sm font-bold transition ${isActive ? "text-white" : "text-neutral-400 hover:text-white"}`

export const Sidebar: React.FC = () => {
  const { playlists, likedSongs, createPlaylist } = useLibrary()
  const { showToast } = useToast()
  const navigate = useNavigate()
  const [creating, setCreating] = useState(false)

  const handleCreate = async (name: string, description: string) => {
    const playlist = await createPlaylist(name, description)
    showToast("Playlist created")
    navigate(`/playlist/${playlist._id}`)
  }

  const itemClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 rounded-md p-2 transition hover:bg-white/10 ${isActive ? "bg-white/10" : ""}`

  return (
    <aside className="hidden w-72 shrink-0 flex-col gap-2 lg:flex">
      <div className="space-y-5 rounded-lg bg-neutral-900 p-5">
        <Logo />
        <nav className="space-y-4">
          <NavLink to="/" end className={navClass}>
            <HomeIcon className="text-2xl" /> Home
          </NavLink>
          <NavLink to="/search" className={navClass}>
            <SearchIcon className="text-2xl" /> Search
          </NavLink>
        </nav>
      </div>

      <div className="flex min-h-0 flex-1 flex-col rounded-lg bg-neutral-900">
        <div className="flex items-center justify-between px-5 pb-2 pt-4">
          <NavLink to="/library" className={navClass}>
            <LibraryIcon className="text-2xl" /> Your Library
          </NavLink>
          <button
            aria-label="Create playlist"
            onClick={() => setCreating(true)}
            className="grid size-8 place-items-center rounded-full text-xl text-neutral-400 hover:bg-white/10 hover:text-white"
          >
            <PlusIcon />
          </button>
        </div>

        <div className="min-h-0 flex-1 space-y-1 overflow-y-auto px-2 pb-2">
          <NavLink to="/liked" className={itemClass}>
            <span className="grid size-12 shrink-0 place-items-center rounded bg-linear-to-br from-indigo-600 to-fuchsia-400 text-lg">
              <HeartFilledIcon />
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">Liked Songs</p>
              <p className="truncate text-xs text-neutral-400">Playlist · {songCount(likedSongs.length)}</p>
            </div>
          </NavLink>

          {playlists.map((p) => (
            <NavLink key={p._id} to={`/playlist/${p._id}`} className={itemClass}>
              {p.tracks.length ? (
                <PlaylistCover tracks={p.tracks} className="size-12 shrink-0 rounded" />
              ) : (
                <Cover className="size-12 shrink-0 rounded" />
              )}
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{p.name}</p>
                <p className="truncate text-xs text-neutral-400">Playlist · {songCount(p.tracks.length)}</p>
              </div>
            </NavLink>
          ))}
        </div>
      </div>

      <PlaylistFormModal
        open={creating}
        title="Create playlist"
        submitLabel="Create"
        onClose={() => setCreating(false)}
        onSubmit={handleCreate}
      />
    </aside>
  )
}
