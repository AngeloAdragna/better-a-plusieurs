import React, {useEffect, useState} from "react";
import YouTube from "react-youtube";


const VideoPlayer = ({ videoId, socket }) => {
    const [player, setPlayer] = useState(null)
    const [isPlaying, setIsPlaying] = useState(false);


    const opts = {
        height: "390",
        width: "661",
        playerVars: {
            autoplay: 1,    // Auto
            //mute: 1         // the only current way to enable autoplay in navigator
                            // I have to find a solution
            // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
            // !!!!! You have to enable "video and audio" into your navigator to enable autoplay with sound !!!!!
            // !!!!! without doing this, it won't work                                                      !!!!!
            // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        },
    };

    const onReady = (event) => {
        setPlayer(event.target);
    };

    const onStateChange = (event) => {
        if (!player) return;

        const state = event.data;
        if (state === 2) {
            // If the video is set to pause
            console.log(`Pause : state = ${state}`);
            socket.emit("pause", player.getCurrentTime());
        } else if (state === 1 && !isPlaying) {
            // If the video is set to play and wasn't playing yet
            console.log(`Play : state = ${state}`);
            socket.emit("play", player.getCurrentTime());
        }
    };

    useEffect(() => {
        const handlePause = (time) => {
            if (player) {
                player.pauseVideo();
                player.seekTo(time, true)   // Sync timecodes
                setIsPlaying(false)
            }
        };

        const handlePlay = (time) => {
            if (player && !isPlaying) {
                player.playVideo()
                player.seekTo(time, true)   // Sync timecodes
                setIsPlaying(true)
            }
        };

        socket.on("pause", handlePause);
        socket.on("play", handlePlay);

        return () => {
            socket.off("pause", handlePause);
            socket.off("play", handlePlay);
        };
    }, [player]);

    return <YouTube videoId={videoId} opts={opts} onReady={onReady} onStateChange={onStateChange} />
};

export default VideoPlayer;
