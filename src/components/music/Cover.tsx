import React, { useState } from "react"
import { MusicNoteIcon } from "../common/Icons"
import type { Track } from "../../types/music"

interface CoverProps {
  src?: string
  alt?: string
  className?: string
}

export const Cover: React.FC<CoverProps> = ({ src, alt = "", className = "" }) => {
  const [failedSrc, setFailedSrc] = useState<string | null>(null)

  if (!src || failedSrc === src) {
    return (
      <div className={`grid place-items-center bg-neutral-800 text-neutral-500 ${className}`}>
        <MusicNoteIcon className="size-1/2" />
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setFailedSrc(src)}
      className={`object-cover ${className}`}
    />
  )
}

export const PlaylistCover: React.FC<{ tracks: Track[]; className?: string }> = ({
  tracks,
  className = ""
}) => {
  if (tracks.length >= 4) {
    return (
      <div className={`grid grid-cols-2 grid-rows-2 overflow-hidden bg-neutral-800 ${className}`}>
        {tracks.slice(0, 4).map((t) => (
          <Cover key={t.videoId} src={t.thumbnail} className="size-full" />
        ))}
      </div>
    )
  }
  return <Cover src={tracks[0]?.thumbnail} className={className} />
}
