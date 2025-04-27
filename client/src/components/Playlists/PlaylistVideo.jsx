const PlaylistVideo = ({ title, thumbnail, video, roomId, socket }) => {
    const truncate = (str, maxLength) => {
        return str.length > maxLength ? str.slice(0, maxLength - 3) + '...' : str;
    };

    return (
        <div className="video_playlist valign-wrapper" style={{ padding: "0px", margin: 0 }} onClick={() => socket.emit("selectVideo", {roomId: roomId, video: video})}>
            <div className="col s3" style={{padding: "0px"}}>
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
            <div className="col s9">
                <span className="video_name">
                    {truncate(title, 40)}
                </span>
            </div>
        </div>
    );
};

export default PlaylistVideo;
