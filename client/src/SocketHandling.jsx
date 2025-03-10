import { useEffect } from 'react';
import { initSocket } from './socket/socket';

const SocketHandling = () => {
    useEffect(() => {
        const socket = initSocket();

        if (!socket){
            console.log("connard ça marche pas")
            return
        } else {
            console.log("ça marche")
        }

        socket.on("connect", () => {
            console.log("Connecté au serveur WebSocket !");
        });

        socket.on("chat message", (message) => {
            console.log("Message reçu :", message);
        });

        return () => {
            if (socket) {
                socket.disconnect(); // Ferme la connexion proprement
            }
        };
    }, []);

    return <div>Socket Handling</div>;
};

export default SocketHandling;