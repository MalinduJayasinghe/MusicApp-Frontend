import React from "react"
import { Outlet } from "react-router-dom"
import LibraryProvider from "../../context/LibraryContext"
import PlayerProvider from "../../context/PlayerContext"
import { Header } from "./Header"
import { Sidebar } from "./Sidebar"
import { MobileNav } from "./MobileNav"
import { PlayerBar } from "../music/PlayerBar"
import { NowPlayingPanel } from "../music/NowPlayingPanel"

export const MainLayout: React.FC = () => {
  return (
      <LibraryProvider>
        <PlayerProvider>
          <div className="flex h-dvh flex-col bg-black text-white">
            <div className="flex min-h-0 flex-1 gap-2 overflow-hidden p-0 lg:p-2">
              <Sidebar />

              <main className="min-w-0 flex-1 overflow-y-auto bg-linear-to-b from-neutral-800/50 to-neutral-900 to-40% lg:rounded-lg">
                <Header />
                <div className="px-4 pb-8 pt-2 sm:px-6">
                  <Outlet />
                </div>
              </main>

              <NowPlayingPanel />
            </div>

            <PlayerBar />
            <MobileNav />
          </div>
        </PlayerProvider>
      </LibraryProvider>
  )
}