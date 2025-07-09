import React, { createContext, useContext, useState } from "react"

const SettingsContext = createContext()

const defaultSettings = {
  volume: 50,
  soundFX: true,
  music: true,
  difficulty: "medium",
  timer: true,
}

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(defaultSettings)

  return (
    <SettingsContext.Provider value={{ settings, setSettings }}>
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  return useContext(SettingsContext)
}