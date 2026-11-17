import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { register } from "../service/auth"
import { Button } from "../components/common/Button"
import { InputField } from "../components/forms/InputField"
import { Logo } from "../components/layout/Sidebar"
import { useToast } from "../hooks/useToast"
import { getErrorMessage } from "../util/error"

const EYE =
    "M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"
const EYE_OFF =
    "M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"

// Eye button shown inside the password field (positioned over the input's right edge)
const PasswordToggle = ({ visible, onToggle }: { visible: boolean; onToggle: () => void }) => (
    <button
        type="button"
        onClick={onToggle}
        aria-label={visible ? "Hide password" : "Show password"}
        aria-pressed={visible}
        className="absolute right-2 top-[27px] grid size-8 place-items-center rounded-full text-xl text-neutral-400 transition hover:text-white"
    >
      <svg viewBox="0 0 24 24" fill="currentColor" width="1em" height="1em" aria-hidden="true">
        <path d={visible ? EYE_OFF : EYE} />
      </svg>
    </button>
)

function Register() {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
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
          <div className="relative">
            <InputField
                id="password"
                label="Password"
                type={showPassword ? "text" : "password"}
                placeholder="At least 6 characters"
                autoComplete="new-password"
                value={password}
                error={error}
                className="pr-11!"
                onChange={(e) => setPassword(e.target.value)}
            />
            <PasswordToggle visible={showPassword} onToggle={() => setShowPassword((v) => !v)} />
          </div>

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