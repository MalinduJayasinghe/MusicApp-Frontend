import { createContext } from "react"
import type { AuthUser } from "../types/music"

export interface AuthContextValue {
    user: AuthUser | null
    setUser: (user: AuthUser | null) => void
    loading: boolean
}

export const AuthContext = createContext<AuthContextValue | null>(null)
