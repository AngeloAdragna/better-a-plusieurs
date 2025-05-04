import React from "react";
import { joinRoom } from '../../service/roomService';
import { AuthContext } from '../../context/AuthContext';
import ChatBox from "../ChatBox.jsx";
import BarPage from "../BarPage/BarPage.jsx";
import { GoogleOAuthProvider } from '@react-oauth/google';
import RecommandationContent from "../Recommandation/RecommandationContent.jsx";
import PlaylistContent from "../Playlists/PlaylistContent.jsx";
import "../../styles/Room.css";
import { useParams } from "react-router-dom";
import YoutubeFrame from "../Youtube/YoutubeFrame.jsx";
import YoutubeSearchBar from "../Youtube/YoutubeSearchBar.jsx";
import { io } from "socket.io-client"
import VideoCall from "../VideoCall/VideoCall.jsx";
import {useSocket} from "../SocketContext.jsx";
import VoteBox from "../VoteBox.jsx";

function Room() {
    const { roomId } = useParams();
    const socket = useSocket();
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

    const clientId = React.useMemo(() => {
        let id = localStorage.getItem("clientId");
        if (!id) {
            id = crypto.randomUUID(); // Génère un ID unique
            localStorage.setItem("clientId", id);
        }
        return id;
    }, []);

    // TODO : connexion du client pour definir si c'est le propriétaire ou pas
    //const clientId = localStorage.getItem("clientId");
    //const isOwner = roomInfo.ownerClient === clientId;

    const { isConnected } = React.useContext(AuthContext);

    React.useEffect(() => {
        if (!socket) return;
        localStorage.setItem("roomId", roomId);
        socket.emit("joinRoom", roomId);

        const username = localStorage.getItem("username") || "Anonyme";
        const clientId = localStorage.getItem("clientId");
        if (clientId && username) {
            joinRoom(roomId, clientId, username);
        }
    }, [roomId, socket]);


    // RÉCUPÉRATION DES INFOS DE LA SALLE
    React.useEffect(() => {
        async function getData() {
            const response = await fetch(`http://localhost:8080/room/${roomId}`);
            if (response.ok) {
                const data = await response.json();
                console.log("Données reçues de la room :", data);
                setRoomInfo(data);
            } else {
                console.error("Erreur lors de la récupération des données de la salle");
            }
        }
        getData();
    }, [roomId]);

    const startVoteTest = () => {
        socket.emit("startVote", { roomId, author: "test", voteType: "add", videoName: "Michou" });
        console.log ("Vote lancé");
    }

    // c'est invisible mais c'est pour éviter d'afficher la salle alors qu'elle n'est pas encore chargée
    if (!socket || !roomInfo) {
        return <div>Chargement de la salle...</div>;
    }

    // Ajout de la récupération du username pour le passer à VideoCall
    const username = localStorage.getItem("username") || "Anonyme";

    return (
        <div className="room-container row">
            <BarPage roomName={roomInfo.name}
                     roomId={roomId}
                     socket={socket}
                     isAllowedToShare={
                         // TODO : vérifier si le client est le propriétaire
                         roomInfo.freeToShare
                     }
            />
            <div className="valign-wrapper main-content">
                <div className="left-container col s12 m6 l7">
                    <div className="video-container">
                        <YoutubeFrame roomId={roomId} video={{ title: "Fatal Bazooka &quot;Fous Ta Cagoule&quot; HD", thumbnail: "https://i.ytimg.com/vi/PI9yKr39vGI/mqdefault.jpg", id: "PI9yKr39vGI" }} socket={socket} />
                    </div>
                    <div className="recommendation-container">{/* Recommandations */}
                        <GoogleOAuthProvider clientId="261173889792-5lnsehpl504t0g1an722duv93n0mfhv1.apps.googleusercontent.com">
                            <RecommandationContent />
                        </GoogleOAuthProvider>
                    </div>
                </div>
                <div className="room-container row" style={{ display: 'flex' }}>
                    <div style={{ flex: 1 }}>
                        Vidéo
                    </div>
                    <VideoCall roomId={roomId} userId={clientId} username={username} />
                </div>
                <div className="col s6 m6 l6 playlist-section">{/* playlist */}
                    <PlaylistContent roomInfo={roomInfo} roomId={roomId} socket={socket}/>
                </div>
                <div >{/* Chat */}
                    <ChatBox roomId={roomId} socket={socket} /> {/* Chat */}
                </div>
            </div>
            <VoteBox roomId={roomId} socket={socket} />
            <button onClick={startVoteTest}></button>
        </div>
    );
}
export default Room;
