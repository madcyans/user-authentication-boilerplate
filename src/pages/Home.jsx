import React, { useState } from "react"
import { useAuth } from "../contexts/AuthContext.jsx"
import { useNavigate } from "react-router-dom"
import SettingsModal from "../components/SettingsModal"
import LeaderboardModal from "../components/LeaderboardModal"
import ProfileModal from "../components/ProfileModal"   // ← don’t forget this

export default function Home() {
  const { user, logout } = useAuth()     // ← grab `user` here
  const navigate          = useNavigate()

  const [showSettings, setShowSettings]   = useState(false)
  const [showLeaderboard, setShowLeaderboard] = useState(false)
  const [showProfile, setShowProfile]     = useState(false)

  const handleLogout = async () => {
    await logout()
    navigate("/login")
  }

  return (
    <div className="min-h-screen flex items-center justify-center
                    bg-[radial-gradient(circle_at_center,_#8b5e3c,_#3a2314)]
                    px-4">
      <div className="relative w-full max-w-md p-8 space-y-6
                      bg-yellow-900/80 backdrop-blur-sm
                      border border-yellow-800
                      rounded-2xl shadow-2xl text-yellow-100">
        <h1 className="text-3xl font-extrabold drop-shadow-lg">
          🌲 QuizMaster 3000 🌿
        </h1>
        <p className="text-lg">
          Welcome, {user?.username || "Guest"}! Ready to test your wits?
        </p>

        <div className="flex flex-col gap-4">
          <button onClick={() => navigate("/play")}       className="menu-button">
            Play Quiz
          </button>
          <button onClick={() => setShowLeaderboard(true)} className="menu-button">
            Leaderboard
          </button>
          <button onClick={() => setShowProfile(true)}     className="menu-button">
            Profile
          </button>
          <button onClick={() => setShowSettings(true)}    className="menu-button">
            Settings
          </button>
        </div>

        <button onClick={handleLogout} className="logout-button">
          Log Out
        </button>
      </div>

      <SettingsModal
        isOpen={showSettings}
        initial={{ volume:50, soundFX:true, music:true, difficulty:"medium", timer:true }}
        onClose={updated => setShowSettings(false)}
      />

      <LeaderboardModal
        isOpen={showLeaderboard}
        onClose={() => setShowLeaderboard(false)}
        top={10}
      />

      <ProfileModal
        isOpen={showProfile}
        onClose={() => setShowProfile(false)}
      />
    </div>
  )
}