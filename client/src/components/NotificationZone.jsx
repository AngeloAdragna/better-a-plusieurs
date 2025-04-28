import { useEffect, useState } from "react";
import "../styles/NotificationZone.css";

const NotificationZone = ({ socket }) => {
    const [notification, setNotification] = useState([]);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (!socket) return;

        const showNotification = (text) => {
            if (!text || notification.includes(text)) return;
            console.log("🔔 Nouvelle notification :", text);
            setNotification((prev) => [...prev, text]);
            setIsVisible(true);

            setTimeout(() => setIsVisible(false), 5000);
            setTimeout(() => {
                setNotification((prev) => prev.filter((_, index) => index !== 0));
            }, 6000);
        };

        const handleJoin = (username) => {
            if (!username) return;
            showNotification(`🔜 ${username} a rejoint la room`);
        };

        const handleLeave = (username) => {
            if (!username) return;
            showNotification(`🔙 ${username} a quitté la room`);
        };

        const handleVideoAdded = (video) => {
            if (!video?.title) return;
            showNotification(`🔜 ${video.title} a été ajouté à la playlist`);
        };

        const handleVideoDeleted = (video) => {
            if (!video?.title) return;
            showNotification(`🔙 ${video.title} a été supprimé de la playlist`);
        };

        const handleVideoSelected = (video) => {
            if (!video?.title) return;
            showNotification(`🔜 ${video.title} a été sélectionné`);
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
