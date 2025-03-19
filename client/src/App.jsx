import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import WebSocketChat from "./components/WebSocketChat.jsx";
import TestRoomCreation from "./components/RoomCreation/TestRoomCreation.jsx";
import Room from "./components/RoomCreation/Room.jsx";
import 'materialize-css/dist/css/materialize.min.css';
import 'materialize-css/dist/js/materialize.min.js';

function App() {
    return (
        <BrowserRouter>
            <div className="App">
                <Routes>
                    <Route path="/" element={
                        <>
                            <WebSocketChat />
                            <TestRoomCreation />
                        </>
                    } />
                    <Route path="/room/:roomId" element={<Room />} />
                </Routes>
            </div>
        </BrowserRouter>
    );
}

export default App;
