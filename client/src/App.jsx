import React from "react";
import WebSocketChat from "./components/WebSocketChat";
import BarPage from "./components/BarPage";
import VideoContent from "./components/VideoContent";
import RecommandationContent from "./components/RecommandationContent";
import "./styles/App.css";

function App() {
    return (
        <div className="App">
            <BarPage />
            <VideoContent />
            <RecommandationContent />
            <WebSocketChat />
        </div>
    );
}

export default App;