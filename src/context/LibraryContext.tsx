import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react"
import { LibraryContext } from "./library-context"
import * as libraryApi from "../service/library"
import * as playlistApi from "../service/playlist"
import { useToast } from "../hooks/useToast"
import { getErrorMessage } from "../util/error"
import type { Playlist, Track } from "../types/music"

const LibraryProvider = ({ children }: { children: ReactNode }) => {
  const { showToast } = useToast()
  const [likedSongs, setLikedSongs] = useState<Track[]>([])
  const [playlists, setPlaylists] = useState<Playlist[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([libraryApi.getLikedSongs(), playlistApi.getMyPlaylists()])
      .then(([liked, lists]) => {
        setLikedSongs(liked)
        setPlaylists(lists)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const isLiked = useCallback(
    (videoId: string) => likedSongs.some((t) => t.videoId === videoId),
    [likedSongs]
  )

  // Optimistic update: change the UI first, undo if the request fails.
  const toggleLike = useCallback(
    async (track: Track) => {
      const alreadyLiked = likedSongs.some((t) => t.videoId === track.videoId)
      const previous = likedSongs

      setLikedSongs(
        alreadyLiked
          ? likedSongs.filter((t) => t.videoId !== track.videoId)
          : [track, ...likedSongs]
      )

      try {
        if (alreadyLiked) await libraryApi.unlikeSong(track.videoId)
        else await libraryApi.likeSong(track)
        showToast(alreadyLiked ? "Removed from Liked Songs" : "Added to Liked Songs")
      } catch (err) {
        setLikedSongs(previous)
        showToast(getErrorMessage(err, "Could not update liked songs"), "error")
      }
    },
    [likedSongs, showToast]
  )

  const refreshPlaylists = useCallback(async () => {
    setPlaylists(await playlistApi.getMyPlaylists())
  }, [])

  const createPlaylist = useCallback(async (name: string, description = "") => {
    const playlist = await playlistApi.createPlaylist(name, description)
    setPlaylists((prev) => [playlist, ...prev])
    return playlist
  }, [])

  const deletePlaylist = useCallback(async (id: string) => {
    await playlistApi.deletePlaylist(id)
    setPlaylists((prev) => prev.filter((p) => p._id !== id))
  }, [])

  const addToPlaylist = useCallback(
    async (playlistId: string, track: Track) => {
      const updated = await playlistApi.addTrackToPlaylist(playlistId, track)
      setPlaylists((prev) => prev.map((p) => (p._id === playlistId ? updated : p)))
    },
    []
  )

  const value = useMemo(
    () => ({
      likedSongs,
      playlists,
      loading,
      isLiked,
      toggleLike,
      refreshPlaylists,
      createPlaylist,
      deletePlaylist,
      addToPlaylist
    }),
    [likedSongs, playlists, loading, isLiked, toggleLike, refreshPlaylists, createPlaylist, deletePlaylist, addToPlaylist]
  )

  return <LibraryContext.Provider value={value}>{children}</LibraryContext.Provider>
}

export default LibraryProvider
