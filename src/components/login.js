// src/components/Login.js
import React, { useState } from "react";
import { auth, db } from "../firebaseConfig";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { addDoc, collection } from "firebase/firestore";

const Login = () => {
  const [data, setData] = useState({ email: "", password: "" });
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState(null);

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setError(null);
  };

  const handleInput = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLogin) {
      // Inicio de sesión
      signInWithEmailAndPassword(auth, data.email, data.password)
        .then((response) => {
          alert(`Bienvenido de nuevo: ${response.user.email}`);
          // La redirección se hará en App.js según el estado de autenticación
        })
        .catch((err) => {
          setError(err.message);
        });
    } else {
      // Registro
      createUserWithEmailAndPassword(auth, data.email, data.password)
        .then(async (response) => {
          alert(`Usuario registrado: ${response.user.email}`);
          // Agregar información del usuario a Firestore
          try {
            await addDoc(collection(db, "users"), {
              uid: response.user.uid,
              email: response.user.email,
              createdAt: new Date(),
            });
          } catch (error) {
            console.error("Error al agregar a Firestore:", error);
            setError(error.message);
          }
        })
        .catch((err) => {
          setError(err.message);
        });
    }
  };

  const handleGoogleAuth = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then(async (result) => {
        alert(`Bienvenido: ${result.user.email}`);
        // Al autenticar con Google, agregar o actualizar el usuario en Firestore
        try {
          await addDoc(collection(db, "users"), {
            uid: result.user.uid,
            email: result.user.email,
            authProvider: "google",
            createdAt: new Date(),
          });
        } catch (error) {
          console.error("Error al agregar usuario de Google a Firestore:", error);
        }
      })
      .catch((err) => {
        setError(err.message);
      });
  };

  return (
    <div>
      <h1>{isLogin ? "Iniciar Sesión" : "Crear Cuenta"}</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={data.email}
          onChange={handleInput}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Contraseña"
          value={data.password}
          onChange={handleInput}
          required
          minLength="6"
        />
        <button type="submit">
          {isLogin ? "Iniciar Sesión" : "Registrarse"}
        </button>
      </form>
      <button onClick={handleGoogleAuth}>
        {isLogin ? "Iniciar con Google" : "Registrarse con Google"}
      </button>
      <p>
        {isLogin ? "¿No tienes cuenta?" : "¿Ya tienes cuenta?"}{" "}
        <button onClick={toggleForm}>
          {isLogin ? "Regístrate" : "Inicia Sesión"}
        </button>
      </p>
    </div>
  );
};

export default Login;
