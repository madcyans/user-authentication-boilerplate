import React, { createContext, useContext, useState, useMemo, useEffect } from "react"

const SettingsContext = createContext()

const defaultSettings = {
  musicVolume: 50,
  sfxVolume: 50,
  soundFX: true,
  music: true,
  difficulty: "medium",
  timer: true,
}

// Function to get initial settings from localStorage or defaults
const getInitialSettings = () => {
  try {
    const savedSettings = localStorage.getItem("quizAppSettings")
    if (savedSettings) {
      // Merge saved settings with defaults to ensure all keys are present
      return { ...defaultSettings, ...JSON.parse(savedSettings) }
    }
  } catch (error) {
    console.error("Failed to parse settings from localStorage", error)
  }
  return defaultSettings
}

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(getInitialSettings)

  // Effect to save settings to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem("quizAppSettings", JSON.stringify(settings))
    } catch (error) {
      console.error("Failed to save settings to localStorage", error)
    }
  }, [settings])

  const contextValue = useMemo(() => ({
    settings,
    setSettings
  }), [settings])

  return (
    <SettingsContext.Provider value={contextValue}>
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  return useContext(SettingsContext)
}
