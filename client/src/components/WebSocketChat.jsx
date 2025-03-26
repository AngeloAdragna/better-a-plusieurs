import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import "../styles/WebSocketChat.css";


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

      // Collapse the sidebar
      const [isCollapsed, setIsCollapsed] = useState(true);
      const handleLinkClick = () => {
          setIsCollapsed((prev) => !prev);
      };

    return (
        <section className={`ChatContainer ${isCollapsed ? 'collapsed' : ''}`}>
            <span onClick={handleLinkClick} className={`${isCollapsed ? 'rotate' : 'arrow'}`}>V</span>
            <div className={`ChatContent`}>
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
        </section>
    );
};

export default WebSocketChat;