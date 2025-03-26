import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import TestRoomCreation from "./components/RoomCreation/TestRoomCreation.jsx";
import Room from "./components/RoomCreation/Room.jsx";
import ModalOpenConnection from "./components/RoomCreation/modalOpenConnection.jsx";
import { useState } from "react";

function App() {
    const [modalOpenConnection, setModalOpenConnection] = useState(false);
    return (
        <BrowserRouter>
            <div className="App">
                <Routes>
                    <Route path="/" element={
                        <>
                            <TestRoomCreation />
                            <div>
                                <a className="waves-effect waves-light btn modal-trigger" href="#modalCreate" onClick={() => setModalOpenConnection(true)}>
                                    Créer Room
                                </a>
                                {modalOpenConnection && <ModalOpenConnection />}
                            </div>
                        </>
                    } />
                    <Route path="/room/:roomId" element={<Room />} />
                </Routes>
            </div>
        </BrowserRouter>
    );
}

export default App;
