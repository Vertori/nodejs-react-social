// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "recipes-express-e42e1.firebaseapp.com",
  projectId: "recipes-express-e42e1",
  storageBucket: "recipes-express-e42e1.appspot.com",
  messagingSenderId: "942468843327",
  appId: "1:942468843327:web:dbd9451efc95d0a34ff58a",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
