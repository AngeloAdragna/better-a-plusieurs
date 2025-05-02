import React, {useEffect, useState} from "react";
import YouTube from "react-youtube";


const VideoPlayer = ({ roomId, video, socket, height = "390", width = "661" }) => {
    const [player, setPlayer] = useState(null)
    const [currentVideo, setCurrentVideo] = useState(video)
    const [_, setIntervalId] = useState(null)
    const [isPlaying, setIsPlaying] = useState(false);
    const [syncPeriod] = useState(2000); // 2 seconds
    const [isTimerRunning, setIsTimerRunning] = useState(false)
    const [authorizedTimeDelta] = useState(2);
    const [videoAlreadyAddedToHistory, setVideoAlreadyAddedToHistory] = useState(false);




    const opts = {
        height: height,
        width: width,
        playerVars: {
            autoplay: 0,        // Not Auto

            // to enable it manually
            // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
            // !!!!! You have to enable "video and audio" into your navigator to enable autoplay with sound !!!!!
            // !!!!! without doing this, it won't work                                                      !!!!!
            // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        },
    };


    const onReady = (event) => {
        setPlayer(event.target);
    };

    const setPeriodicSync = () => {
        // will call the useEffect because it is asynchronous
        setIsTimerRunning(true)
    }

    const cancelPeriodicSync = () => {
        // will call the useEffect because it is asynchronous
        setIsTimerRunning(false)
    }

    const checkAndAddToHistory = (roomId, video) => {
        if (!videoAlreadyAddedToHistory) {
            socket.emit("videoAddedHistory", {roomId, video})
            setVideoAlreadyAddedToHistory(true)
        }
    }

    const onStateChange = (event) => {
        if (!player) return;

        const state = event.data;
        if (state === 0) {
            // La vidéo est terminée
            console.log("Vidéo terminée");
            cancelPeriodicSync();
            setIsPlaying(false);
            socket.emit("videoEnded", roomId)
        }
        if (state === 2) {
            // If the video is set to pause
            // Disable periodic sync
            //console.log(`Disable periodic sync`) // DEBUG
            cancelPeriodicSync()

            // console.log(`Pause : state = ${state}`);
            socket.emit("pause", {roomId: roomId, timeCode: player.getCurrentTime()});

        } else if (state === 1 && !isPlaying) {
            // If the video is set to play and wasn't playing yet
            //console.log(`Play : state = ${state}, ID DE VIDEO = ${currentVideo.id}`); // DEBUG
            socket.emit("play", {roomId: roomId, timeCode: player.getCurrentTime(), video: currentVideo});
            // Enable periodic sync
            setPeriodicSync()
            checkAndAddToHistory(roomId, currentVideo)
        }
    };

    useEffect(() => {
        const handlePause = (time) => {
            if (player) {
                cancelPeriodicSync()        // We don't want to synchronise every x seconds when paused
                player.pauseVideo();
                player.seekTo(time, true)   // Sync timecodes
                setIsPlaying(false)
            }
        };

        const handlePlay = (time, video) => {
            //console.log(`ID DE LA VIDEO : ${videoId}`)    // DEBUG
            if (player && !isPlaying) {
                setPeriodicSync()           // We want to restart the periodic synchronization
                player.playVideo()
                player.seekTo(time, true)   // Sync timecodes
                setIsPlaying(true)
                if (video.id !== currentVideo.id) {
                    changeVideo(video)
                }
                checkAndAddToHistory(currentVideo)
            }
        };

        const syncTimeCode = (timeCode, video) => {
            if (player) {
                if (video.id !== currentVideo.id) {
                    changeVideo(video)
                }

                const currentLocalTime = player.getCurrentTime()
                // console.log(`Current difference = ${Math.abs(currentLocalTime - timeCode)}`) // DEBUG

                // Synchronize timecode only if the difference is higher than allowed
                if (Math.abs(currentLocalTime - timeCode) > authorizedTimeDelta) {
                    player.seekTo(timeCode, true)
                }
            }
        }

        const changeVideo = (newVideo) => {
            console.log(`Nouvel Id de video : ${newVideo.id}`)
            setCurrentVideo(newVideo)
            if(player) {
                player.seekTo(0, true)
            }
            cancelPeriodicSync()
            setVideoAlreadyAddedToHistory(false)

        }

        socket.on("pause", handlePause);
        socket.on("play", handlePlay);
        socket.on("sync", syncTimeCode);
        socket.on("selectVideo", changeVideo);

        return () => {
            socket.off("pause", handlePause);
            socket.off("play", handlePlay);
            socket.off("sync", syncTimeCode);
            socket.off("selectVideo", changeVideo);
        };
    }, [player, isPlaying, socket]);

    useEffect(() => {
        if(!isTimerRunning) return;

        //console.log(`Enable periodic sync`); // DEBUG

        // Set the interval (periodic sync)
        const newIntervalId = setInterval(() => {
            if (player) {
                console.log(`Sync : timecode = ${player.getCurrentTime()}`); // DEBUG
                socket.emit("sync", {roomId: roomId, timeCode: player.getCurrentTime(), video: currentVideo});
            }
        }, syncPeriod);

        setIntervalId(newIntervalId);

        return () => clearInterval(newIntervalId);

    }, [isTimerRunning]);

    return <YouTube videoId={currentVideo.id} opts={opts} onReady={onReady} onStateChange={onStateChange} />
};

export default VideoPlayer;
