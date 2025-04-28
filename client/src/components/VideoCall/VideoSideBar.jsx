import React, { useEffect, useState } from 'react';
import { ref, onValue } from 'firebase/database';
import { db } from '../../firebase';
import '../../styles/VideoSideBar.css';

const VideoSideBar = ({ roomId, localStreamRef, localUserId }) => {
    const [users, setUsers] = useState({});

    useEffect(() => {
        const usersRef = ref(db, `rooms/${roomId}/users`);
        const unsubscribe = onValue(usersRef, (snapshot) => {
            setUsers(snapshot.val() || {});
        });
        return () => unsubscribe();
    }, [roomId]);

    return (
        <div className="video-sidebar">
            {/* Vidéo locale */}
            <div className="user-video-tile">
                <video
                    ref={localStreamRef}
                    autoPlay
                    muted
                    playsInline
                    style={{ width: 160, height: 90, borderRadius: 8 }}
                />
                <div>Moi</div>
            </div>

            {/* Vidéos distantes */}
            {Object.entries(users).map(([uid, user]) => (
                uid !== localUserId && ( // <--- ajoute cette condition
                    <div key={uid} className="user-video-tile">
                        <video
                            id={`video-${uid}`}
                            autoPlay
                            playsInline
                            style={{ width: 160, height: 90, borderRadius: 8 }}
                        />
                        <div>{user.pseudo}</div>
                    </div>
                )
            ))}
        </div>
    );
};

export default VideoSideBar;