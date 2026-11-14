import React, { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import * as playlistApi from "../service/playlist"
import { useLibrary } from "../hooks/useLibrary"
import { usePlayer } from "../hooks/usePlayer"
import { useToast } from "../hooks/useToast"
import { useAuth } from "../hooks/useAuth"
import { TrackRow } from "../components/music/TrackRow"
import { PlaylistCover } from "../components/music/Cover"
import { PlaylistFormModal } from "../components/music/PlaylistFormModal"
import { EmptyState } from "../components/common/EmptyState"
import { LoadingSpinner } from "../components/common/LoadingSpinner"
import { Button } from "../components/common/Button"
import { EditIcon, PlayIcon, ShuffleIcon, TrashIcon } from "../components/common/Icons"
import { getErrorMessage } from "../util/error"
import { formatTotal } from "../util/format"
import type { Playlist } from "../types/music"

interface LoadedPlaylist {
  id: string
  playlist: Playlist | null
}

export const PlaylistDetail: React.FC = () => {
  const { id = "" } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { refreshPlaylists, deletePlaylist } = useLibrary()
  const { playQueue, shufflePlay } = usePlayer()
  const { showToast } = useToast()

  const [loaded, setLoaded] = useState<LoadedPlaylist | null>(null)
  const [editing, setEditing] = useState(false)

  useEffect(() => {
    let cancelled = false
    playlistApi
      .getPlaylistById(id)
      .then((playlist) => !cancelled && setLoaded({ id, playlist }))
      .catch(() => !cancelled && setLoaded({ id, playlist: null }))
    return () => {
      cancelled = true
    }
  }, [id])

  const setPlaylist = (playlist: Playlist) => setLoaded({ id, playlist })

  if (!loaded || loaded.id !== id) return <LoadingSpinner />

  const playlist = loaded.playlist
  if (!playlist) {
    return (
      <EmptyState title="Playlist not found" description="It may have been deleted.">
        <Link to="/library">
          <Button variant="secondary">Back to your library</Button>
        </Link>
      </EmptyState>
    )
  }

  const total = playlist.tracks.reduce((sum, t) => sum + t.duration, 0)

  const handleRemove = async (videoId: string) => {
    try {
      setPlaylist(await playlistApi.removeTrackFromPlaylist(playlist._id, videoId))
      refreshPlaylists().catch(console.error)
      showToast("Removed from playlist")
    } catch (err) {
      showToast(getErrorMessage(err, "Could not remove the song"), "error")
    }
  }

  const handleEdit = async (name: string, description: string) => {
    setPlaylist(await playlistApi.updatePlaylist(playlist._id, name, description))
    refreshPlaylists().catch(console.error)
  }

  const handleDelete = async () => {
    if (!window.confirm(`Delete “${playlist.name}”?`)) return
    try {
      await deletePlaylist(playlist._id)
      showToast("Playlist deleted")
      navigate("/library", { replace: true })
    } catch (err) {
      showToast(getErrorMessage(err, "Could not delete the playlist"), "error")
    }
  }

  return (
    <div className="space-y-6">
      <div className="-mx-4 -mt-2 flex flex-col items-center gap-4 bg-linear-to-b from-emerald-700/50 to-transparent px-4 pb-6 pt-6 text-center sm:-mx-6 sm:flex-row sm:items-end sm:px-6 sm:text-left">
        <PlaylistCover tracks={playlist.tracks} className="size-40 shrink-0 rounded-lg shadow-2xl sm:size-52" />
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase">Playlist</p>
          <h1 className="line-clamp-2 text-4xl font-black sm:text-6xl">{playlist.name}</h1>
          {playlist.description && <p className="mt-2 text-sm text-neutral-300">{playlist.description}</p>}
          <p className="mt-2 text-sm text-neutral-300">
            <span className="font-bold text-white">{user?.name}</span> · {playlist.tracks.length}{" "}
            {playlist.tracks.length === 1 ? "song" : "songs"}
            {playlist.tracks.length > 0 && ` · ${formatTotal(total)}`}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          aria-label="Play playlist"
          disabled={playlist.tracks.length === 0}
          onClick={() => playQueue(playlist.tracks)}
          className="grid size-14 place-items-center rounded-full bg-brand text-3xl text-black transition hover:scale-105 disabled:opacity-40 disabled:hover:scale-100"
        >
          <PlayIcon />
        </button>
        <button
          aria-label="Shuffle play"
          disabled={playlist.tracks.length === 0}
          onClick={() => shufflePlay(playlist.tracks)}
          className="text-3xl text-neutral-400 transition hover:text-white disabled:opacity-40"
        >
          <ShuffleIcon />
        </button>
        <button
          aria-label="Edit details"
          onClick={() => setEditing(true)}
          className="ml-2 text-2xl text-neutral-400 transition hover:text-white"
        >
          <EditIcon />
        </button>
        <button
          aria-label="Delete playlist"
          onClick={handleDelete}
          className="text-2xl text-neutral-400 transition hover:text-rose-400"
        >
          <TrashIcon />
        </button>
      </div>

      {playlist.tracks.length === 0 ? (
        <EmptyState title="This playlist is empty" description="Search for songs and add them with the ⋯ menu.">
          <Link to="/search">
            <Button variant="secondary">Find songs</Button>
          </Link>
        </EmptyState>
      ) : (
        <div>
          {playlist.tracks.map((track, i) => (
            <TrackRow
              key={track.videoId}
              track={track}
              position={i + 1}
              onPlay={() => playQueue(playlist.tracks, i)}
              onRemove={() => handleRemove(track.videoId)}
            />
          ))}
        </div>
      )}

      <PlaylistFormModal
        open={editing}
        title="Edit details"
        submitLabel="Save"
        initialName={playlist.name}
        initialDescription={playlist.description}
        onClose={() => setEditing(false)}
        onSubmit={handleEdit}
      />
    </div>
  )
}
