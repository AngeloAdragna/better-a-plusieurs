import React, { useEffect, useRef, useState } from 'react';
import { ref, onValue } from 'firebase/database';
import { db } from '../../firebase';
import '../../styles/VideoSideBar.css';

const VideoSideBar = ({ roomId, localStreamRef, localUserId, remoteStreams }) => {
    const [users, setUsers] = useState({});
    const videoRefs = useRef({}); // Un objet pour garder les refs par UID

    useEffect(() => {
        const usersRef = ref(db, `rooms/${roomId}/users`);
        const unsubscribe = onValue(usersRef, (snapshot) => {
            setUsers(snapshot.val() || {});
        });
        return () => unsubscribe();
    }, [roomId]);

    // Met à jour les srcObject des vidéos distantes quand les flux changent
    useEffect(() => {
        Object.entries(remoteStreams || {}).forEach(([uid, stream]) => {
            if (videoRefs.current[uid] && videoRefs.current[uid].current) {
                videoRefs.current[uid].current.srcObject = stream;
            }
        });
    }, [remoteStreams]);

    return (
        <div className="video-sidebar">
            {/* Vidéo locale */}
            <div className="user-video-tile local-user">
                <video
                    ref={localStreamRef}
                    autoPlay
                    muted
                    playsInline
                    style={{ width: 160, height: 90, borderRadius: 8 }}
                />
                <div>
                    {users[localUserId]?.pseudo || "Moi"}
                    <span style={{ fontSize: "0.8em", color: "gray", marginLeft: 6 }}>
                        ({users[localUserId]?.status || "?"})
                    </span>
                </div>
            </div>

            {/* Vidéos distantes */}
            {Object.entries(users).map(([uid, user]) => {
                if (uid === localUserId) return null;

                // Crée la ref si elle n’existe pas encore
                if (!videoRefs.current[uid]) {
                    videoRefs.current[uid] = React.createRef();
                }

                return (
                    <div key={uid} className="user-video-tile">
                        <video
                            ref={videoRefs.current[uid]}
                            autoPlay
                            playsInline
                            style={{ width: 160, height: 90, borderRadius: 8 }}
                        />
                        <div>
                            {user?.pseudo || `Utilisateur ${uid.slice(0, 5)}`}
                            <span style={{ fontSize: "0.8em", color: "gray", marginLeft: 6 }}>
                                ({user?.status || "?"})
                            </span>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default VideoSideBar;
