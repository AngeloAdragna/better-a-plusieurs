import React from "react";
import WebSocketChat from "./WebSocketChat";
import YoutubeFrame from "./YoutubeFrame.jsx";

function App() {
    return (
        <div className="App">
            <WebSocketChat /><br/>
            <YoutubeFrame videoId="Sga1agmMkoU"/>
        </div>
    );
}

export default App;