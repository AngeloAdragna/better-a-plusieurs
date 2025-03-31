import React from "react";
import WebSocketChat from "./WebSocketChat";
import YoutubeFrame from "./components/YoutubeFrame.jsx";
import {io} from "socket.io-client";

const socket = io("http://localhost:8080")
function App() {
    // In the future, the socket will be the socket of the room
    return (
        <div className="App">
            <WebSocketChat/><br/>
            <YoutubeFrame videoId="Sga1agmMkoU" socket={socket} owner={true}/>
        </div>
    );
}

export default App;