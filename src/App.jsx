import React from "react"
import { Routes, Route, Navigate } from "react-router-dom"
import Signup from "./pages/Signup.jsx"
import Login from "./pages/Login.jsx"
import Home from "./pages/Home.jsx"
import ProtectedRoute from "./components/ProtectedRoute.jsx"

export default function App() {
  return (
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

      {/* fallback */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}