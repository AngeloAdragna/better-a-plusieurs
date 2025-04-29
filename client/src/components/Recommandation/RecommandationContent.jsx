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

function RecommandationContent({ roomInfo }) {
  const { roomId } = useParams();

  const [accessToken, setAccessToken] = useState(null);
  const [videoList, setVideoList] = useState([]);

  const login = useGoogleLogin({
    onSuccess: tokenResponse => setAccessToken(tokenResponse.access_token),
    scope: 'https://www.googleapis.com/auth/youtube.readonly',
  });

  useEffect(() => {
    if (!accessToken) return;

    const fetchSubscriptionsAndVideos = async () => {
      try {
        const subscriptionsResponse = await fetch(`https://www.googleapis.com/youtube/v3/subscriptions?part=snippet&mine=true&maxResults=10`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const subscriptionsData = await subscriptionsResponse.json();

        const videos = await Promise.all(subscriptionsData.items.map(async (subscription) => {
          const channelId = subscription.snippet.resourceId.channelId;

          const videoResponse = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&order=date&maxResults=1`, {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
          const videoData = await videoResponse.json();

          if (videoData.items.length > 0) {
            const video = videoData.items[0];
            return {
              title: video.snippet.title,
              thumbnail: video.snippet.thumbnails.high.url,
              url: `https://www.youtube.com/watch?v=${video.id.videoId}`,
            };
          }

          return null;
        }));

        const filteredVideos = videos.filter(video => video !== null);

        setVideoList(filteredVideos);
        console.log('Liste de vidéos recommandées:', filteredVideos);
      } catch (error) {
        console.error('Erreur lors de la récupération des vidéos:', error);
      }
    };

    fetchSubscriptionsAndVideos();
  }, [accessToken, roomId]);

  return (
      <div>
        {!accessToken ? (
            <button onClick={() => login()} style={{ margin: '1rem' }}>
              Se connecter avec Google
            </button>
        ) : (
            <Swiper
                modules={[Navigation, Pagination]}
                spaceBetween={20}
                slidesPerView={4}
                navigation
                pagination={{ clickable: true }}
                loop={true}
            >
              {videoList.map((video, i) => (
                  <SwiperSlide key={i}>
                    <RecommandationVideo
                        title={video.title}
                        thumbnail={video.thumbnail}
                        url={video.url}
                    />
                  </SwiperSlide>
              ))}
            </Swiper>
        )}
      </div>
  );
}

export default RecommandationContent;
