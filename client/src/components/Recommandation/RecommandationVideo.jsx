const RecommandationVideo = ({ title, thumbnail, url }) => {

    const truncate = (str, maxLength) => {
        return str.length > maxLength ? str.slice(0, maxLength - 3) + '...' : str;
    };

    return (
        <div className="video_recommand">
            <img
                src={thumbnail}
                alt={title}
                style={{ width: "60%", borderRadius: "10px" }}
            />
            <div className={"video_name"}>{truncate(title, 40)}</div>
        </div>
    );
};

export default RecommandationVideo;
