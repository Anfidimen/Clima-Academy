import { useState, useEffect } from "react";
import { app, db } from "./firebaseConfig";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
// Importamos las funciones necesarias de Firestore
import { collection, addDoc, getDocs } from "firebase/firestore";

export default function App() {
  const auth = getAuth(app);
  const [data, setData] = useState({ email: "", password: "" });
  const [isLogin, setIsLogin] = useState(true);

  const toggleForm = () => setIsLogin(!isLogin);

  const handleInput = (event) => {
    const { name, value } = event.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  // Función para leer los usuarios almacenados en Firestore
  const fetchUsers = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "users"));
      querySnapshot.forEach((doc) => {
        console.log(doc.id, " => ", doc.data());
      });
    } catch (error) {
      console.error("Error al leer usuarios:", error);
    }
  };

  useEffect(() => {
    // Ejemplo de lectura al cargar la app
    fetchUsers();
  }, []);

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
        .then(async (response) => {
          alert(`Usuario registrado: ${response.user.email}`);
          // Una vez registrado, agrega la información del usuario a Firestore
          try {
            await addDoc(collection(db, "users"), {
              uid: response.user.uid,
              email: response.user.email,
              createdAt: new Date()
            });
            alert("Datos guardados en Firestore");
          } catch (error) {
            console.error("Error al agregar a Firestore:", error);
            alert(`Error al guardar en Firestore: ${error.message}`);
          }
        })
        .catch((err) => {
          alert(`Error: ${err.message}`);
        });
    }
  };

  const handleGoogleAuth = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then(async (result) => {
        alert(`Bienvenido, ${result.user.email}`);
        // Al autenticar con Google, puedes agregar o actualizar el usuario en Firestore
        try {
          await addDoc(collection(db, "users"), {
            uid: result.user.uid,
            email: result.user.email,
            // Puedes agregar más campos o actualizar según convenga
            authProvider: "google",
            createdAt: new Date()
          });
          alert("Datos de Google guardados en Firestore");
        } catch (error) {
          console.error("Error al agregar usuario de Google a Firestore:", error);
        }
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
        <button type="submit">
          {isLogin ? "Iniciar Sesión" : "Registrarse"}
        </button>
      </form>
      <button className="google-btn" onClick={handleGoogleAuth}>
        {isLogin ? "Iniciar Sesión con Google" : "Registrarse con Google"}
      </button>
      <p>
        {isLogin ? "¿No tienes cuenta?" : "¿Ya tienes cuenta?"}{" "}
        <span onClick={toggleForm}>
          {isLogin ? "Regístrate" : "Inicia Sesión"}
        </span>
      </p>
    </div>
  );
}
