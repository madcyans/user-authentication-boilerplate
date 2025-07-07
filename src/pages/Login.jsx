import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { signInWithEmailAndPassword } from "firebase/auth"
import {
  auth,
  db
} from "../firebase"
import {
  collection,
  query,
  where,
  getDocs
} from "firebase/firestore"

export default function Login() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError]       = useState("")
  const navigate = useNavigate()

  const handleSubmit = async e => {
    e.preventDefault()
    setError("")

    // 1. Query for user doc by username
    const q = query(
      collection(db, "users"),
      where("username", "==", username)
    )
    const snaps = await getDocs(q)
    if (snaps.empty) {
      setError("No user found")
      return
    }
    const { email } = snaps.docs[0].data()

    try {
      await signInWithEmailAndPassword(auth, email, password)
      navigate("/home")
    } catch (err) {
      setError("Invalid credentials")
    }
  }

  return (
    <div className="auth-page">
      <h2>Welcome Back, {username || "👤"}!</h2>
      <p>Login to proceed</p>

      <form onSubmit={handleSubmit}>
        {error && <p className="error">{error}</p>}

        <label>Username</label>
        <input
          type="text"
          placeholder="Enter your username"
          value={username}
          required
          onChange={e => setUsername(e.target.value)}
        />

        <label>Password</label>
        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          required
          onChange={e => setPassword(e.target.value)}
        />

        <button type="submit">Log In</button>
      </form>

      <p className="redirect">
        Don’t have an account? <Link to="/signup">Sign Up</Link>
      </p>
    </div>
  )
}