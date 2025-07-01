import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async e => {
    e.preventDefault()
    const res = await axios.post('http://localhost:4000/api/auth/login', { email, password })
    localStorage.setItem('token', res.data.token)
    navigate('/')
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Log In</h2>
      <input type="email" placeholder="Email" onChange={e => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
      <button type="submit">Log In</button>
    </form>
  )
}