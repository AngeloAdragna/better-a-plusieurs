const PlaylistVideo = ({ title, thumbnail, url }) => {
    const truncate = (str, maxLength) => {
        return str.length > maxLength ? str.slice(0, maxLength - 3) + '...' : str;
    };

    return (
        <div className="video_playlist valign-wrapper" style={{ padding: "0px", margin: 0 }}>
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
