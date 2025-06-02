import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC0C4ejvpzGfdxJVzHy0u5y1YnRMUZiP-A",
  authDomain: "td-yazilim.firebaseapp.com",
  projectId: "td-yazilim",
  storageBucket: "td-yazilim.firebasestorage.app",
  messagingSenderId: "2862311585",
  appId: "1:2862311585:web:78833bdffc48bffca468e0",
  measurementId: "G-J6FDP2GK86",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
export { auth, db };
