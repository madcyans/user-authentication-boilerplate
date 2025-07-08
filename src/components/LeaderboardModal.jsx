import React, { useState, useEffect } from "react"
import { db } from "../firebase"
import {
  collection,
  query,
  orderBy,
  limit,
  getDocs
} from "firebase/firestore"

export default function LeaderboardModal({ isOpen, onClose, top = 10 }) {
  const [scores, setScores] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!isOpen) return
    setLoading(true)
    ;(async () => {
      try {
        const q = query(
          collection(db, "scores"),
          orderBy("score", "desc"),
          limit(top)
        )
        const snap = await getDocs(q)
        setScores(
          snap.docs.map(d => ({
            id: d.id,
            username: d.data().username,
            score: d.data().score
          }))
        )
      } catch {
        setError("Failed to load leaderboard")
      } finally {
        setLoading(false)
      }
    })()
  }, [isOpen, top])

  if (!isOpen) return null
  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-yellow-900/90 border border-yellow-800
                   rounded-lg shadow-2xl w-80 max-h-[80vh] p-6
                   overflow-y-auto text-yellow-100"
        onClick={e => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold mb-4">🏆 Leaderboard</h2>

        {loading && <p>Loading...</p>}
        {error && <p className="text-red-400">{error}</p>}

        {!loading && !error && (
          <ol className="list-decimal list-inside space-y-2">
            {scores.length > 0
              ? scores.map(entry => (
                  <li key={entry.id} className="flex justify-between">
                    <span>{entry.username}</span>
                    <span className="font-semibold">{entry.score}</span>
                  </li>
                ))
              : <p>No scores yet.</p>}
          </ol>
        )}

        <div className="mt-6 text-right">
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