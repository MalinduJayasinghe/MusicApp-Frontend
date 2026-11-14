import axios from "axios"

// Pulls the "message" our API sends back, or falls back to a default text.
export const getErrorMessage = (err: unknown, fallback: string): string => {
  if (axios.isAxiosError(err)) {
    return err.response?.data?.message || fallback
  }
  return fallback
}
