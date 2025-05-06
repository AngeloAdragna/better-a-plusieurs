import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import "../styles/roomList.css";

export default function RoomList() {
    const [rooms, setRooms] = useState([]);
    const navigate = useNavigate();
    const { isConnected } = useContext(AuthContext);
    const serverIP = import.meta.env.VITE_SERVER_IP;

    const truncate = (str, maxLength) => {
        return str.length > maxLength ? str.slice(0, maxLength - 3) + '...' : str;
    };

    useEffect(() => {
        const fetchOpenRooms = async () => {
            try {
                const response = await axios.get(`http://${serverIP}:8080/openRooms`);
                setRooms(response.data);
            } catch (error) {
                console.error("Erreur lors de la récupération des rooms :", error);
            }
        };

        fetchOpenRooms();
    }, []);

    if (!rooms || rooms.length === 0) {
        return (
            <></>
        );
    }

    return (
        <>
        <div className="transition">
            <></>
        </div>
        <div className="RoomList">
            <h2>Liste des Rooms</h2>
            <ul>
                {rooms.map((room, index) => (
                    <li key={index} style={{ marginBottom: '1em' }} className={"room-list-item"}>
                        <div className={"name"}>{ truncate(room.name || "Room sans nom", 40)}</div>
                        <div className={"owner"}><strong>by </strong> {room.ownerClient || "Inconnu"}</div>
                        <div className={"current-video"}><strong>Vidéo en cours :</strong> {truncate(room.videoHistory?.[0]?.title || "Aucune vidéo", 40)}</div>
                        {isConnected && (
                            <button
                                className="joinRoomBtn"
                                style={{ marginTop: '0.5em' }}
                                onClick={() => navigate(`/room/${room.id}`)}
                            >
                                Rejoindre
                            </button>
                        )}
                    </li>
                ))}
            </ul>
        </div>
        </>
    );
}
