import React from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import "./index.css"
import App from "./App.jsx"
import { AuthProvider } from "./contexts/AuthContext.jsx"
import { SettingsProvider } from "./contexts/SettingsContext.jsx"

createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <SettingsProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </SettingsProvider>
  </AuthProvider>
)