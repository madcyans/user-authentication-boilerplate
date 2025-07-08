import React, { useState, useEffect } from "react"
import { useAuth } from "../contexts/AuthContext"
import { db } from "../firebase"
import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  limit
} from "firebase/firestore"

export default function ProfileModal({ isOpen, onClose }) {
  const { user } = useAuth()
  const [stats, setStats]   = useState({ gamesPlayed: 0, bestScore: 0 })
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState("")

  // Always call hooks in the same order:
  useEffect(() => {
    // Bail out early inside the effect:
    if (!isOpen || !user) return
    let canceled = false
    setLoading(true)
    setError("")

    ;(async () => {
      try {
        const playedSnap = await getDocs(
          query(collection(db, "scores"), where("uid", "==", user.uid))
        )
        const bestSnap = await getDocs(
          query(
            collection(db, "scores"),
            where("uid", "==", user.uid),
            orderBy("score", "desc"),
            limit(1)
          )
        )
        if (!canceled) {
          setStats({
            gamesPlayed: playedSnap.size,
            bestScore:   bestSnap.docs[0]?.data().score ?? 0
          })
        }
      } catch {
        if (!canceled) setError("Failed to load profile stats")
      } finally {
        if (!canceled) setLoading(false)
      }
    })()

    return () => {
      canceled = true
    }
  }, [isOpen, user])

  // Now you can early‐return the JSX when closed or no user
  if (!isOpen || !user) return null

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-yellow-900/90 border border-yellow-800
                   rounded-lg shadow-2xl w-80 p-6 space-y-4
                   text-yellow-100"
        onClick={e => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold">👤 Profile</h2>
        <p><strong>Username:</strong> {user.username}</p>
        <p><strong>Email:</strong>    {user.email}</p>

        {loading && <p>Loading stats…</p>}
        {error   && <p className="text-red-400">{error}</p>}

        {!loading && !error && (
          <>
            <p><strong>Games Played:</strong> {stats.gamesPlayed}</p>
            <p><strong>Best Score:</strong>   {stats.bestScore}</p>
          </>
        )}

        <div className="mt-4 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-amber-600 text-yellow-100 rounded hover:bg-amber-500"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}