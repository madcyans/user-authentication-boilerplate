import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { createUserWithEmailAndPassword } from "firebase/auth"
import { auth, db } from "../firebase"
import { doc, setDoc, serverTimestamp } from "firebase/firestore"

export default function Signup() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const navigate = useNavigate()

  const handleSubmit = async e => {
    e.preventDefault()
    setError("")
    setSuccess("")

    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password)
      await setDoc(doc(db, "users", userCred.user.uid), {
        email,
        createdAt: serverTimestamp()
      })

      setSuccess("Account created! Redirecting to login…")
      // Delay so user sees the message
      setTimeout(() => navigate("/login"), 2000)
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="auth-page">
      <h2>Sign Up</h2>
      <p>Create your account to get started</p>

      <form onSubmit={handleSubmit}>
        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}

        <label>Email</label>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          required
          onChange={e => setEmail(e.target.value)}
        />

        <label>Password</label>
        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          required
          onChange={e => setPassword(e.target.value)}
        />

        <button type="submit">Sign Up</button>
      </form>

      <p className="redirect">
        Already have an account?{" "}
        <Link to="/login">
          <button type="button" className="link-btn">
            Log In
          </button>
        </Link>
      </p>
    </div>
  )
}