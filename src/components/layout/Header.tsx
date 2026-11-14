import React from "react"
import { useAuth } from "../../hooks/useAuth"
import { Logo } from "./Sidebar"

export const Header: React.FC = () => {
  const { user } = useAuth()

  const handleLogout = () => {
    localStorage.removeItem("ACCESS_TOKEN")
    localStorage.removeItem("REFRESH_TOKEN")
    window.location.href = "/login"
  }

  return (
    <header className="sticky top-0 z-10 flex items-center justify-between bg-neutral-900/80 px-4 py-3 backdrop-blur-md sm:px-6">
      <div className="lg:hidden">
        <Logo />
      </div>
      <div className="ml-auto flex items-center gap-3">
        <span className="grid size-8 place-items-center rounded-full bg-brand text-sm font-extrabold text-black" title={user?.email}>
          {user?.name?.[0]?.toUpperCase() ?? "U"}
        </span>
        <span className="hidden text-sm font-semibold sm:block">{user?.name}</span>
        <button
          onClick={handleLogout}
          className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold text-neutral-200 transition hover:bg-white/20"
        >
          Log out
        </button>
      </div>
    </header>
  )
}
