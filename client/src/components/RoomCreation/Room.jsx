import React from "react";
import WebSocketChat from "../WebSocketChat.jsx";
import BarPage from "../BarPage.jsx";
import VideoContent from "../VideoContent.jsx";
import RecommandationContent from "../Recommandation/RecommandationContent.jsx";
import PlaylistContent from "../PlaylistContent.jsx";
import "../../styles/Room.css";
import { useParams } from "react-router-dom";
import YoutubeFrame from "../YoutubeFrame.jsx";
import {io} from "socket.io-client";

function Room() {
    const { roomId } = useParams();
    const socket = io("http://localhost:8080")

    return (
    <div className="room-container">
      <BarPage />  {/* Barre de navigation */}
      <div className="main-content"> {/* Conteneur principal */}
        <div className="left-section">
          <div className="video-container"> {/* Vidéo */}
            <YoutubeFrame videoId="Sga1agmMkoU" socket={socket}/>
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
export default Room;
