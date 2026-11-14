import React, { useEffect, type ReactNode } from "react"
import { createPortal } from "react-dom"

interface ModalProps {
  open: boolean
  title: string
  onClose: () => void
  children: ReactNode
}

export const Modal: React.FC<ModalProps> = ({ open, title, onClose, children }) => {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose()
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [open, onClose])

  if (!open) return null

  // stopPropagation: a modal opened from a track row must not trigger the row's click
  return createPortal(
    <div
      className="fixed inset-0 z-[100] grid place-items-center bg-black/70 p-4"
      onClick={(e) => {
        e.stopPropagation()
        onClose()
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="w-full max-w-md rounded-xl bg-neutral-900 p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-extrabold mb-4">{title}</h2>
        {children}
      </div>
    </div>,
    document.body
  )
}
