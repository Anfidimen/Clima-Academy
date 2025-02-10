// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDYuUE2ytbT0BHormVsNGKsJ-zH2kVIJuE",
  authDomain: "proyecto-clima-academy.firebaseapp.com",
  projectId: "proyecto-clima-academy",
  storageBucket: "proyecto-clima-academy.firebasestorage.app",
  messagingSenderId: "284317678788",
  appId: "1:284317678788:web:1ddf99db307d3c29a15d91",
  measurementId: "G-40HT256L7R"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar Analytics (opcional)
const analytics = getAnalytics(app);

// Inicializar Firestore y obtener una referencia
const db = getFirestore(app);

// Inicializar Autenticación
const auth = getAuth(app);

export { app, analytics, db, auth };
