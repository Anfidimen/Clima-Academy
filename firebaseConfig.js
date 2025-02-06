// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDYuUE2ytbT0BHormVsNGKsJ-zH2kVIJuE",
  authDomain: "proyecto-clima-academy.firebaseapp.com",
  projectId: "proyecto-clima-academy",
  storageBucket: "proyecto-clima-academy.firebasestorage.app",
  messagingSenderId: "284317678788",
  appId: "1:284317678788:web:1ddf99db307d3c29a15d91",
  measurementId: "G-40HT256L7R"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export default app;