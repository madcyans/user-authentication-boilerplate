import { useState, useEffect, useRef, useCallback } from "react"
import { db } from "../firebase.js"
import { collection, getDocs } from "firebase/firestore"

// Utility: randomly shuffle an array
function shuffle(arr) {
  return arr
    .map(v => ({ v, r: Math.random() }))
    .sort((a, b) => a.r - b.r)
    .map(o => o.v)
}

// ✅ CHANGED: Accept third argument `quizKey`
export function useQuiz(onGameEnd, timerEnabled = true, quizKey = 0) {
  const [questions, setQuestions] = useState([])
  const [index,     setIndex]     = useState(0)
  const [score,     setScore]     = useState(0)
  const [wrong,     setWrong]     = useState(0)
  const [timeLeft,  setTimeLeft]  = useState(15)
  const timerRef = useRef()

  // ✅ NEW: Reset everything when quizKey changes
  useEffect(() => {
    setQuestions([])
    setIndex(0)
    setScore(0)
    setWrong(0)
    setTimeLeft(15)
  }, [quizKey])

  // ✅ CHANGED: Reload questions on quizKey
  useEffect(() => {
    async function load() {
      const snap = await getDocs(collection(db, "questions"))
      const all  = snap.docs.map(d => d.data())
      setQuestions(shuffle(all).slice(0, 10))
    }
    load()
  }, [quizKey])

  // Timer logic resets on each question
  useEffect(() => {
    if (!timerEnabled) return
    clearInterval(timerRef.current)
    setTimeLeft(15)
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current)
          handleAnswer(null) // timeout = wrong
          return 15
        }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(timerRef.current)
  }, [index, questions, timerEnabled])

  // Answer handler
  const handleAnswer = useCallback(choice => {
    clearInterval(timerRef.current)
    const q = questions[index]
    const correct = choice === q.answer

    if (correct) setScore(s => s + 1)
    else setWrong(w => w + 1)

    const nextWrong = wrong + (correct ? 0 : 1)
    const nextScore = score + (correct ? 1 : 0)

    if (nextWrong >= 3 || index + 1 >= questions.length) {
      onGameEnd({ score: nextScore, wrong: nextWrong })
    } else {
      setIndex(i => i + 1)
    }
  }, [index, questions, score, wrong, onGameEnd])

  return {
    loading: questions.length === 0,
    question: questions[index],
    index: index + 1,
    total: questions.length,
    score,
    wrong,
    timeLeft,
    handleAnswer
  }
}