import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import M from "materialize-css";
import { IoIosArrowForward } from "react-icons/io";

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

    // Collapse the sidebar with MaterializeCSS
    const [isCollapsed, setIsCollapsed] = useState(true);
    const handleLinkClick = () => {
        setIsCollapsed((prev) => !prev);
        const chatContainer = document.querySelector(".ChatContainer");
        if (chatContainer) {
            M.Collapsible.init(chatContainer, { accordion: false });
        }
    };

    return (
        <section className={`ChatContainer ${isCollapsed ? 'collapsed' : ''}`}> 
            <span onClick={handleLinkClick} className={`${isCollapsed ? 'rotate' : 'arrow'}`}> <IoIosArrowForward /></span>
            <div className="ChatContent">
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
                <button onClick={handleSend}>Envoyer</button>    </div>
        </section>
    );
};

export default WebSocketChat;