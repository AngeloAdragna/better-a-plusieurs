import React from "react";

const PlaylistVideo = ({ title, thumbnail, video, roomId, socket, isPlaylistItem}) => {
    const truncate = (str, maxLength) => {
        return str.length > maxLength ? str.slice(0, maxLength - 3) + '...' : str;
    };

    const handleDeleteVideoFromPlaylist = (video) => {
        socket.emit("videoDeletedPlaylist", {roomId: roomId, video: video})
    }

    return (
        <div className="video_playlist valign-wrapper" style={{ padding: "0px", margin: 0 , cursor: "pointer"}}>
            <div className="infos" onClick={() => socket.emit("selectVideo", {roomId: roomId, video: video})}>
                <div className="col s3" style={{padding: "5px"}}>
                    <img
                        src={thumbnail}
                        alt={title}
                        className="responsive-img"
                        style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            display: "block",
                            borderRadius: "10px"
                        }}
                    />
                </div>
                <div className="col s9 title">
                    <span className="video_name">
                        {truncate(title, 40)}
                    </span>
                </div>
            </div>
            {isPlaylistItem && (
            <div className="col s2">
                <button className="btn-flat" onClick={() => handleDeleteVideoFromPlaylist(video)}>
                    ✖
                </button>
            </div>
            )}
        </div>
    );
};

export default PlaylistVideo;
