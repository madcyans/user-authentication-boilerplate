import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../firebase'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')

    try {
      await signInWithEmailAndPassword(auth, email, password)
      navigate('/home')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="auth-page">
      <h2>Welcome to Title Page!</h2>
      <p>Login to proceed</p>

      <form onSubmit={handleSubmit}>
        {error && <p className="error">{error}</p>}

        <label>Email</label>
        <input
          type="email"
          value={email}
          required
          onChange={e => setEmail(e.target.value)}
        />

        <label>Password</label>
        <input
          type="password"
          value={password}
          required
          onChange={e => setPassword(e.target.value)}
        />

        <button type="submit">Log In</button>
      </form>

      <p className="redirect">
        Don’t have an account?{' '}
        <Link to="/signup">
          <button className="signup-btn">Sign Up</button>
        </Link>
      </p>
    </div>
  )
}