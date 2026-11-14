import { createContext } from "react"
import type { Playlist, Track } from "../types/music"

export interface LibraryContextValue {
  likedSongs: Track[]
  playlists: Playlist[]
  loading: boolean
  isLiked: (videoId: string) => boolean
  toggleLike: (track: Track) => Promise<void>
  refreshPlaylists: () => Promise<void>
  createPlaylist: (name: string, description?: string) => Promise<Playlist>
  deletePlaylist: (id: string) => Promise<void>
  addToPlaylist: (playlistId: string, track: Track) => Promise<void>
}

export const LibraryContext = createContext<LibraryContextValue | null>(null)
