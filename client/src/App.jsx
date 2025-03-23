import React from "react";
import WebSocketChat from "./components/WebSocketChat";
import BarPage from "./components/BarPage";
import VideoContent from "./components/VideoContent";
import RecommandationContent from "./components/RecommandationContent";
import PlaylistContent from "./components/PlaylistContent";
import "./styles/Room.css";

function App() {
    return (
    <div className="room-container">
      <BarPage />  {/* Barre de navigation */}
      <div className="main-content"> {/* Conteneur principal */}
        <div className="left-section">
          <div className="video-container"> {/* Vidéo */}
            <VideoContent />
          </div>
          <div className="recommendation-container">{/* Recommandations */}
            <RecommandationContent />
          </div>
        </div>
        <div className="playlist-section">{/* Chat */}
          <PlaylistContent />
        </div>
          <WebSocketChat />
      </div>
    </div>
    );
}

export default App;