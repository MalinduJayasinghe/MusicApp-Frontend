import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { register } from "../service/auth"
import { Button } from "../components/common/Button"
import { InputField } from "../components/forms/InputField"
import { Logo } from "../components/layout/Sidebar"
import { useToast } from "../hooks/useToast"
import { getErrorMessage } from "../util/error"

function Register() {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !email || !password) return setError("Please fill all fields")
    if (password.length < 6) return setError("Password must be at least 6 characters")

    setLoading(true)
    setError("")
    try {
      await register(name, email, password)
      showToast("Account created. You can log in now!")
      navigate("/login")
    } catch (err) {
      setError(getErrorMessage(err, "Registration failed"))
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-linear-to-b from-neutral-800 to-black px-4">
      <form
        onSubmit={handleRegister}
        className="flex w-full max-w-sm flex-col gap-5 rounded-2xl bg-neutral-900 p-8 shadow-2xl"
      >
        <div className="mb-2 flex flex-col items-center gap-3 text-center">
          <Logo />
          <h1 className="text-2xl font-black">Sign up to start listening</h1>
        </div>

        <InputField id="name" label="Name" placeholder="Your name" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} />
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
          placeholder="At least 6 characters"
          autoComplete="new-password"
          value={password}
          error={error}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button type="submit" isLoading={loading} className="mt-2 w-full">
          Sign Up
        </Button>

        <p className="mt-2 text-center text-xs text-neutral-400">
          Already have an account?{" "}
          <button type="button" onClick={() => navigate("/login")} className="font-bold text-white hover:underline">
            Log in
          </button>
        </p>
      </form>
    </div>
  )
}

export default Register
