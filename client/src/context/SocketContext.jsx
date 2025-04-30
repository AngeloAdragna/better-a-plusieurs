import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext(null);

export function useSocket() {
    return useContext(SocketContext);
}

export function SocketProvider({ children }) {
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const newSocket = io("http://localhost:8080");
        setSocket(newSocket);

        newSocket.on("connect", () => {
            console.log("✅ WebSocket connecté :", newSocket.id);

            const username = localStorage.getItem("username");
            const roomId = localStorage.getItem("roomId");

            if (username) {
                newSocket.emit("userConnected", username);
                console.log("🔄 Username renvoyé :", username);
            }
            if (roomId) {
                newSocket.emit("joinRoom", roomId);
                console.log("🔄 Room rejointe :", roomId);
            }
        });

        return () => newSocket.disconnect();
    }, []);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
}
