import React from "react"
import { Link } from "react-router-dom"
import { PlaylistCover } from "./Cover"
import type { Playlist } from "../../types/music"

export const PlaylistCard: React.FC<{ playlist: Playlist }> = ({ playlist }) => (
  <Link
    to={`/playlist/${playlist._id}`}
    className="group flex flex-col rounded-lg bg-neutral-900 p-3 transition hover:bg-neutral-800"
  >
    <PlaylistCover tracks={playlist.tracks} className="mb-3 aspect-square w-full rounded-md shadow-lg" />
    <p className="line-clamp-1 text-sm font-bold">{playlist.name}</p>
    <p className="text-xs text-neutral-400">
      Playlist · {playlist.tracks.length} {playlist.tracks.length === 1 ? "song" : "songs"}
    </p>
  </Link>
)
