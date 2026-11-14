import api from "./api"
import type { Playlist, Track } from "../types/music"

export const getMyPlaylists = async (): Promise<Playlist[]> => {
  const res = await api.get("/playlists")
  return res.data.data
}

export const getPlaylistById = async (id: string): Promise<Playlist> => {
  const res = await api.get(`/playlists/${id}`)
  return res.data
}

export const createPlaylist = async (
  name: string,
  description = ""
): Promise<Playlist> => {
  const res = await api.post("/playlists", { name, description })
  return res.data
}

export const updatePlaylist = async (
  id: string,
  name: string,
  description: string
): Promise<Playlist> => {
  const res = await api.patch(`/playlists/${id}`, { name, description })
  return res.data
}

export const deletePlaylist = async (id: string) => {
  const res = await api.delete(`/playlists/${id}`)
  return res.data
}

export const addTrackToPlaylist = async (
  id: string,
  track: Track
): Promise<Playlist> => {
  const res = await api.post(`/playlists/${id}/tracks`, track)
  return res.data
}

export const removeTrackFromPlaylist = async (
  id: string,
  videoId: string
): Promise<Playlist> => {
  const res = await api.delete(`/playlists/${id}/tracks/${videoId}`)
  return res.data
}
