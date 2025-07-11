import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { signInWithEmailAndPassword } from "firebase/auth"
import { auth, db } from "../firebase"
import { collection, query, where, getDocs } from "firebase/firestore"
import { useAuth } from "../contexts/AuthContext"

export default function Login() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError]       = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()
  const { user } = useAuth()

  const handleSubmit = async e => {
    e.preventDefault()
    setError("")

    const usernameLower = username.trim().toLowerCase()

    const snaps = await getDocs(
      query(collection(db, "users"), where("username", "==", usernameLower))
    )
    if (snaps.empty) {
      setError("No user found")
      return
    }
    const { email } = snaps.docs[0].data()

    try {
      await signInWithEmailAndPassword(auth, email, password)
    } catch {
      setError("Invalid credentials")
    }
  }

  // Add this effect to navigate after user is loaded
  useEffect(() => {
    if (user) {
      navigate("/home")
    }
  }, [user])

  return (
    <div className="min-h-screen flex items-center justify-center
                    bg-[radial-gradient(circle_at_center,_#8b5e3c,_#3a2314)]
                    px-4">
      <div className="w-full max-w-md p-8 space-y-6
                      bg-yellow-900/80 backdrop-blur-sm
                      border border-yellow-800
                      rounded-2xl shadow-2xl text-yellow-100">
        <h2 className="text-2xl font-bold mb-2 text-center">
          Welcome to "The Ridiculous Quiz Game!"
        </h2>
        <p className="mb-6 text-center text-yellow-200">Login to proceed</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <p className="text-red-400 text-sm text-center">{error}</p>}

          <div>
            <label className="block mb-1 text-sm font-medium">Username</label>
            <input
              className="auth-input bg-yellow-100 text-yellow-900"
              type="text"
              placeholder="Enter your username"
              value={username}
              required
              onChange={e => setUsername(e.target.value)}
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">Password</label>
            <div className="relative">
              <input
                className="auth-input bg-yellow-100 text-yellow-900"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                required
                onChange={e => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-yellow-900"
                tabIndex={-1}
                onClick={() => setShowPassword(v => !v)}
              >
              </button>
            </div>
          </div>

          <button
            className="menu-button w-full"
            type="submit"
          >
            Log In
          </button>
        </form>

        <p className="mt-6 text-sm text-center text-yellow-200">
          Don’t have an account?{" "}
          <Link to="/signup" className="link-btn">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  )
}