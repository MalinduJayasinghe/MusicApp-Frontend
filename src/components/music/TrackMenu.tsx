import React, { useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { usePlayer } from "../../hooks/usePlayer"
import { useLibrary } from "../../hooks/useLibrary"
import { useToast } from "../../hooks/useToast"
import { getErrorMessage } from "../../util/error"
import { MoreIcon } from "../common/Icons"
import { PlaylistFormModal } from "./PlaylistFormModal"
import type { Track } from "../../types/music"

interface TrackMenuProps {
  track: Track
  onRemove?: () => void
  hideQueueActions?: boolean
}

const MENU_WIDTH = 224
const MENU_HEIGHT = 270

const itemClass = "block w-full rounded px-3 py-2 text-left text-sm text-neutral-200 hover:bg-white/10"


export const TrackMenu: React.FC<TrackMenuProps> = ({ track, onRemove, hideQueueActions }) => {
  const { addToQueue, playNext } = usePlayer()
  const { playlists, addToPlaylist, createPlaylist, isLiked, toggleLike } = useLibrary()
  const { showToast } = useToast()

  const buttonRef = useRef<HTMLButtonElement>(null)
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null)
  const [view, setView] = useState<"main" | "playlists">("main")
  const [creating, setCreating] = useState(false)

  const close = () => setPos(null)

  const open = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (pos) return close()

    const rect = buttonRef.current!.getBoundingClientRect()
    const top = rect.bottom + MENU_HEIGHT > window.innerHeight ? Math.max(8, rect.top - MENU_HEIGHT) : rect.bottom + 4
    const left = Math.min(window.innerWidth - MENU_WIDTH - 8, Math.max(8, rect.right - MENU_WIDTH))
    window.dispatchEvent(new CustomEvent("trackmenu:open", { detail: buttonRef.current }))
    setView("main")
    setPos({ top, left })
  }

  useEffect(() => {
    if (!pos) return
    const hide = () => setPos(null)
    const hideIfOther = (e: Event) => {
      if ((e as CustomEvent).detail !== buttonRef.current) setPos(null)
    }
    window.addEventListener("trackmenu:open", hideIfOther)
    document.addEventListener("click", hide)
    window.addEventListener("resize", hide)
    window.addEventListener("scroll", hide, true)
    return () => {
      window.removeEventListener("trackmenu:open", hideIfOther)
      document.removeEventListener("click", hide)
      window.removeEventListener("resize", hide)
      window.removeEventListener("scroll", hide, true)
    }
  }, [pos])

  const handleAddToPlaylist = async (playlistId: string, playlistName: string) => {
    close()
    try {
      await addToPlaylist(playlistId, track)
      showToast(`Added to ${playlistName}`)
    } catch (err) {
      showToast(getErrorMessage(err, "Could not add the song"), "error")
    }
  }

  const handleCreate = async (name: string, description: string) => {
    const playlist = await createPlaylist(name, description)
    await addToPlaylist(playlist._id, track)
    showToast(`Added to ${playlist.name}`)
  }

  const liked = isLiked(track.videoId)

  return (
      <>
        <button
            ref={buttonRef}
            aria-label="More options"
            aria-haspopup="menu"
            onClick={open}
            className="grid size-8 place-items-center rounded-full text-xl text-neutral-400 hover:text-white"
        >
          <MoreIcon />
        </button>

        {pos &&
            createPortal(
                <div
                    role="menu"
                    style={{ top: pos.top, left: pos.left, width: MENU_WIDTH }}
                    className="fixed z-[90] max-h-72 overflow-y-auto rounded-lg bg-neutral-800 p-1 shadow-2xl ring-1 ring-white/10"
                    onClick={(e) => e.stopPropagation()}
                >
                  {view === "main" ? (
                      <>
                        {!hideQueueActions && (
                            <>
                              <button className={itemClass} onClick={() => { playNext(track); showToast("Will play next"); close() }}>
                                Play next
                              </button>
                              <button className={itemClass} onClick={() => { addToQueue(track); showToast("Added to queue"); close() }}>
                                Add to queue
                              </button>
                            </>
                        )}
                        <button className={itemClass} onClick={() => { toggleLike(track); close() }}>
                          {liked ? "Remove from Liked Songs" : "Save to Liked Songs"}
                        </button>
                        <button className={itemClass} onClick={() => setView("playlists")}>
                          Add to playlist ›
                        </button>
                        {onRemove && (
                            <button className={`${itemClass} !text-rose-400`} onClick={() => { onRemove(); close() }}>
                              Remove from this playlist
                            </button>
                        )}
                      </>
                  ) : (
                      <>
                        <button className={`${itemClass} text-neutral-400`} onClick={() => setView("main")}>
                          ‹ Back
                        </button>
                        <button className={`${itemClass} font-semibold`} onClick={() => { close(); setCreating(true) }}>
                          + New playlist
                        </button>
                        {playlists.map((p) => (
                            <button key={p._id} className={`${itemClass} truncate`} onClick={() => handleAddToPlaylist(p._id, p.name)}>
                              {p.name}
                            </button>
                        ))}
                      </>
                  )}
                </div>,
                document.body
            )}

        <PlaylistFormModal
            open={creating}
            title="Create playlist"
            submitLabel="Create"
            onClose={() => setCreating(false)}
            onSubmit={handleCreate}
        />
      </>
  )
}