import React, { type ReactNode } from "react"

interface PageHeaderProps {
  title: string
  description?: string
  children?: ReactNode // action buttons
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, description, children }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">{title}</h1>
        {description && <p className="text-sm text-neutral-400 mt-1">{description}</p>}
      </div>
      {children && <div className="flex items-center gap-2">{children}</div>}
    </div>
  )
}
