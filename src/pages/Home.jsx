import React, { useRef, useState } from "react"
import { useAuth } from "../contexts/AuthContext.jsx"
import { useNavigate } from "react-router-dom"
import SettingsModal from "../components/SettingsModal"
import LeaderboardModal from "../components/LeaderboardModal"
import ProfileModal from "../components/ProfileModal"
import { useSettings } from "../contexts/SettingsContext"
import { useClickSound } from "../contexts/SoundContext"
import { useMusicPlayer } from "../hooks/useMusicPlayer"

export default function Home() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const audioRef = useRef(null)
  const playClick = useClickSound()

  const { settings, setSettings } = useSettings()

  const [showSettings, setShowSettings] = useState(false)
  const [showLeaderboard, setShowLeaderboard] = useState(false)
  const [showProfile, setShowProfile] = useState(false)

  // Use the custom hook to handle all music logic, including cleanup
  useMusicPlayer(audioRef)

  const handleLogout = async () => {
    playClick()
    await logout()
    navigate("/login")
  }

  // The old cleanup useEffect has been removed.

  return (
    <div className="min-h-screen flex items-center justify-center
                    bg-[radial-gradient(circle_at_center,_#8b5e3c,_#3a2314)]
                    px-4">
      <div className="relative w-full max-w-md p-6 space-y-6
                      bg-yellow-900/80 backdrop-blur-sm
                      border border-yellow-800
                      rounded-2xl shadow-2xl text-yellow-100">
        <h1 className="text-3xl text-center font-extrabold drop-shadow-lg whitespace-nowrap">
          <span style={{ display: "inline-block", transform: "scaleX(-1)" }}>
  🦆
</span>Ridiculous Quiz Game🦆
        </h1>
        <p className="text-lg text-center">
          Welcome, {user?.username || "Guest"}! Ready to test your wits?
        </p>

        <div className="flex flex-col gap-4">
          <button onClick={() => { playClick(); navigate("/play") }}       className="menu-button">
            Play Quiz
          </button>
          <button onClick={() => { playClick(); setShowLeaderboard(true) }} className="menu-button">
            Leaderboard
          </button>
          <button onClick={() => { playClick(); setShowProfile(true) }}     className="menu-button">
            Profile
          </button>
          <button onClick={() => { playClick(); setShowSettings(true) }}    className="menu-button">
            Settings
          </button>
        </div>

        <button onClick={handleLogout} className="logout-button">
          Log Out
        </button>
      </div>

      {/* Background music element */}
      <audio
        ref={audioRef}
        src="/home-music.mp3"
        loop
        autoPlay
        hidden
      />

      <SettingsModal
        isOpen={showSettings}
        initial={settings}
        onClose={updated => {
          playClick() // Play sound on modal close
          if (updated) setSettings(updated)
          setShowSettings(false)
        }}
      />

      <LeaderboardModal
        isOpen={showLeaderboard}
        onClose={() => {
          // The sound is handled inside the modal, just need to close it
          setShowLeaderboard(false)
        }}
      />

      <ProfileModal
        isOpen={showProfile}
        onClose={() => {
          // The sound is handled inside the modal, just need to close it
          setShowProfile(false)
        }}
      />
    </div>
  )
}
