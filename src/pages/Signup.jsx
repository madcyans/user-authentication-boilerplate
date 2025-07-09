import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { createUserWithEmailAndPassword } from "firebase/auth"
import { auth, db } from "../firebase"
import {
  doc,
  setDoc,
  serverTimestamp,
  query,
  where,
  collection,
  getDocs
} from "firebase/firestore"

export default function Signup() {
  const [username, setUsername] = useState("")
  const [email, setEmail]       = useState("")
  const [password, setPassword] = useState("")
  const [error, setError]       = useState("")
  const [success, setSuccess]   = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async e => {
    e.preventDefault()
    setError("")
    setSuccess("")

    const usernameLower = username.trim().toLowerCase()

    // 1. Check username uniqueness (case-insensitive)
    const snaps = await getDocs(
      query(collection(db, "users"), where("username", "==", usernameLower))
    )
    if (!usernameLower || usernameLower.includes(" ") || snaps.size > 0) {
      setError("Username is taken or invalid, or contains spaces")
      return
    }

    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password)
      await setDoc(doc(db, "users", cred.user.uid), {
        username: usernameLower, // store as lowercase
        email,
        createdAt: serverTimestamp()
      })
      setSuccess("Account created! Redirecting…")
      setTimeout(() => navigate("/login"), 2000)
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center
                    bg-[radial-gradient(circle_at_center,_#8b5e3c,_#3a2314)]
                    px-4">
      <div className="w-full max-w-md p-8 space-y-6
                      bg-yellow-900/80 backdrop-blur-sm
                      border border-yellow-800
                      rounded-2xl shadow-2xl text-yellow-100">
        <h2 className="text-2xl font-bold mb-2 text-center">
          Create an Account
        </h2>
        <p className="mb-6 text-center text-yellow-200">
          Sign up to get started
        </p>

        {error && <p className="text-red-400 text-sm text-center">{error}</p>}
        {success && <p className="text-green-400 text-sm text-center">{success}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 text-sm font-medium">Username</label>
            <input
              className="auth-input bg-yellow-100 text-yellow-900"
              type="text"
              placeholder="Pick a unique username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">Email</label>
            <input
              className="auth-input bg-yellow-100 text-yellow-900"
              type="email"
              placeholder="you@gmail.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">Password</label>
            <div className="relative">
              <input
                className="auth-input bg-yellow-100 text-yellow-900"
                type={showPassword ? "text" : "password"}
                placeholder="Input password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-yellow-900"
                tabIndex={-1}
                onClick={() => setShowPassword(v => !v)}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          <button className="menu-button w-full" type="submit">
            Sign Up
          </button>
        </form>

        <p className="mt-4 text-center text-yellow-200">
          Already have an account?{" "}
          <Link to="/login" className="link-btn">
            Log In
          </Link>
        </p>
      </div>
    </div>
  )
}