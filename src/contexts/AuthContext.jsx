import {
  createContext,
  useContext,
  useEffect,
  useState
} from "react"
import {
  onAuthStateChanged,
  signOut
} from "firebase/auth"
import { auth, db } from "../firebase"
import { doc, getDoc } from "firebase/firestore"

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser]   = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null)
        setLoading(false)
        return
      }

      // fetch extra profile data
      const docRef = doc(db, "users", firebaseUser.uid)
      const snap   = await getDoc(docRef)
      const profile = snap.exists() ? snap.data() : {}

      setUser({
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        username: profile.username || ""
      })
      setLoading(false)
    })
    return unsubscribe
  }, [])

  if (loading) return <p>Loading...</p>

  // attach a logout helper
  const logout = () => signOut(auth)

  return (
    <AuthContext.Provider value={{ ...user, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)