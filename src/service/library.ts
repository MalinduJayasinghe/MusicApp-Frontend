import api from "./api"
import type { Track } from "../types/music"

export const getLikedSongs = async (): Promise<Track[]> => {
  const res = await api.get("/library/liked")
  return res.data.data
}

export const likeSong = async (track: Track) => {
  const res = await api.post("/library/liked", track)
  return res.data
}

export const unlikeSong = async (videoId: string) => {
  const res = await api.delete(`/library/liked/${videoId}`)
  return res.data
}

export const getRecentlyPlayed = async (): Promise<Track[]> => {
  const res = await api.get("/library/recent")
  return res.data.data
}

export const addRecentlyPlayed = async (track: Track) => {
  const res = await api.post("/library/recent", track)
  return res.data
}
