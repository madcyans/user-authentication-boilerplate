import React, { useState } from "react"

export default function QuestionCard({ question, onAnswer, onExit }) {
  const [disabled, setDisabled] = useState(false)

  const pick = choice => {
    if (disabled) return
    setDisabled(true)
    onAnswer(choice)
    setTimeout(() => setDisabled(false), 300)
  }

  return (
    <div className="relative bg-yellow-900/90 border border-yellow-800 rounded-2xl shadow-xl p-6 space-y-6 text-yellow-100">
      {/* Exit button */}
      {onExit && (
        <button
          onClick={onExit}
          className="absolute top-4 right-4 px-3 py-1 bg-red-700 border border-red-600 rounded text-yellow-100 hover:bg-red-800 transition"
        >
          Exit
        </button>
      )}
      <p className="text-xl font-semibold mb-2">{question.text}</p>
      <div className="grid grid-cols-2 gap-4">
        {question.choices.map((c, i) => (
          <button
            key={i}
            onClick={() => pick(c)}
            disabled={disabled}
            className="py-3 px-2 rounded-lg font-semibold
                       bg-amber-700 border-2 border-amber-600
                       shadow-inner transition-transform transform
                       hover:scale-105 hover:bg-amber-600
                       text-yellow-100 disabled:opacity-60"
          >
            {c}
          </button>
        ))}
      </div>
    </div>
  )
}