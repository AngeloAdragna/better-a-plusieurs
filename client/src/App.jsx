import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import TestRoomCreation from "./components/RoomCreation/TestRoomCreation.jsx";
import Room from "./components/RoomCreation/Room.jsx";
import ModalOpenConnection from "./components/RoomCreation/ModalOpenConnection.jsx";
import ModalJoinRoom from "./components/RoomCreation/ModalJoinRoom.jsx";
import ModalRoomParameters from "./components/RoomCreation/ModalRoomParameters.jsx";
import LoginButton from "./components/Login/LoginButton.jsx";

function App() {
    const [modalOpen, setModalOpen] = useState(false);
    const [onlyConnection, setOnlyConnection] = useState(false); // State to control if it's for connection only
    const isConnected = false; //TODO Remplace ça par un vrai état de connexion

    return (
        <BrowserRouter>
            <div className="App">
                <Routes>
                    <Route path="/" element={
                        <>
                            <div>
                                {/* Bouton pour la connexion */}
                                <a className="waves-effect waves-light btn modal-trigger" href="#modalCreate"
                                   onClick={() => {
                                       setModalOpen(true);
                                       setOnlyConnection(true); // onlyConnection à true pour le premier modal
                                   }}>
                                    Se connecter
                                </a>
                                {modalOpen && <ModalOpenConnection onlyConnection={onlyConnection} />}
                            </div>
                            <div>
                                {/* Bouton pour créer une room */}
                                <a className="waves-effect waves-light btn modal-trigger"
                                   href={isConnected ? "#modalRoomParameters" : "#modalCreate"}
                                   onClick={() => {
                                       setModalOpen(true);
                                       setOnlyConnection(false); // onlyConnection à false pour le second modal
                                   }}>
                                    Créer Room
                                </a>

                                {/* Affichage conditionnel de la bonne modale */}
                                {modalOpen && (isConnected ? <ModalRoomParameters /> : <ModalOpenConnection onlyConnection={onlyConnection} />)}
                            </div>
                            <div>
                                {/* Bouton pour rejoindre une room */}
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
        </BrowserRouter>
    );
}

export default App;
