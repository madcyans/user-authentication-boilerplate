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
    <div className="auth-page text-center">
      <h1 className="text-3xl font-bold mb-6">
        Welcome, {username}! You’re logged in!
      </h1>
      <button className="auth-button max-w-xs mx-auto" onClick={handleLogout}>
        Log Out
      </button>
    </div>
  )
}