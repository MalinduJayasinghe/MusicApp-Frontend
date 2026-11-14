import React from "react"
import { NavLink } from "react-router-dom"
import { HomeIcon, LibraryIcon, SearchIcon } from "../common/Icons"

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `flex flex-1 flex-col items-center gap-0.5 py-2 text-[11px] font-semibold ${isActive ? "text-white" : "text-neutral-400"}`

export const MobileNav: React.FC = () => (
  <nav className="flex shrink-0 border-t border-white/10 bg-black pb-[env(safe-area-inset-bottom)] lg:hidden">
    <NavLink to="/" end className={linkClass}>
      <HomeIcon className="text-2xl" /> Home
    </NavLink>
    <NavLink to="/search" className={linkClass}>
      <SearchIcon className="text-2xl" /> Search
    </NavLink>
    <NavLink to="/library" className={linkClass}>
      <LibraryIcon className="text-2xl" /> Library
    </NavLink>
  </nav>
)
