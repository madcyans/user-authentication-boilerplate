import { useEffect, useState } from "react"
import { db } from "../firebase"
import { collection, query, where, getDocs } from "firebase/firestore"
import { useAuth } from "../contexts/AuthContext"
import { useClickSound } from "../contexts/SoundContext"

export default function ProfileModal({ isOpen, onClose }) {
  const { user } = useAuth()
  const [stats, setStats] = useState(null)
  const [error, setError] = useState("")
  const playClick = useClickSound()

  useEffect(() => {
    if (!isOpen || !user) return
    let canceled = false
    setStats(null)
    setError("")
    async function fetchStats() {
      try {
        const q = query(
          collection(db, "scores"),
          where("uid", "==", user.uid)
        )
        const snap = await getDocs(q)
        let gamesPlayed = 0
        let bestScore = 0
        snap.forEach(doc => {
          gamesPlayed++
          const s = doc.data().score || 0
          if (s > bestScore) bestScore = s
        })
        if (!canceled) setStats({ gamesPlayed, bestScore })
      } catch (e) {
        if (!canceled) setError("Failed to load profile stats")
      }
    }
    fetchStats()
    return () => { canceled = true }
  }, [isOpen, user])

  const handleClose = () => {
    playClick()
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-yellow-900/90 border border-yellow-800 rounded-lg shadow-2xl w-80 p-6 space-y-4 text-yellow-100">
        <h2 className="text-xl font-bold mb-2">Profile</h2>
        <p><b>Username:</b> {user?.username}</p>
        <p><b>Email:</b> {user?.email}</p>
        {error && <p className="text-red-400">{error}</p>}
        {!error && !stats && <p>Loading stats…</p>}
        {!error && stats && (
          <>
            <p><b>Games Played:</b> {stats.gamesPlayed}</p>
            <p><b>Best Score:</b> {stats.bestScore}</p>
          </>
        )}
        <button
          className="mt-4 px-4 py-2 bg-yellow-700 rounded hover:bg-yellow-800"
          onClick={handleClose}
        >
          Close
        </button>
      </div>
    </div>
  )
}
