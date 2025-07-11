import React, { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext.jsx"
import { useQuiz } from "../hooks/useQuiz.jsx"
import QuestionCard from "../components/QuestionCard.jsx"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"
import { db } from "../firebase.js"
import { useSettings } from "../contexts/SettingsContext"
import { useClickSound } from "../contexts/SoundContext"
import { useMusicPlayer } from "../hooks/useMusicPlayer"

export default function QuizPage() {
  const { user }      = useAuth()
  const nav           = useNavigate()
  const { settings }  = useSettings()

  const [result, setResult]             = useState(null)
  const [showExit, setShowExit]         = useState(false)
  const [showGameOver, setShowGameOver] = useState(false)
  const [quizKey, setQuizKey]           = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)

  // Audio refs
  const audioRef         = useRef(null)
  const gameEndRef       = useRef(null)
  const gameOverRef      = useRef(null)
  const playClick        = useClickSound()

  // Use the custom hook to handle all music logic, including cleanup
  useMusicPlayer(audioRef)

  // Quiz hook – only setResult on natural finish
  const quiz = useQuiz(res => {
    if (res.wrong < 3) setResult(res)
  }, settings.timer, quizKey)

  // Wrap answer to trigger transition, delay, sfx
  function onAnswer(choice) {
    if (isTransitioning) return
    playClick()
    setIsTransitioning(true)
    setTimeout(() => {
      quiz.handleAnswer(choice)
      setIsTransitioning(false)
    }, 300)
  }

  // Retry & return home
  function handleRetry() {
    playClick()
    setQuizKey(k => k + 1)
    setShowGameOver(false)
    setResult(null)
    audioRef.current?.play().catch(()=>{}) // Attempt to restart music
  }
  function handleReturnHome() {
    playClick()
    nav("/home")
  }

  // Game Over State Trigger
  useEffect(() => {
    if (quiz.wrong === 3 && !result) {
      setShowGameOver(true)
    }
  }, [quiz.wrong, result])

  // Game Over Sound Effect Trigger
  useEffect(() => {
    if (showGameOver) {
      const s = gameOverRef.current
      if (s && settings.soundFX) {
        s.volume = settings.sfxVolume / 100
        s.play().catch(() => {})
      }
    }
  }, [showGameOver, settings.soundFX, settings.sfxVolume])

  // Game End sound & save score
  useEffect(() => {
    if (!result || quiz.wrong === 3 || !user) {
      return
    }

    // Play sound effect
    const s = gameEndRef.current
    if (s && settings.soundFX) {
      s.volume = settings.sfxVolume/100
      s.play().catch(() => {})
    }

    // Save score to Firestore
    addDoc(collection(db, "scores"), {
      uid:       user.uid,
      username:  user.username || user.email,
      score:     result.score,
      wrong:     result.wrong,
      createdAt: serverTimestamp()
    })
  }, [result, quiz.wrong, settings, user])

  // Exit confirmation Modal Component
  function ExitModal({ open, onCancel, onConfirm }) {
    if (!open) return null
    return (
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
        <div className="bg-yellow-900/90 border-yellow-800 rounded-lg p-6 text-yellow-100">
          <h2 className="text-xl font-bold">Exit Quiz?</h2>
          <p>All progress will be lost.</p>
          <div className="flex justify-end gap-3 mt-4">
            <button onClick={() => { playClick(); onCancel() }}
                    className="px-4 py-2 bg-yellow-700 rounded">Cancel</button>
            <button onClick={() => { playClick(); onConfirm() }}
                    className="px-4 py-2 bg-red-700 rounded">Exit</button>
          </div>
        </div>
      </div>
    )
  }

  // Loading screen
  if (quiz.loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-800">
        <p className="text-yellow-100">Loading quiz…</p>
      </div>
    )
  }

  // Unified end-screen
  if (result || showGameOver) {
    const isGameOver = quiz.wrong === 3
    return (
      <div className={`min-h-screen flex items-center justify-center
                       ${isGameOver ? "bg-red-900" : "bg-green-900"}`}>
        <div className="text-center p-8 rounded-xl bg-black/50 text-white space-y-4">
          <h2 className="text-3xl font-bold animate-pulse">
            {isGameOver ? "💀 Game Over" : "🎉 Game End"}
          </h2>
          <p>Score: {quiz.score} | Wrong: {quiz.wrong}</p>
          <div className="flex gap-4 justify-center">
            <button onClick={handleRetry}      className="px-4 py-2 bg-blue-700 rounded">Play Again</button>
            <button onClick={handleReturnHome} className="px-4 py-2 bg-gray-700 rounded">Return Home</button>
          </div>
        </div>
        <audio ref={gameEndRef}  src="/game-end.mp3"  hidden />
        <audio ref={gameOverRef} src="/game-over.mp3" hidden />
      </div>
    )
  }

  // Main quiz UI
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-800 px-4">
      <div className="w-full max-w-xl bg-black/50 p-6 rounded-xl text-yellow-100 space-y-4">
        <div className="flex justify-between">
          <span>Q {quiz.index}/{quiz.total}</span>
          <span>❌ {quiz.wrong}/3</span>
        </div>

        <div
          className={`transition-opacity duration-300 ${isTransitioning ? "opacity-0" : "opacity-100"}`}>
          <QuestionCard question={quiz.question} onAnswer={onAnswer} />
        </div>

        <div className="text-right">Score: {quiz.score}</div>
        <button onClick={() => { playClick(); setShowExit(true) }}
                className="text-red-500 underline">Exit</button>
      </div>

      <ExitModal open={showExit}
                 onCancel={() => setShowExit(false)}
                 onConfirm={handleReturnHome} />

      {/* Background & sfx */}
      <audio ref={audioRef}    src="/quiz-music.mp3" loop autoPlay hidden />
      <audio ref={gameEndRef}  src="/game-end.mp3"  hidden />
      <audio ref={gameOverRef} src="/game-over.mp3" hidden />
    </div>
  )
}
