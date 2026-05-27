import { initializeApp } from "https://www.gstatic.com/firebasejs/12.13.0/firebase-app.js"
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.13.0/firebase-firestore.js"
import { getAuth, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/12.13.0/firebase-auth.js"
import { firebaseConfig } from './config.js'



const app      = initializeApp(firebaseConfig)
const db       = getFirestore(app)
const auth     = getAuth(app)
const provider = new GoogleAuthProvider()

export { db, auth, provider }