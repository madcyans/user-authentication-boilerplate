import React, { useState, useEffect } from "react"

export default function SettingsModal({ isOpen, onClose, initial }) {
  const [volume, setVolume] = useState(initial.volume)
  const [soundFX, setSoundFX] = useState(initial.soundFX)
  const [music, setMusic] = useState(initial.music)
  const [difficulty, setDifficulty] = useState(initial.difficulty)
  const [timer, setTimer] = useState(initial.timer)

  useEffect(() => {
    setVolume(initial.volume)
    setSoundFX(initial.soundFX)
    setMusic(initial.music)
    setDifficulty(initial.difficulty)
    setTimer(initial.timer)
  }, [initial])

  const handleSave = () => onClose({ volume, soundFX, music, difficulty, timer })
  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
      onClick={() => onClose()}
    >
      <div
        className="bg-yellow-900/90 border border-yellow-800
                   rounded-lg shadow-2xl w-80 p-6 space-y-4 text-yellow-100"
        onClick={e => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold">Settings</h2>

        <div>
          <label htmlFor="volume" className="block mb-1">
            Volume: {volume}%
          </label>
          <input
            id="volume"
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={e => setVolume(+e.target.value)}
            className="w-full h-2 bg-yellow-700 rounded-lg accent-amber-400"
          />
        </div>

        <div className="flex items-center justify-between">
          <span>Sound Effects</span>
          <input
            type="checkbox"
            checked={soundFX}
            onChange={e => setSoundFX(e.target.checked)}
            className="h-5 w-5 text-amber-400 border-yellow-700 rounded"
          />
        </div>

        <div className="flex items-center justify-between">
          <span>Background Music</span>
          <input
            type="checkbox"
            checked={music}
            onChange={e => setMusic(e.target.checked)}
            className="h-5 w-5 text-amber-400 border-yellow-700 rounded"
          />
        </div>

        <div>
          <label htmlFor="difficulty" className="block mb-1">
            Difficulty
          </label>
          <select
            id="difficulty"
            value={difficulty}
            onChange={e => setDifficulty(e.target.value)}
            className="w-full border border-yellow-700 rounded px-3 py-2 bg-yellow-800 text-yellow-100"
          >
            <option value="easy">Hard</option>
            <option value="medium">Tough</option>
            <option value="hard">Grueling</option>
          </select>
        </div>

        <div className="flex items-center justify-between">
          <span>Timer</span>
          <input
            type="checkbox"
            checked={timer}
            onChange={e => setTimer(e.target.checked)}
            className="h-5 w-5 text-amber-400 border-yellow-700 rounded"
          />
        </div>

        <div className="flex justify-end space-x-3 mt-4">
          <button
            onClick={() => onClose()}
            className="px-4 py-2 text-yellow-200 hover:text-yellow-100"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-amber-600 text-yellow-100 rounded hover:bg-amber-500"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  )
}