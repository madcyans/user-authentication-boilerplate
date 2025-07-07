import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import {
  createUserWithEmailAndPassword
} from "firebase/auth"
import { auth, db } from "../firebase"
import {
  doc,
  getDoc,
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

    // 1. Check for username uniqueness
    const q = query(
      collection(db, "users"),
      where("username", "==", username)
    )
    const snaps = await getDocs(q)
    if (!username.trim() || snaps.size > 0) {
      setError("Username is taken or invalid")
      return
    }

    try {
      const cred = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      )

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
    <div className="auth-page">
      <h2>Sign Up</h2>
      <p>Create your account</p>

      <form onSubmit={handleSubmit}>
        {error   && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}

        <label>Username</label>
        <input
          type="text"
          placeholder="Pick a unique username"
          value={username}
          required
          onChange={e => setUsername(e.target.value)}
        />

        <label>Email</label>
        <input
          type="email"
          placeholder="you@example.com"
          value={email}
          required
          onChange={e => setEmail(e.target.value)}
        />

        <label>Password</label>
        <input
          type="password"
          placeholder="Choose a password"
          value={password}
          required
          onChange={e => setPassword(e.target.value)}
        />

        <button type="submit">Sign Up</button>
      </form>

      <p className="redirect">
        Already have an account?{" "}
        <Link to="/login">Log In</Link>
      </p>
    </div>
  )
}