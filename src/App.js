// src/App.js
import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebaseConfig";
import Login from "./components/login";
import StudentArea from "./components/StudentArea";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Escucha los cambios en la autenticación
    const unsubscribe = onAuthStateChanged(auth, (usr) => {
      setUser(usr);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) return <div>Cargando...</div>;

  return (
    <BrowserRouter>
      <Routes>
        {/* Si hay usuario autenticado, se redirige a /student */}
        <Route
          path="/login"
          element={user ? <Navigate to="/student" /> : <Login />}
        />
        {/* Ruta protegida: solo accesible si el usuario está autenticado */}
        <Route
          path="/student"
          element={user ? <StudentArea user={user} /> : <Navigate to="/login" />}
        />
        {/* Ruta por defecto: redirige según el estado de autenticación */}
        <Route
          path="*"
          element={<Navigate to={user ? "/student" : "/login"} />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
