import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { signInWithEmailAndPassword } from "firebase/auth"
import { auth, db } from "../firebase"
import { collection, query, where, getDocs } from "firebase/firestore"

export default function Login() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError]       = useState("")
  const navigate = useNavigate()

  const handleSubmit = async e => {
    e.preventDefault()
    setError("")

    const snaps = await getDocs(
      query(collection(db, "users"), where("username", "==", username))
    )
    if (snaps.empty) {
      setError("No user found")
      return
    }
    const { email } = snaps.docs[0].data()

    try {
      await signInWithEmailAndPassword(auth, email, password)
      navigate("/home")
    } catch {
      setError("Invalid credentials")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 to-purple-600 px-4">
      <div className="w-full max-w-md bg-white rounded-xl p-8 shadow-xl">
        <h2 className="text-2xl font-bold mb-2 text-gray-800 text-center">
          Welcome to "Page Title"!
        </h2>
        <p className="mb-6 text-gray-500 text-center">Login to proceed</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Username</label>
            <input
              className="auth-input"
              type="text"
              placeholder="Enter your username"
              value={username}
              required
              onChange={e => setUsername(e.target.value)}
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Password</label>
            <input
              className="auth-input"
              type="password"
              placeholder="Enter your password"
              value={password}
              required
              onChange={e => setPassword(e.target.value)}
            />
          </div>

          <button
            className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-md transition"
            type="submit"
          >
            Log In
          </button>
        </form>

        <p className="mt-6 text-sm text-center text-gray-600">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-indigo-600 hover:underline font-medium">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  )
}