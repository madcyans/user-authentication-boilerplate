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
  const navigate = useNavigate()

  const handleSubmit = async e => {
    e.preventDefault()
    setError("")
    setSuccess("")

    // 1. Check username uniqueness
    const snaps = await getDocs(
      query(collection(db, "users"), where("username", "==", username))
    )
    if (!username.trim() || snaps.size > 0) {
      setError("Username is taken or invalid")
      return
    }

    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password)
      await setDoc(doc(db, "users", cred.user.uid), {
        username,
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-600 to-teal-600 px-4">
      <div className="w-full max-w-md bg-white rounded-xl p-8 shadow-xl">
        <h2 className="text-2xl font-bold mb-2 text-gray-800 text-center">
          Create an Account
        </h2>
        <p className="mb-6 text-gray-600 text-center">
          Sign up to get started
        </p>

        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}

        <form onSubmit={handleSubmit}>
          <label className="block text-gray-700 mb-1" htmlFor="username">
            Username
          </label>
          <input
            id="username"
            className="auth-input"
            type="text"
            placeholder="Pick a unique username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
          />

          <label className="block text-gray-700 mb-1" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            className="auth-input"
            type="email"
            placeholder="you@gmail.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />

          <label className="block text-gray-700 mb-1" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            className="auth-input"
            type="password"
            placeholder="Input password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />

          <button className="auth-button" type="submit">
            Sign Up
          </button>
        </form>

        <p className="mt-4 text-center">
          Already have an account?{" "}
          <Link to="/login" className="link-btn">
            Log In
          </Link>
        </p>
      </div>
    </div>
  )
}