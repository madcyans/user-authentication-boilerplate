import { useAuth } from "../contexts/AuthContext"
import { useNavigate } from "react-router-dom"

export default function Home() {
  const { username, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate("/login")
  }

  return (
    <div className="home-page">
      <h1>Welcome, {username}! You’re logged in!</h1>
      <button onClick={handleLogout}>Log Out</button>
    </div>
  )
}