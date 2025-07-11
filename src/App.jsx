import React from "react"
import { Routes, Route, Navigate } from "react-router-dom"
import Signup from "./pages/Signup.jsx"
import Login from "./pages/Login.jsx"
import Home from "./pages/Home.jsx"
import QuizPage from "./pages/QuizPage.jsx"
import ProtectedRoute from "./components/ProtectedRoute.jsx"
import { SoundProvider } from "./contexts/SoundContext"
import { useSettings }  from "./contexts/SettingsContext"

export default function App() {

  const { settings } = useSettings()

  return (
    <SoundProvider 
      volume={settings.sfxVolume/100}
      enabled={settings.soundFX}>
      <Routes>
        {/* redirect root → /login */}
        <Route index element={<Navigate to="/login" replace />} />

        {/* public */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* guarded */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

        <Route
          path="/play"
          element={
            <ProtectedRoute>
              <QuizPage />
            </ProtectedRoute>
          }
        />

        {/* fallback */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </SoundProvider>
  )
}