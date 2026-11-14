import React, { type ReactNode } from "react"
import { MusicNoteIcon } from "./Icons"

interface EmptyStateProps {
  title: string
  description?: string
  children?: ReactNode
}

export const EmptyState: React.FC<EmptyStateProps> = ({ title, description, children }) => {
  return (
    <div className="flex flex-col items-center text-center py-16 px-4">
      <div className="grid place-items-center size-16 rounded-full bg-neutral-800 text-neutral-400 text-3xl mb-4">
        <MusicNoteIcon />
      </div>
      <h2 className="text-lg font-bold">{title}</h2>
      {description && <p className="text-sm text-neutral-400 mt-1 max-w-sm">{description}</p>}
      {children && <div className="mt-5">{children}</div>}
    </div>
  )
}
