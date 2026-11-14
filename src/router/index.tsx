import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"
import type { ReactNode } from "react"
import Register from "../pages/Register"
import Login from "../pages/Login"
import { Home } from "../pages/Home"
import { Search } from "../pages/Search"
import { Library } from "../pages/Library"
import { LikedSongs } from "../pages/LikedSongs"
import { PlaylistDetail } from "../pages/PlaylistDetail"
import { MainLayout } from "../components/layout/MainLayout"

const RequireAuth = ({ children }: { children: ReactNode }) => {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-black">
        <div className="flex gap-2">
          <div className="h-3 w-3 animate-bounce rounded-full bg-brand [animation-delay:-0.3s]"></div>
          <div className="h-3 w-3 animate-bounce rounded-full bg-brand [animation-delay:-0.15s]"></div>
          <div className="h-3 w-3 animate-bounce rounded-full bg-brand"></div>
        </div>
      </div>
    )
  }

  if (!user) return <Navigate to="/login" replace />

  return <>{children}</>
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route
          element={
            <RequireAuth>
              <MainLayout />
            </RequireAuth>
          }
        >
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/library" element={<Library />} />
          <Route path="/liked" element={<LikedSongs />} />
          <Route path="/playlist/:id" element={<PlaylistDetail />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
