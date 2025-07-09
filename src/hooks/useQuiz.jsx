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

export function useQuiz(onGameEnd, timerEnabled = true) {
  const [questions, setQuestions] = useState([])
  const [index,     setIndex]     = useState(0)
  const [score,     setScore]     = useState(0)
  const [wrong,     setWrong]     = useState(0)
  const [timeLeft,  setTimeLeft]  = useState(10)
  const timerRef = useRef()

  // 1) Load & pick 10 random questions
  useEffect(() => {
    async function load() {
      const snap = await getDocs(collection(db, "questions"))
      const all  = snap.docs.map(d => d.data())
      setQuestions(shuffle(all).slice(0, 10))
    }
    load()
  }, [])

  // 2) Start/reset 10s timer on each question
  useEffect(() => {
    if (!timerEnabled) return // <--- skip timer if disabled
    clearInterval(timerRef.current)
    setTimeLeft(15)
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current)
          handleAnswer(null)    // timeout counts as wrong
          return 15
        }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(timerRef.current)
  }, [index, questions, timerEnabled])

  // 3) Handle selecting an answer
  const handleAnswer = useCallback(choice => {
    clearInterval(timerRef.current)
    const q = questions[index]
    const correct = choice === q.answer

    if (correct) setScore(s => s + 1)
    else setWrong(w => w + 1)

    // Check for game end (3 wrong or 10 questions)
    if (wrong + (correct ? 0 : 1) >= 3 || index + 1 >= questions.length) {
      onGameEnd({ score: score + (correct ? 1 : 0), wrong: wrong + (correct ? 0 : 1) })
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