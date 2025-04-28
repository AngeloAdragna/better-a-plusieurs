import {useEffect, useState} from "react";
import "../styles/NotificationZone.css";
const NotificationZone = ({ socket, roomId }) => {
    const [notification, setNotification] = useState([]);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (!socket) return;

        const handleJoin = (username) => {
            if (!username) return;
            if (notification.includes(`🔜  ${username} a rejoint la room`)) return;
            setNotification((prev) => [...prev, `🔜  ${username} a rejoint la room` ]);
            setIsVisible(true);
            setTimeout(() => {
                setIsVisible(false);
            }, 5000);
            setTimeout(() => {
                setNotification((prev) => prev.filter((_, index) => index !== 0));
            }, 6000);
        };

        const handleLeave = (username) => {
            if (!username) return;
            setNotification((prev) => [...prev, `🔙 ${username} a quitté la room` ]);
            setIsVisible(true);
            setTimeout(() => {
                setIsVisible(false);
            }, 5000);
            setTimeout(() => {
                setNotification((prev) => prev.filter((_, index) => index !== 0));
            }, 6000);
        }

        socket.on("userJoined", handleJoin);
        socket.on("userLeft", handleLeave);

        return () => {
            socket.off("userJoined", handleJoin);
        };
    }, [socket]);

    return (
        <div className={`notification-zone ${isVisible ? "visible" : ""}`}>
            {notification.map((notif, index) => (
                <div key={index} className="notification">
                    {notif}
                </div>
            ))}
        </div>
    );

}

export default NotificationZone;