import AuthProvider from "./context/AuthContext"
import ToastProvider from "./context/ToastContext"
import Router from "./router"

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <Router />
      </AuthProvider>
    </ToastProvider>
  )
}

export default App
