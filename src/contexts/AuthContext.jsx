import React, { createContext, useContext, useEffect, useState } from "react"
import {
  onAuthStateChanged,
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from "firebase/auth"
import { auth, db } from "../firebase"
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore"

const AuthContext = createContext()

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async firebaseUser => {
      if (!firebaseUser) {
        setUser(null)
        setLoading(false)
        return
      }

      // Fetch Firestore profile for username
      const docRef = doc(db, "users", firebaseUser.uid)
      const snap   = await getDoc(docRef)
      const profile = snap.exists() ? snap.data() : {}

      setUser({
        uid:      firebaseUser.uid,
        email:    firebaseUser.email,
        username: profile.username || ""
      })
      setLoading(false)
    })

    return unsubscribe
  }, [])

  // Exposed auth methods
  const login = (email, pw) =>
    signInWithEmailAndPassword(auth, email, pw)

  const signup = async (username, email, pw) => {
    const cred = await createUserWithEmailAndPassword(auth, email, pw)
    await setDoc(doc(db, "users", cred.user.uid), {
      username,
      email,
      createdAt: serverTimestamp()
    })
    return cred
  }

  const logout = () => signOut(auth)

  // While loading, render a placeholder (or spinner) 
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-gray-700">Loading...</p>
      </div>
    )
  }

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
