import React from 'react';
import VideoTile from './VideoTile'; // ou adapte le chemin selon ton projet

export default function VisioSidebar({ localStream, remoteStreams }) {
    return (
        <div style={{
            width: '250px',
            padding: '10px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            backgroundColor: '#f0f0f0',
            borderLeft: '1px solid #ddd',
            overflowY: 'auto'
        }}>
            <VideoTile stream={localStream} muted />
            {Object.entries(remoteStreams).map(([uid, stream]) => (
                <VideoTile key={uid} stream={stream} muted={false} />
            ))}
        </div>
    );
}