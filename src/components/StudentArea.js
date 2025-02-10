// src/components/StudentArea.js
import React, { useEffect, useState } from "react";
import { auth, db } from "../firebaseConfig";
import { signOut } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";
import "./StudentArea.css"; // Asegúrate de crear este archivo con los estilos

const StudentArea = ({ user }) => {
  const [userData, setUserData] = useState(null);
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);

  // Función para obtener datos del usuario desde Firestore
  const fetchUserData = async () => {
    try {
      const q = query(
        collection(db, "users"),
        where("uid", "==", user.uid)
      );
      const querySnapshot = await getDocs(q);
      let data = null;
      querySnapshot.forEach((doc) => {
        data = doc.data();
      });
      setUserData(data);
    } catch (error) {
      console.error("Error al obtener datos del usuario:", error);
    }
  };

  // Función para simular la carga de vídeos
  // En una aplicación real podrías obtenerlos de Firestore u otra fuente.
  const fetchVideos = async () => {
    const dummyVideos = [
      {
        id: 1,
        title: "Introducción al Curso",
        description: "Bienvenido a la primera lección del curso.",
        thumbnail: "https://via.placeholder.com/300x200?text=Video+1",
        videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
      },
      {
        id: 2,
        title: "Lección 1: Fundamentos",
        description: "Explora los fundamentos esenciales.",
        thumbnail: "https://via.placeholder.com/300x200?text=Video+2",
        videoUrl: "https://www.w3schools.com/html/movie.mp4",
      },
      {
        id: 3,
        title: "Lección 2: Estructuras de Datos",
        description: "Conoce las estructuras de datos básicas.",
        thumbnail: "https://via.placeholder.com/300x200?text=Video+3",
        videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
      },
    ];
    setVideos(dummyVideos);
  };

  useEffect(() => {
    fetchUserData();
    fetchVideos();
  }, [user]);

  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <div className="student-area">
      <header className="header">
        <h1>Área de Alumno</h1>
        <nav>
          <ul className="nav-links">
            <li>Inicio</li>
            <li>Cursos</li>
            <li>Perfil</li>
            <li>
              <button onClick={handleLogout}>Cerrar Sesión</button>
            </li>
          </ul>
        </nav>
      </header>

      <main className="main-content">
        <section className="welcome-section">
          <h2>Bienvenido, {user.email}</h2>
          {userData && userData.createdAt && (
            <p>
              Registrado el:{" "}
              {new Date(userData.createdAt.seconds * 1000).toLocaleDateString()}
            </p>
          )}
        </section>

        <section className="videos-section">
          <h2>Mis Vídeos</h2>
          <div className="videos-grid">
            {videos.map((video) => (
              <div
                key={video.id}
                className="video-card"
                onClick={() => setSelectedVideo(video)}
              >
                <img src={video.thumbnail} alt={video.title} />
                <div className="video-info">
                  <h3>{video.title}</h3>
                  <p>{video.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {selectedVideo && (
          <section className="video-player-section">
            <div
              className="video-player-overlay"
              onClick={() => setSelectedVideo(null)}
            ></div>
            <div className="video-player-modal">
              <button
                className="close-btn"
                onClick={() => setSelectedVideo(null)}
              >
                X
              </button>
              <h2>{selectedVideo.title}</h2>
              <video
                controls
                autoPlay
                src={selectedVideo.videoUrl}
                className="video-player"
              ></video>
              <p>{selectedVideo.description}</p>
            </div>
          </section>
        )}
      </main>

      <footer className="footer">
        <p>© 2025 Clima Academy. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
};

export default StudentArea;
