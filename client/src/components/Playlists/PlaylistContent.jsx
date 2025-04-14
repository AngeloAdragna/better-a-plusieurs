import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import {Pagination } from 'swiper/modules';
import PlaylistVideo from "./PlaylistVideo.jsx";
import RoomManager from '../../../../server/RoomManager.js';  // Importation du RoomManager

function PlaylistContent() {
    const { roomId } = useParams();  // Récupère l'ID de la room depuis l'URL
    const [isSelected, setIsSelected] = useState(true);
    const [videoPlaylist, setVideoPlaylist] = useState(RoomManager.getRoomById(roomId)?.videoPlaylist || []);  // Récupère la playlist de la room
    const [videoHistory, setVideoHistory] = useState(RoomManager.getRoomById(roomId)?.videoHistory || []);  // Récupère la playlist de la room

    const handleLinkClick = () => {
        setIsSelected((prev) => !prev);
    };

    // Fonction pour ajouter une vidéo à la playlist
    const handleAddVideoToPlaylist = (video) => {
        RoomManager.addVideoToPlaylist(roomId, video);
        const room = (RoomManager.getRoomById(roomId));
        const updatedPlaylist = room.getVideoPlaylist() || [];
        setVideoPlaylist(updatedPlaylist);  // Mise à jour de la playlist affichée
        //window.location.reload(); // Reload the page to reflect changes
    };

    // Fonction pour ajouter une vidéo à l'historique
    const handleAddVideoToHistory = (video) => {
        RoomManager.addVideoToHistory(roomId, video);
        const room = (RoomManager.getRoomById(roomId));
        const updatedHistory = room.getVideoHistory() || [];
        setVideoHistory(updatedHistory);  // Mise à jour de l'historique affiché
        //window.location.reload(); // Reload the page to reflect changes
    };

    return (
        <section className='PlaylistContent'>
            <div className="SelectionBar">
                <span onClick={handleLinkClick} className={`button ${isSelected ? 'down' : 'up'}`}>History</span>
                <span onClick={handleLinkClick} className={`button ${isSelected ? 'up' : 'down'}`}>Playlist</span>
            </div>
            <div className={`ContentPlaylistHistory ${isSelected ? 'desactived' : ''}`}>
                <Swiper
                    modules={[Pagination]}
                    direction="vertical"
                    spaceBetween={10}
                    slidesPerView="auto"
                    pagination={{ clickable: true }}
                    freeMode={true} // permet de scroller librement
                >
                    {videoPlaylist.map((video, i) => (
                        <SwiperSlide
                            key={i}
                            style={{
                                height: "auto", // important pour s’adapter au contenu
                                paddingBottom: "10px"
                            }}
                        >
                            <PlaylistVideo
                                title={video.title}
                                thumbnail={video.thumbnail}
                                url={video.url}
                            />
                        </SwiperSlide>
                    ))}
                </Swiper>
                {/* Exemple d'ajout d'une vidéo à la playlist */}
                <button onClick={() => handleAddVideoToPlaylist({ title: "Vidéo ajoutée", thumbnail: "https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" })}>
                    Ajouter une vidéo à la playlist
                </button>
            </div>
            <div className={`ContentPlaylistHistory ${isSelected ? '' : 'desactived'}`}>
                <Swiper
                    modules={[Pagination]}
                    direction="vertical"
                    spaceBetween={10}
                    slidesPerView="auto"
                    pagination={{ clickable: true }}
                    freeMode={true} // permet de scroller librement
                    >
                    {videoHistory.map((video, i) => (
                        <SwiperSlide
                            key={i}
                            style={{
                                height: "auto", // important pour s’adapter au contenu
                                paddingBottom: "10px"
                            }}
                        >
                            <PlaylistVideo
                                title={video.title}
                                thumbnail={video.thumbnail}
                                url={video.url}
                            />
                        </SwiperSlide>
                    ))}
                    </Swiper>
                {/* Exemple d'ajout d'une vidéo à l'historique */}
                <button onClick={() => handleAddVideoToHistory({ title: "Vidéo ajoutée à l'historique", thumbnail: "https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" })}>
                    Ajouter une vidéo à l'historique
                </button>
            </div>
        </section>
    );
}

export default PlaylistContent;
