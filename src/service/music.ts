import api from "./api"
import type { Track } from "../types/music"

export interface SearchResponse {
  data: Track[]
  meta: { nextPageToken: string | null }
}

export const searchMusic = async (
  query: string,
  pageToken?: string
): Promise<SearchResponse> => {
  const res = await api.get("/music/search", {
    params: { q: query, pageToken }
  })
  return res.data
}

export const getTrending = async (): Promise<Track[]> => {
  const res = await api.get("/music/trending")
  return res.data.data
}
