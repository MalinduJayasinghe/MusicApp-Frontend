export interface Track {
  videoId: string
  title: string
  artist: string
  thumbnail: string
  duration: number // seconds
}

export interface Playlist {
  _id: string
  name: string
  description: string
  tracks: Track[]
  createdAt: string
  updatedAt: string
}

export interface AuthUser {
  id: string
  name: string
  email: string
}
