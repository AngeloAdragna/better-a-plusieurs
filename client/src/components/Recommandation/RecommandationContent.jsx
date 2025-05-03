import React, { useState, useEffect } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import RecommandationVideo from './RecommandationVideo';
import { useParams } from "react-router-dom";
import { Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

function RecommandationContent({ roomInfo, socket, isAllowedToAdd }) {
  const { roomId } = useParams();

  const [accessToken, setAccessToken] = useState(null);
  const [videoList, setVideoList] = useState([]);
  const [currentSelectedVideo, setCurrentSelectedVideo] = useState(null);

  const login = useGoogleLogin({
    onSuccess: tokenResponse => setAccessToken(tokenResponse.access_token),
    scope: 'https://www.googleapis.com/auth/youtube.readonly',
  });

  useEffect(() => {
    const handleVoteEnded = ({ id, result }) => {
      if (!currentSelectedVideo) return;
      if (result) {
        socket.emit("videoAddedPlaylist", { roomId, video: currentSelectedVideo });
        setCurrentSelectedVideo(null);
      }
    };

    socket.on("voteEnded", handleVoteEnded);
    return () => {
      socket.off("voteEnded", handleVoteEnded);
    };
  }, [socket, currentSelectedVideo, roomId]);

  const handleVideoClick = (video) => {
    if (isAllowedToAdd) {
      socket.emit("videoAddedPlaylist", { roomId, video });
    } else {
      setCurrentSelectedVideo(video);
      socket.emit("startVote", {
        roomId,
        author: localStorage.getItem("username"),
        voteType: "add",
        videoName: video.title
      });
    }
  };

  useEffect(() => {
    if (!accessToken) return;

    const fetchSubscriptionsAndVideos = async () => {
      try {
        const subscriptionsResponse = await fetch(`https://www.googleapis.com/youtube/v3/subscriptions?part=snippet&mine=true&maxResults=10`, {
          method: 'GET',
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        const subscriptionsData = await subscriptionsResponse.json();

        const videos = await Promise.all(subscriptionsData.items.map(async (subscription) => {
          const channelId = subscription.snippet.resourceId.channelId;

          const videoResponse = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&order=date&maxResults=1`, {
            method: 'GET',
            headers: { Authorization: `Bearer ${accessToken}` },
          });

          const videoData = await videoResponse.json();

          if (videoData.items.length > 0) {
            const video = videoData.items[0];
            return {
              id: video.id.videoId,
              title: video.snippet.title,
              thumbnail: video.snippet.thumbnails.high.url,
            };
          }
          return null;
        }));

        const filteredVideos = videos.filter(video => video !== null);
        setVideoList(filteredVideos);
      } catch (error) {
        console.error('Erreur lors de la récupération des vidéos:', error);
      }
    };

    fetchSubscriptionsAndVideos();
  }, [accessToken, roomId]);

  return (
      <div>
        {!accessToken ? (
            <span className='btn-google-connexion' onClick={login} style={{ margin: '1rem' }}>
              Se connecter avec Google
            </span>
        ) : (
            <Swiper
                modules={[Navigation, Pagination]}
                spaceBetween={20}
                navigation
                pagination={{ clickable: true }}
                loop={true}
                breakpoints={{
                    480: { slidesPerView: 3 },
                    768: { slidesPerView: 4 },
                    1024: { slidesPerView: 5 }   // grands écrans
                }}
            >
              {videoList.map((video, i) => (
                  <SwiperSlide key={i} onClick={() => handleVideoClick(video)}>
                    <RecommandationVideo
                        title={video.title}
                        thumbnail={video.thumbnail}
                    />
                  </SwiperSlide>
              ))}
            </Swiper>
        )}
      </div>
  );
}

export default RecommandationContent;
