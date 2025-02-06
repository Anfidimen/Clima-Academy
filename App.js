import "./styles.css";
import { useState } from "react";
import app from "./firebaseConfig";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

export default function App() {
  const auth = getAuth(app);
  const [data, setData] = useState({ email: "", password: "" });
  const [isLogin, setIsLogin] = useState(true); // Estado para alternar entre login y registro

  const toggleForm = () => setIsLogin(!isLogin); // Alternar entre registro e inicio de sesión

  const handleInput = (event) => {
    const { name, value } = event.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (isLogin) {
      // Inicio de sesión
      signInWithEmailAndPassword(auth, data.email, data.password)
        .then((response) => {
          alert(`Bienvenido de nuevo: ${response.user.email}`);
        })
        .catch((err) => {
          alert(`Error: ${err.message}`);
        });
    } else {
      // Registro
      createUserWithEmailAndPassword(auth, data.email, data.password)
        .then((response) => {
          alert(`Usuario registrado: ${response.user.email}`);
        })
        .catch((err) => {
          alert(`Error: ${err.message}`);
        });
    }
  };

  const handleGoogleAuth = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        alert(`Bienvenido, ${result.user.email}`);
      })
      .catch((err) => {
        alert(`Error: ${err.message}`);
      });
  };

  return (
    <div className="App">
      <h1>{isLogin ? "Iniciar Sesión" : "Crear Cuenta"}</h1>
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
          placeholder="Password"
          value={data.password}
          onChange={handleInput}
          required
          minLength="6"
        />
        <button type="submit">{isLogin ? "Iniciar Sesión" : "Registrarse"}</button>
      </form>
      <button className="google-btn" onClick={handleGoogleAuth}>
        {isLogin ? "Iniciar Sesión con Google" : "Registrarse con Google"}
      </button>
      <p>
        {isLogin ? "¿No tienes cuenta?" : "¿Ya tienes cuenta?"}{" "}
        <span onClick={toggleForm}>{isLogin ? "Regístrate" : "Inicia Sesión"}</span>
      </p>
    </div>
  );
}
