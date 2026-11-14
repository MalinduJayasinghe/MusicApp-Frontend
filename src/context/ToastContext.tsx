import { useCallback, useMemo, useState, type ReactNode } from "react"
import { ToastContext, type ToastType } from "./toast-context"

interface Toast {
  id: number
  message: string
  type: ToastType
}

const COLORS: Record<ToastType, string> = {
  success: "bg-white text-black",
  error: "bg-rose-500 text-white",
  info: "bg-neutral-700 text-white"
}

let nextId = 1

const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([])

  const showToast = useCallback((message: string, type: ToastType = "success") => {
    const id = nextId++
    setToasts((prev) => [...prev, { id, message, type }])
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 3000)
  }, [])

  const value = useMemo(() => ({ showToast }), [showToast])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 bottom-36 z-[200] flex flex-col items-center gap-2 px-4 lg:bottom-28">
        {toasts.map((t) => (
          <div
            key={t.id}
            role="status"
            className={`pointer-events-auto rounded-full px-4 py-2 text-sm font-semibold shadow-lg ${COLORS[t.type]}`}
          >
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export default ToastProvider
