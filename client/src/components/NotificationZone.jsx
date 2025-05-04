import { useEffect, useState } from "react";
import "../styles/NotificationZone.css";

const sounds = {
    join: new Audio("/src/assets/sounds/join.mp3"),
    leave: new Audio("/src/assets/sounds/leave.mp3"),
    added: new Audio("/src/assets/sounds/common.mp3"),
    deleted: new Audio("/src/assets/sounds/common.mp3"),
    selected: new Audio("/src/assets/sounds/common.mp3"),
};

const NotificationZone = ({ socket }) => {
    const [notification, setNotification] = useState([]);
    const [isVisible, setIsVisible] = useState(false);

    const showNotification = (text, soundKey) => {
        if (!text || notification.includes(text)) return;
        console.log("🔔 Nouvelle notification :", text);
        setNotification((prev) => [...prev, text]);
        setIsVisible(true);

        // 🔊 Joue le son associé
        if (soundKey && sounds[soundKey]) {
            sounds[soundKey].currentTime = 0; // recommence depuis le début
            sounds[soundKey].play();
        }

        setTimeout(() => setIsVisible(false), 5000);
        setTimeout(() => {
            setNotification((prev) => prev.filter((_, index) => index !== 0));
        }, 6000);
    };

    useEffect(() => {
        if (!socket) return;

        const handleJoin = (username) => {
            if (!username) return;
            showNotification(`🔜 ${username} a rejoint la room`, "join");
        };

        const handleLeave = (username) => {
            if (!username) return;
            showNotification(`🔙 ${username} a quitté la room`, "leave");
        };

        const handleVideoAdded = (video) => {
            if (!video?.title) return;
            showNotification(`🔜 ${video.title} a été ajouté à la playlist`, "added");
        };

        const handleVideoDeleted = (video) => {
            if (!video?.title) return;
            showNotification(`🔙 ${video.title} a été supprimé de la playlist`, "deleted");
        };

        const handleVideoSelected = (video) => {
            if (!video?.title) return;
            showNotification(`🔜 ${video.title} a été sélectionné`, "selected");
        };

        socket.on("userJoined", handleJoin);
        socket.on("userLeft", handleLeave);
        socket.on("videoAddedPlaylist", handleVideoAdded);
        socket.on("videoDeletedPlaylist", handleVideoDeleted);
        socket.on("selectVideo", handleVideoSelected);

        return () => {
            socket.off("userJoined", handleJoin);
            socket.off("userLeft", handleLeave);
            socket.off("videoAddedPlaylist", handleVideoAdded);
            socket.off("videoDeletedPlaylist", handleVideoDeleted);
            socket.off("selectVideo", handleVideoSelected);
        };
    }, [socket, notification]);

    return (
        <div className={`notification-zone ${isVisible ? "visible" : ""}`}>
            {notification.map((notif, index) => (
                <div key={index} className="notification">
                    {notif}
                </div>
            ))}
        </div>
    );
};

export default NotificationZone;
