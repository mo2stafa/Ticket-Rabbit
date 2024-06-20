// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "ticket-rabbit.firebaseapp.com",
  projectId: "ticket-rabbit",
  storageBucket: "ticket-rabbit.appspot.com",
  messagingSenderId: "105510007424",
  appId: "1:105510007424:web:5a97366d58d889eb446c65"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);