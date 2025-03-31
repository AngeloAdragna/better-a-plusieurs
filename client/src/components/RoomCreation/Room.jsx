import React from "react";
import WebSocketChat from "../WebSocketChat.jsx";
import BarPage from "../BarPage.jsx";
import VideoContent from "../VideoContent.jsx";
import RecommandationContent from "../Recommandation/RecommandationContent.jsx";
import PlaylistContent from "../PlaylistContent.jsx";
import "../../styles/Room.css";
import { useParams } from "react-router-dom";

function Room() {
    const { roomId } = useParams();

    return (
    <div className="room-container row">
      <BarPage />  {/* Barre de navigation */}
      <div className="valign-wrapper main-content"> {/* Conteneur principal */}
        <div className="left-container col s12 m6 l7"> {/* Vidéo et recommandations */}
          <div className="video-container "> {/* Vidéo */}
            <VideoContent />
          </div>
          <div className="recommendation-container">{/* Recommandations */}
            <RecommandationContent />
          </div>
        </div>
        <div className="col s6 m6 l6 playlist-section">{/* playlist */}
          <PlaylistContent />
        </div>
        <div>{/* Chat */}
          <WebSocketChat /> {/* Chat */}
          </div>
      </div>
    </div>
    );
}
export default Room;
