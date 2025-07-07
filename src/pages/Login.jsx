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
    <div className="auth-page">
      <h2 className="text-2xl font-bold mb-2">
        Welcome Back, {username || "👤"}!
      </h2>
      <p className="mb-6 text-gray-600">Login to proceed</p>

      <form onSubmit={handleSubmit}>
        {error && <p className="error">{error}</p>}

        <label>Username</label>
        <input
          className="auth-input"
          type="text"
          placeholder="Enter your username"
          value={username}
          required
          onChange={e => setUsername(e.target.value)}
        />

        <label>Password</label>
        <input
          className="auth-input"
          type="password"
          placeholder="Enter your password"
          value={password}
          required
          onChange={e => setPassword(e.target.value)}
        />

        <button className="auth-button" type="submit">
          Log In
        </button>
      </form>

      <p className="mt-4 text-center">
        Don’t have an account?{" "}
        <Link to="/signup" className="link-btn">
          Sign Up
        </Link>
      </p>
    </div>
  )
}