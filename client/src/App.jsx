import React, { useState, useContext } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Composants liés aux rooms
import Room from "./components/RoomCreation/Room.jsx";
import ModalJoinRoom from "./components/RoomCreation/ModalJoinRoom.jsx";
import ModalRoomParameters from "./components/RoomCreation/ModalRoomParameters.jsx";

// Composants liés à l'authentification
import ModalOpenConnection from "./components/Login/ModalOpenConnection.jsx";

// Contexte d'authentification
import { AuthProvider } from "./context/AuthContext";
import { AuthContext } from "./context/AuthContext";
import RegisterButton from "./components/Login/RegisterButton.jsx";
import LoginButton from "./components/Login/LoginButton.jsx";

import "./styles/HomePage.css";
import {io} from "socket.io-client";
import {SocketProvider, useSocket} from "./components/SocketContext.jsx";

function HomePage() {
    const socket = useSocket();
    const [modalOpen, setModalOpen] = useState(false);
    const [isConnectionOnly, setIsConnectionOnly] = useState(false);
    const { isConnected } = useContext(AuthContext);
    const [username, setUsername] = useState(localStorage.getItem("username"));

    const openConnectionModal = () => {
        setModalOpen(true);
        setIsConnectionOnly(true);
    };

    const openRoomCreationModal = () => {
        setModalOpen(true);
        setIsConnectionOnly(false);
    };

    const openJoinRoomModal = () => {
        setModalOpen(true);
    };

    React.useEffect(() => {
        if (!socket) return;
        if (localStorage.getItem("roomId")) {
            localStorage.removeItem("roomId");
        }
        socket.on("connect", () => {
            console.log("✅ WebSocket connecté :", socket.id);
        });

        return () => {};
    }, [socket]);


    React.useEffect(() => {
        if (!socket) return;

        socket.on("username", (username) => {
            setUsername(username);
        });

        return () => {
            socket.off("username");
        };
    }, [socket]);

    return (
        <div className="homepage-container">
            <div className="header-buttons">
                {username ? (
                    <div className="connected-info">
                        Connecté en tant que <strong>{username}</strong>
                    </div>
                ) : (
                    <>
                        <LoginButton socket={socket} />
                        <RegisterButton socket={socket} />
                    </>
                )}
            </div>

            <div className="CenteredContent">
                <img src={"src/assets/icon_space.svg"} alt={"logo"} />
                <div className={"buttonsCenter"}>
                    <a
                        className="waves-effect waves-light btn modal-trigger"
                        href={isConnected ? "#modalRoomParameters" : "#modalConnection"}
                        onClick={openRoomCreationModal}
                    >
                        Créer Room
                    </a>
                    <a
                        className="waves-effect waves-light btn modal-trigger"
                        href="#ModalJoinRoom"
                        onClick={openJoinRoomModal}
                    >
                        Rejoindre une Room
                    </a>
                </div>
            </div>

            {/* Modales */}
            {modalOpen && (
                isConnected ? <ModalRoomParameters /> : <ModalOpenConnection onlyConnection={isConnectionOnly} />
            )}
            {modalOpen && <ModalJoinRoom/>}
        </div>
    );
}



function AppContent() {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/room/:roomId" element={<Room />} />
        </Routes>
    );
}

function App() {
    return (
        <AuthProvider>
            <SocketProvider>
                <BrowserRouter>
                    <AppContent />
                </BrowserRouter>
            </SocketProvider>
        </AuthProvider>
    );
}

export default App;
