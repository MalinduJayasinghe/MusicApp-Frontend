import { useEffect, useState, type ReactNode } from "react"
import { AuthContext } from "./auth-context"
import { getMyDetails } from "../service/auth"
import type { AuthUser } from "../types/music"

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(() => !!localStorage.getItem("ACCESS_TOKEN"))

  useEffect(() => {
    if (!localStorage.getItem("ACCESS_TOKEN")) return

    getMyDetails()
      .then((res) => setUser(res.data ?? null))
      .catch((err) => {
        console.error(err)
        setUser(null)
      })
      .finally(() => setLoading(false))
  }, [])

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider
