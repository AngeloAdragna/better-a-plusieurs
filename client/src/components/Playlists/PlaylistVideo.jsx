import React, {useEffect, useState} from "react";

const PlaylistVideo = ({ title, thumbnail, video, roomId, socket, isPlaylistItem, isAllowedToAdd}) => {
    const [isAddVote, setIsAddVote] = useState(false)
    const truncate = (str, maxLength) => {
        return str.length > maxLength ? str.slice(0, maxLength - 3) + '...' : str;
    };

    const handleDeleteVideoFromPlaylist = (video) => {
        socket.emit("videoDeletedPlaylist", {roomId: roomId, video: video})
    }

    const handlePlayVideo = () => {
        console.log("Vote to skip")

        if (isAllowedToAdd) {
            socket.emit("selectVideo", {roomId : roomId, video: video})
        }
        else {
            setIsAddVote(true)
            socket.emit("startVote", { roomId, author: localStorage.getItem("username"), voteType: "add", videoName: video.title });
        }

    }

    useEffect(() => {
        const handleSelectVideo = ({id, result}) => {
            //console.log(`Result = ${result}`)
            if(isAddVote) {
                if (result) socket.emit("selectVideo", {roomId: roomId, video: video})
                setIsAddVote(false)
            }
        }

        socket.on("voteEnded", handleSelectVideo)
        return () => {
            socket.off("voteEnded", handleSelectVideo);
        };
    }, [socket, isAddVote]);

    return (
        <div className="video_playlist valign-wrapper" style={{ padding: "0px", margin: 0 , cursor: "pointer"}}>
            <div className="infos" onClick={handlePlayVideo}>
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
