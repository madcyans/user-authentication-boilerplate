import React, { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext.jsx"
import { useQuiz } from "../hooks/useQuiz.jsx"
import QuestionCard from "../components/QuestionCard.jsx"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"
import { db } from "../firebase.js"
import { useSettings } from "../contexts/SettingsContext"

export default function QuizPage() {
  const { user } = useAuth()
  const nav      = useNavigate()
  const [result, setResult] = useState(null)
  const [showExit, setShowExit] = useState(false)
  const audioRef = useRef(null)

  const { settings } = useSettings()

  // Start the quiz; onGameEnd → setResult
  const quiz = useQuiz(res => setResult(res), settings.timer)

  // Handle music playback and volume
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.volume = settings.volume / 100
    if (settings.music) {
      audio.play().catch(() => {})
    } else {
      audio.pause()
      audio.currentTime = 0
    }
  }, [settings.music, settings.volume])

  // Pause music when leaving QuizPage
  useEffect(() => {
    return () => {
      const audio = audioRef.current
      if (audio) {
        audio.pause()
        audio.currentTime = 0
      }
    }
  }, [])

  // When finished, save and go home
  useEffect(() => {
    if (!result) return
    async function save() {
      await addDoc(collection(db, "scores"), {
        uid:       user.uid,
        username:  user.username,
        score:     result.score,
        wrong:     result.wrong,
        createdAt: serverTimestamp()
      })
      setTimeout(() => nav("/home"), 2000)
    }
    save()
  }, [result])

  // Exit modal
  function ExitModal({ open, onCancel, onConfirm }) {
    if (!open) return null
    return (
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
        <div className="bg-yellow-900/90 border border-yellow-800 rounded-lg shadow-2xl w-80 p-6 space-y-4 text-yellow-100">
          <h2 className="text-xl font-bold">Exit Quiz?</h2>
          <p>Are you sure you want to exit? <br />All progress will be lost.</p>
          <div className="flex justify-end gap-3 mt-4">
            <button
              onClick={onCancel}
              className="px-4 py-2 bg-yellow-700 text-yellow-100 rounded hover:bg-yellow-800"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 bg-red-700 text-yellow-100 rounded hover:bg-red-800"
            >
              Exit
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (quiz.loading) return (
    <div className="min-h-screen flex items-center justify-center
                    bg-[radial-gradient(circle_at_center,_#8b5e3c,_#3a2314)]">
      <p className="text-yellow-100 text-lg">Loading quiz…</p>
    </div>
  )

  if (result) {
    return (
      <div className="min-h-screen flex items-center justify-center
                      bg-[radial-gradient(circle_at_center,_#8b5e3c,_#3a2314)]">
        <div className="text-center space-y-2
                        bg-yellow-900/80 backdrop-blur-sm
                        border border-yellow-800
                        rounded-2xl shadow-2xl p-8 text-yellow-100">
          <h2 className="text-2xl">Game Over</h2>
          <p>Score: {result.score}</p>
          <p>Wrong: {result.wrong}</p>
          <p>Returning home…</p>
        </div>
        {/* Quiz music */}
        <audio
          ref={audioRef}
          src="/quiz-music.mp3"
          loop
          autoPlay
          hidden
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center
                    bg-[radial-gradient(circle_at_center,_#8b5e3c,_#3a2314)] px-4">
      <div className="p-4 max-w-xl mx-auto space-y-4
                      bg-yellow-900/80 backdrop-blur-sm
                      border border-yellow-800
                      rounded-2xl shadow-2xl text-yellow-100 w-full relative">
        {/* Top bar: question/wrong/timer/exit */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex gap-4">
            <span className="font-semibold">Q {quiz.index}/{quiz.total}</span>
            <span className="font-semibold">❌ {quiz.wrong}/3</span>
          </div>
          <div className="flex items-center gap-4">
            {settings.timer && (
              <span className="font-semibold">⏱ {quiz.timeLeft}s</span>
            )}
            <button
              onClick={() => setShowExit(true)}
              className="px-3 py-1 bg-red-700 border border-red-600 rounded text-yellow-100 hover:bg-red-800 transition"
            >
              Exit
            </button>
          </div>
        </div>

        <QuestionCard
          question={quiz.question}
          onAnswer={quiz.handleAnswer}
        />

        <div className="text-lg text-right font-semibold">Score: {quiz.score}</div>
      </div>
      <ExitModal
        open={showExit}
        onCancel={() => setShowExit(false)}
        onConfirm={() => nav("/home")}
      />
      {/* Quiz music */}
      <audio
        ref={audioRef}
        src="/quiz-music.mp3"
        loop
        autoPlay
        hidden
      />
    </div>
  )
}