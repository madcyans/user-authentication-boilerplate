import React, { useState, useEffect } from "react"
import { useClickSound } from "../contexts/SoundContext"

export default function SettingsModal({ isOpen, onClose, initial }) {
  const [volume,    setVolume]    = useState(initial.musicVolume)
  const [sfxVolume, setSfxVolume] = useState(initial.sfxVolume)
  const [soundFX,   setSoundFX]   = useState(initial.soundFX)
  const [music,     setMusic]     = useState(initial.music)
  const [difficulty,setDifficulty]= useState(initial.difficulty)
  const [timer,     setTimer]     = useState(initial.timer)
  const playClick = useClickSound()

  useEffect(() => {
    setVolume(initial.musicVolume)
    setSfxVolume(initial.sfxVolume)
    setSoundFX(initial.soundFX)
    setMusic(initial.music)
    setDifficulty(initial.difficulty)
    setTimer(initial.timer)
  }, [initial])

  const handleSave = () => {
    playClick()
    onClose({
      musicVolume: volume,
      sfxVolume,
      soundFX,
      music,
      difficulty,
      timer
    })
  }

  const handleCancel = () => {
    playClick()
    onClose()
  }

  if (!isOpen) return null
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
         onClick={handleCancel}>
      <div className="bg-yellow-900/90 border-yellow-800 rounded-lg p-6 text-yellow-100 space-y-4"
           onClick={e => e.stopPropagation()}>
        <h2 className="text-xl font-bold">Settings</h2>

        {/* Music Volume */}
        <div>
          <label htmlFor="volume" className="block mb-1">
            Music Volume: {volume}%
          </label>
          <input id="volume" type="range" min="0" max="100"
                 value={volume} onChange={e => setVolume(+e.target.value)}
                 className="w-full h-2 bg-yellow-700 rounded-lg accent-amber-400"/>
        </div>

        {/* SFX Volume */}
        <div>
          <label htmlFor="sfxVolume" className="block mb-1">
            Sound-FX Volume: {sfxVolume}%
          </label>
          <input id="sfxVolume" type="range" min="0" max="100"
                 value={sfxVolume} onChange={e => setSfxVolume(+e.target.value)}
                 className="w-full h-2 bg-yellow-700 rounded-lg accent-amber-400"/>
        </div>

        {/* Sound FX Toggle */}
        <div className="flex items-center justify-between">
          <span>Enable Sound Effects</span>
          <input type="checkbox" checked={soundFX}
                 onChange={e => setSoundFX(e.target.checked)}
                 className="h-5 w-5 text-amber-400 border-yellow-700 rounded"/>
        </div>

        {/* Background Music Toggle */}
        <div className="flex items-center justify-between">
          <span>Enable Music</span>
          <input type="checkbox" checked={music}
                 onChange={e => setMusic(e.target.checked)}
                 className="h-5 w-5 text-amber-400 border-yellow-700 rounded"/>
        </div>

        {/* Difficulty & Timer (unchanged) */}
        {/* … */}

        <div className="flex justify-end space-x-3 mt-4">
          <button onClick={handleCancel} className="px-4 py-2 text-yellow-200 hover:text-yellow-100">
            Cancel
          </button>
          <button onClick={handleSave} className="px-4 py-2 bg-amber-600 text-yellow-100 rounded hover:bg-amber-500">
            Save
          </button>
        </div>
      </div>
    </div>
  )
}
