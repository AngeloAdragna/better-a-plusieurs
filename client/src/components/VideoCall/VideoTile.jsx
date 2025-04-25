import React, { useEffect, useRef } from 'react';

export default function VideoTile({ stream, muted }) {
    const videoRef = useRef(null);

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.srcObject = stream;
        }
    }, [stream]);

    return (
        <div className="video-tile">
            <video
                ref={videoRef}
                autoPlay
                playsInline
                muted={muted}
                style={{ width: '100%', height: 'auto', borderRadius: 8 }}
            />
        </div>
    );
}