import React, { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useLibrary } from "../hooks/useLibrary"
import { useToast } from "../hooks/useToast"
import { PageHeader } from "../components/common/PageHeader"
import { Button } from "../components/common/Button"
import { PlaylistCard } from "../components/music/PlaylistCard"
import { PlaylistFormModal } from "../components/music/PlaylistFormModal"
import { songCount } from "../util/format"
import { HeartFilledIcon, PlusIcon } from "../components/common/Icons"

export const Library: React.FC = () => {
  const { playlists, likedSongs, createPlaylist, loading } = useLibrary()
  const { showToast } = useToast()
  const navigate = useNavigate()
  const [creating, setCreating] = useState(false)

  const handleCreate = async (name: string, description: string) => {
    const playlist = await createPlaylist(name, description)
    showToast("Playlist created")
    navigate(`/playlist/${playlist._id}`)
  }

  return (
    <div className="space-y-6 pt-2">
      <PageHeader title="Your Library" description="Your liked songs and playlists">
        <Button onClick={() => setCreating(true)}>
          <PlusIcon className="mr-1 text-lg" /> New playlist
        </Button>
      </PageHeader>

      {loading ? (
        <p className="text-sm text-neutral-400">Loading…</p>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
          <Link
            to="/liked"
            className="flex flex-col justify-end gap-1 rounded-lg bg-linear-to-br from-indigo-600 to-fuchsia-400 p-4 transition hover:scale-[1.02] max-sm:aspect-square sm:aspect-square"
          >
            <HeartFilledIcon className="mb-auto text-3xl" />
            <p className="text-lg font-extrabold">Liked Songs</p>
            <p className="text-xs text-white/80">{songCount(likedSongs.length)}</p>
          </Link>
          {playlists.map((p) => (
            <PlaylistCard key={p._id} playlist={p} />
          ))}
        </div>
      )}

      <PlaylistFormModal
        open={creating}
        title="Create playlist"
        submitLabel="Create"
        onClose={() => setCreating(false)}
        onSubmit={handleCreate}
      />
    </div>
  )
}
