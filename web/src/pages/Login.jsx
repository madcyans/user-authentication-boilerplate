import { useState } from 'react'
import axios from 'axios'
import { useNavigate, Link } from 'react-router-dom'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  // Use VITE_API_URL or default to localhost for dev
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000'

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    try {
      const res = await axios.post(
        `${API_URL}/api/auth/login`, 
        { email, password }
      )
      localStorage.setItem('token', res.data.token)
      navigate('/home')
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed')
    }
  }

  return (
    <div className="auth-page">
      <h2>Log In</h2>
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
      <p>
        Don’t have an account? <Link to="/signup">Sign up here</Link>
      </p>
    </div>
  )
}