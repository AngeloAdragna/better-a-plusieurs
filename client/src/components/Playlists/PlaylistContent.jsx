import React, { use, useState,useEffect } from "react";
import io from "socket.io-client";

import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import {Pagination } from 'swiper/modules';
import PlaylistVideo from "./PlaylistVideo.jsx";
import RoomManager from '../../../../server/RoomManager.js';  // Importation du RoomManager
import axios from "axios";

const socket = io("http://localhost:8080");

function PlaylistContent({roomInfo}) {
    const { roomId } = useParams();  // Récupère l'ID de la room depuis l'URL
    const [isSelected, setIsSelected] = useState(true);
    const [videoPlaylist, setVideoPlaylist] = useState(roomInfo.videoPlaylist || []);  // Initialise la playlist avec les vidéos de la room
    const [videoHistory, setVideoHistory] = useState(roomInfo.videoHistory || []); 
    //console.log("PlaylistContent", videoPlaylist);

    const handleLinkClick = () => {
        setIsSelected((prev) => !prev);
    };

    // Fonction pour ajouter une vidéo à la playlist
    const handleAddVideoToPlaylist = (video) => {
        //Todo verif structure lien bien vid
        socket.emit("videoAdded", { roomId, video });  // Envoie la vidéo au serveur
    };

    // Fonction pour ajouter une vidéo à l'historique
    const handleAddVideoToHistory = (video) => {
        const room = (RoomManager.getRoomById(roomInfo.id));
        room.addVideoToHistory(video);  // Ajout de la vidéo à l'historique de la room
        setVideoHistory((prev) => [...prev, video]);  // Met à jour l'état local de l'historique
    };


    useEffect(() => {
        socket.on("videoAdded", (data)=> {
            setVideoPlaylist((prev) => [...prev, data] );
            console.log("Video added to playlist :", data)
            console.log("Playlist :", videoPlaylist)
        });
        return () => socket.off("videoAdded");
    }, []);
    
    useEffect(() => {
        socket.on("selectVideo", (data)=> setVideoHistory((prev => [data,...prev])));
        return () => socket.off("selectVideo");
    }, []);



    useEffect(() => {
        if (roomId) {
            socket.emit("joinRoom", roomId);
            axios.get(`http://localhost:8080/room-playlist/${roomId}`).then((response) => {
                console.log("Response :", response.data);
                setVideoPlaylist(videoPlaylist);
                console.log("Playlist :", videoPlaylist);
            });
        }

    }, [roomId]);

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
                <button onClick={() => handleAddVideoToHistory({ title: video.title, thumbnail: video.thumbnail, url: video.url })}>
                    Ajouter une vidéo à l'historique
                </button>
            </div>
        </section>
    );
}

export default PlaylistContent;
