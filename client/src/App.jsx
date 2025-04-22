import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import TestRoomCreation from "./components/RoomCreation/TestRoomCreation.jsx";
import Room from "./components/RoomCreation/Room.jsx";
import ModalOpenConnection from "./components/RoomCreation/ModalOpenConnection.jsx";
import ModalJoinRoom from "./components/RoomCreation/ModalJoinRoom.jsx";
import ModalRoomParameters from "./components/RoomCreation/ModalRoomParameters.jsx";
import LoginButton from "./components/Login/LoginButton.jsx"; // <-- Gardé depuis feat/unit-test
import { AuthProvider } from "./context/AuthContext"; // adapte le chemin
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";

function AppContent() {
    const [modalOpen, setModalOpen] = useState(false);
    const [onlyConnection, setOnlyConnection] = useState(false);
    const { isConnected } = useContext(AuthContext); // Récupéré depuis le contexte

    return (
        <div className="App">
            <Routes>
                <Route path="/" element={
                    <>
                        <div>
                            <a className="waves-effect waves-light btn modal-trigger" href="#modalCreate"
                               onClick={() => {
                                   setModalOpen(true);
                                   setOnlyConnection(true);
                               }}>
                                Se connecter
                            </a>
                            {modalOpen && <ModalOpenConnection onlyConnection={onlyConnection} />}
                        </div>
                        <div>
                            <a className="waves-effect waves-light btn modal-trigger"
                               href={isConnected ? "#modalRoomParameters" : "#modalCreate"}
                               onClick={() => {
                                   setModalOpen(true);
                                   setOnlyConnection(false);
                               }}>
                                Créer Room
                            </a>
                            {modalOpen && (isConnected ? <ModalRoomParameters /> : <ModalOpenConnection onlyConnection={onlyConnection} />)}
                        </div>
                        <div>
                            <a className="waves-effect waves-light btn modal-trigger" href="#ModalJoinRoom"
                               onClick={() => setModalOpen(true)}>
                                Rejoindre
                            </a>
                            {modalOpen && <ModalJoinRoom />}
                        </div>
                        <LoginButton />
                    </>
                } />
                <Route path="/room/:roomId" element={<Room />} />
            </Routes>
        </div>
    );
}

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <AppContent />
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;