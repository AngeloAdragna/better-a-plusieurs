const RecommandationVideo = ({ title, thumbnail, url }) => {

    const truncate = (str, maxLength) => {
        return str.length > maxLength ? str.slice(0, maxLength - 3) + '...' : str;
    };

    return (
        <div className="video_recommand">
            <img
                src={thumbnail}
                alt={title}
                style={{ width: "70%", borderRadius: "20px" }}
            />
            <h5 className={"video_name"}>{truncate(title, 40)}</h5>
        </div>
    );
};

export default RecommandationVideo;
