import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

export default function Signup() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async e => {
    e.preventDefault()
    await axios.post('http://localhost:4000/api/auth/signup', { email, password })
    navigate('/login')
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Sign Up</h2>
      <input type="email" placeholder="Email" onChange={e => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
      <button type="submit">Sign Up</button>
    </form>
  )
}