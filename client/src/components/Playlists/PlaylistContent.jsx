import React, { use, useState,useEffect } from "react";
import io from "socket.io-client";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import {Pagination } from 'swiper/modules';
import PlaylistVideo from "./PlaylistVideo.jsx";
import axios from 'axios';
import room from "../RoomCreation/Room.jsx";
import { MdSkipNext } from "react-icons/md";


function PlaylistContent({roomInfo, roomId, socket, isAllowedToAdd, isAllowedToSkip}) {
    const [isSelected, setIsSelected] = useState(true);
    const [videoPlaylist, setVideoPlaylist] = useState(roomInfo.videoPlaylist || []);  // Initialise la playlist avec les vidéos de la room
    const [videoHistory, setVideoHistory] = useState(roomInfo.videoHistory || []);
    const [isSkipVote, setIsSkipVote] = useState(false)

    const handleLinkClick = () => {
        setIsSelected((prev) => !prev);
    };

    // Ecouteur d'événement pour la réception de la vidéo ajoutée à la playlist
    useEffect(() => {
        socket.on("videoAddedPlaylist", (data)=> {
            setVideoPlaylist(data);
            console.log("Playlist :", videoPlaylist)
        });
        return () => socket.off("videoAddedPlaylist");
    }, []);
    
    // Ecouteur d'événement pour la réception de la vidéo ajoutée à l'historique
    useEffect(() => {
        socket.on("videoAddedHistory", (data)=>{ 
            setVideoHistory(data);
            console.log("History :", videoHistory)
            });
        return () => socket.off("videoAddedHistory");
    }, []);

    // Récupération de la playlist depuis le serveur lors du chargement du composant
    useEffect(() => {
        if (roomId) {
            //socket.emit("joinRoom", roomId);
            axios.get(`http://localhost:8080/room-playlist/${roomId}`)
                .then((response) => {
                    setVideoPlaylist(response.data);
                    console.log("Playlist récupérée :", response.data);
                })
                .catch((error) => {
                    console.error("Erreur lors de la récupération de la playlist :", error);
                });
        }

    }, [roomId]);

    // Récupération de l'historique depuis le serveur lors du chargement du composant
    useEffect(() => {
        if (roomId) {
            //socket.emit("joinRoom", roomId);
            axios.get(`http://localhost:8080/room-history/${roomId}`)
                .then((response) => {
                    setVideoHistory(response.data);
                    console.log("Historique récupéré :", response.data);
                })
                .catch((error) => {
                    console.error("Erreur lors de la récupération de l'historique :", error);
                });
        }
    }, [roomId]);

    const handleSkipVideo = () => {
        console.log("Vote to skip")
        if (isAllowedToSkip) {
            socket.emit("nextVideo", {roomId : roomId})
        }
        else {
            setIsSkipVote(true)
            socket.emit("startVote", { roomId, author: localStorage.getItem("username"), voteType: "skip", videoName: "actuelle" });
        }

    }

    useEffect(() => {
        const nextVideo = ({id, result}) => {
            //console.log(`Result = ${result}`)
            if (isSkipVote) {
                if (result) socket.emit("nextVideo", {roomId: roomId})
                setIsSkipVote(false)
            }
        }

        socket.on("voteEnded", nextVideo)
        return () => {
            socket.off("voteEnded", nextVideo);
        };
    }, [socket, isSkipVote]);




    return (
        <section className='PlaylistContent'>
            <div className="SelectionBar">
                <span onClick={handleLinkClick} className={`button ${isSelected ? 'down' : 'up'}`}>History</span>
                <span onClick={handleLinkClick} className={`button ${isSelected ? 'up' : 'down'}`}>Playlist</span>
            </div>
            <div className={`ContentPlaylistHistory ${isSelected ? 'desactived' : ''}`}>
                <div className="playlist-container">
                    {videoPlaylist.length === 0 ? (
                        <p>La playlist est vide</p> // Message si la playlist est vide
                    ) : (
                        videoPlaylist.map((video, i) => (
                            <PlaylistVideo
                                title={video.title}
                                thumbnail={video.thumbnail}
                                video={video}
                                roomId={roomId}
                                socket={socket}
                                isPlaylistItem={!isSelected}
                                isAllowedToAdd={isAllowedToAdd}
                            />
                        ))
                    )}
                    {videoPlaylist.length > 0 && (
                        <div className="skip-video button">
                            <span onClick={handleSkipVideo}>Vidéo suivante <MdSkipNext className="skip-video-icon" /></span>
                        </div>
                    )}
                </div>

            </div>

            <div className={`ContentPlaylistHistory ${isSelected ? '' : 'desactived'}`}>
                <div className="history-container">
                    {videoHistory.length === 0 ? (
                            <p>Aucune vidéo n'a été lue pour le moment</p> // Message si la playlist est vide
                        ) : (
                        videoHistory.map((video, i) => (
                            <PlaylistVideo
                                title={video.title}
                                thumbnail={video.thumbnail}
                                video={video}
                                roomId={roomId}
                                socket={socket}
                                isPlaylistItem={!isSelected}
                            />
                    )))}
                </div>
            </div>
        </section>
    );
}

export default PlaylistContent;
