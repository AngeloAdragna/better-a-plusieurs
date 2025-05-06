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
        <div className="video_playlist valign-wrapper">
            <div className="col s2" style={{padding: "5px 0px 5px 0px"}} onClick={handlePlayVideo} >
                <img
                    src={thumbnail}
                    alt={title}
                    style={{
                        width: "100%",
                        height: "90%",
                        objectFit: "cover",
                        display: "block",
                        borderRadius: "10px"
                    }}
                />
            </div>
            <div className="col s8 title" onClick={handlePlayVideo}>
                <span className="video_name">
                    {truncate(title, 40)}
                </span>
            </div>
        
            <div className="col s2">
            {isPlaylistItem && (
                <button className="btn-flat" onClick={() => handleDeleteVideoFromPlaylist(video)}>
                    ✖
                </button>
            )}
            </div>
        </div>
       
    );
};

export default PlaylistVideo;
