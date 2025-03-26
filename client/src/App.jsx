
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import TestRoomCreation from "./components/RoomCreation/TestRoomCreation.jsx";
import Room from "./components/RoomCreation/Room.jsx";

function App() {
    return (
        <BrowserRouter>
            <div className="App">
                <Routes>
                    <Route path="/" element={
                        <>
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
