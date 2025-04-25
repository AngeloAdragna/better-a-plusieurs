import React from 'react';
import VideoTile from './VideoTile'; // ou adapte le chemin selon ton projet
import '../../styles/VideoSideBar.css';

export default function VisioSidebar({ localStream, remoteStreams }) {
    return (
        <div className="video-sidebar">
            <VideoTile stream={localStream} muted />
            {Object.entries(remoteStreams).map(([uid, stream]) => (
                <VideoTile key={uid} stream={stream} muted={false} />
            ))}
        </div>
    );
}