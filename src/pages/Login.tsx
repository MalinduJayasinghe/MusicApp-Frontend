import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { login } from "../service/auth"
import { Button } from "../components/common/Button"
import { InputField } from "../components/forms/InputField"
import { Logo } from "../components/layout/Sidebar"
import { getErrorMessage } from "../util/error"

function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) return setError("Please fill all fields")

    setLoading(true)
    setError("")
    try {
      const res = await login(email, password)
      const { access_token, refresh_token } = res.data

      if (!access_token || !refresh_token) throw new Error("Tokens missing")

      localStorage.setItem("ACCESS_TOKEN", access_token)
      localStorage.setItem("REFRESH_TOKEN", refresh_token)

      window.location.href = "/"
    } catch (err) {
      setError(getErrorMessage(err, "Login failed"))
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-linear-to-b from-neutral-800 to-black px-4">
      <form
        onSubmit={handleLogin}
        className="flex w-full max-w-sm flex-col gap-5 rounded-2xl bg-neutral-900 p-8 shadow-2xl"
      >
        <div className="mb-2 flex flex-col items-center gap-3 text-center">
          <Logo />
          <h1 className="text-2xl font-black">Log in to continue</h1>
        </div>

        <InputField
          id="email"
          label="Email"
          type="email"
          placeholder="name@example.com"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <InputField
          id="password"
          label="Password"
          type="password"
          placeholder="Password"
          autoComplete="current-password"
          value={password}
          error={error}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button type="submit" isLoading={loading} className="mt-2 w-full">
          Log In
        </Button>

        <p className="mt-2 text-center text-xs text-neutral-400">
          Don&rsquo;t have an account?{" "}
          <button type="button" onClick={() => navigate("/register")} className="font-bold text-white hover:underline">
            Sign up for Wavely
          </button>
        </p>
      </form>
    </div>
  )
}

export default Login
