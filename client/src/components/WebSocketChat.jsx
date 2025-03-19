import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:8080"); // Connexion au serveur

const WebSocketChat = () => {
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        socket.on("message", (data) => {
            setMessages((prev) => [...prev, data]);
        });

        return () => socket.off("message");
    }, []);

    const handleSend = () => {
        if (message.trim()) {
            socket.emit("message", message);
            setMessage("");
        }
    };

    return (
        <div>
            <h2>Chat en temps réel</h2>
            <div>
                {messages.map((msg, index) => (
                    <div key={index}>{msg}</div>
                ))}
            </div>
            <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Message..."
            />
            <button onClick={handleSend}>Envoyer</button>
        </div>
    );
};

export default WebSocketChat;