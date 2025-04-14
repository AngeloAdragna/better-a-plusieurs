import React, { useState, useEffect } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import RecommandationVideo from './RecommandationVideo';
import { useParams } from "react-router-dom";

function RecommandationContent() {
  const { roomId } = useParams();  // Récupère l'ID de la room depuis l'URL

  const [accessToken, setAccessToken] = useState(null);  // Gère le token d'accès Google
  const [videoList, setVideoList] = useState([]);  // Liste des vidéos recommandées

  // Gestion du login via Google
  const login = useGoogleLogin({
    onSuccess: tokenResponse => setAccessToken(tokenResponse.access_token),
    scope: 'https://www.googleapis.com/auth/youtube.readonly',
  });

  // Lorsque le token est disponible, on récupère les recommandations de vidéos
  useEffect(() => {
    if (!accessToken) return;  // Si pas de token, on ne fait rien

    const fetchRecommendations = async () => {
      try {
        const token = localStorage.getItem('token');  // Récupère le token d'authentification pour l'API
        const response = await fetch(`http://127.0.0.1:8080/room/${roomId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ accessToken }),  // Envoie l'accessToken à l'API backend
        });

        const data = await response.json();
        setVideoList(data);  // Met à jour la liste des vidéos
        console.log('Liste de vidéos recommandées:', data);
      } catch (error) {
        console.error('Erreur lors de la récupération des vidéos:', error);
      }
    };

    fetchRecommendations();  // Appelle la fonction pour récupérer les vidéos
  }, [accessToken, roomId]);  // Quand le token ou roomId change, on refait l'appel

  return (
    <div>
      {!accessToken ? (
        <button onClick={() => login()} style={{ margin: '1rem' }}>
          Se connecter avec Google
        </button>
      ) : (
        <Swiper
          modules={[Navigation, Pagination]}
          spaceBetween={20}
          slidesPerView={4}
          navigation
          pagination={{ clickable: true }}
          loop={true}
        >
          {videoList.map((video, i) => (
            <SwiperSlide key={i}>
              <RecommandationVideo
                title={video.title}
                thumbnail={video.thumbnail}
                url={video.url}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>
  );
}

export default RecommandationContent;
