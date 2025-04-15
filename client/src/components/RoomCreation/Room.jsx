import React from "react";
import WebSocketChat from "../WebSocketChat.jsx";
import BarPage from "../BarPage/BarPage.jsx";
import VideoContent from "../VideoContent.jsx";
import RecommandationContent from "../Recommandation/RecommandationContent.jsx";
import PlaylistContent from "../PlaylistContent.jsx";
import "../../styles/Room.css";
import { useParams } from "react-router-dom";
import YoutubeFrame from "../YoutubeFrame.jsx";
import {io} from "socket.io-client"

function Room() {
    const { roomId } = useParams();

    const [socket, setSocket] = React.useState(io("http://localhost:8080"));
    /**
     * roomInfo contient les informations de la salle :
     * {
     *   id: string,
     *   name: string,
     *   voteSkip: boolean,
     *   voteAdd: boolean,
     *   freeToShare: boolean,
     *   ownerClient: string | null
     * }
     */
    const [roomInfo, setRoomInfo] = React.useState(null);

    // TODO : connection du client pour definir si c'est le propriétaire ou pas
    //const clientId = localStorage.getItem("clientId");
    //const isOwner = roomInfo.ownerClient === clientId;


    // INITIALISATION DU SOCKET
    React.useEffect(() => {
        socket.on("connect", () => {
            console.log("WebSocket connecté");
            socket.emit("joinRoom", roomId);
        });

        setSocket(socket);

        return () => {
            socket.disconnect();
        };
    }, [roomId]);

    // RÉCUPÉRATION DES INFOS DE LA SALLE
    React.useEffect(() => {
        async function getData() {
            const response = await fetch(`http://localhost:8080/room/${roomId}`);
            if (response.ok) {
                const data = await response.json();
                setRoomInfo(data);
            } else {
                console.error("Erreur lors de la récupération des données de la salle");
            }
        }

        getData();
    }, [roomId]);

    // c'est invisible mais c'est pour éviter d'afficher la salle alors qu'elle n'est pas encore chargée
    if (!socket || !roomInfo) {
        return <div>Chargement de la salle...</div>;
    }

    return (
        <div className="room-container row">
            <BarPage roomName={roomInfo.name}
                     isAllowedToShare={
                    // TODO : vérifier si le client est le propriétaire
                    roomInfo.freeToShare
            }/>
            <div className="valign-wrapper main-content">
                <div className="left-container col s12 m6 l7">
                    <div className="video-container">
                        <YoutubeFrame videoId="xiyg1GuXd_Y" socket={socket} />
                    </div>
                    <div className="recommendation-container">
                        <RecommandationContent />
                    </div>
                </div>
                <div className="col s6 m6 l6 playlist-section">
                    <PlaylistContent />
                </div>
                <div>
                    <WebSocketChat socket={socket} />
                </div>
            </div>
        </div>
    );
}
export default Room;
