import React, { useState, useEffect } from "react"
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore"
import { db } from "../firebase"
import { useClickSound } from "../contexts/SoundContext" // Import the hook

export default function LeaderboardModal({ isOpen, onClose, top = 10 }) {
  const [scores, setScores] = useState([])
  const [loading, setLoading] = useState(true)
  const playClick = useClickSound() // Get the playClick function

  useEffect(() => {
    if (!isOpen) return
    const fetchScores = async () => {
      setLoading(true)
      try {
        const scoresRef = collection(db, "scores")
        const q = query(scoresRef, orderBy("score", "desc"), limit(top))
        const querySnapshot = await getDocs(q)
        const scoresData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        setScores(scoresData)
      } catch (error) {
        console.error("Error fetching scores:", error)
      }
      setLoading(false)
    }
    fetchScores()
  }, [isOpen, top])

  // Create a handler that plays the sound then closes
  const handleClose = () => {
    playClick()
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
         onClick={handleClose}> {/* Use the new handler */}
      <div className="bg-yellow-900/90 border-yellow-800 rounded-lg p-6 text-yellow-100 w-full max-w-md"
           onClick={e => e.stopPropagation()}>
        <h2 className="text-2xl font-bold mb-4 text-center">🏆 Leaderboard 🏆</h2>
        {loading ? (
          <p>Loading scores...</p>
        ) : (
          <ol className="space-y-2">
            {scores.map((score, index) => (
              <li key={score.id} className="flex justify-between items-center bg-yellow-800/50 p-2 rounded">
                <span className="font-semibold">{index + 1}. {score.username}</span>
                <span className="font-bold text-amber-400">{score.score} pts</span>
              </li>
            ))}
          </ol>
        )}
        <div className="flex justify-end mt-6">
          <button onClick={handleClose} className="px-4 py-2 bg-amber-600 text-yellow-100 rounded hover:bg-amber-500">
            Close
          </button> {/* Use the new handler */}
        </div>
      </div>
    </div>
  )
}
