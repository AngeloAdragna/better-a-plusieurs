import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation, Pagination } from 'swiper/modules';
import PlaylistVideo from "./PlaylistVideo.jsx"; 

const videoPlaylist = [
    { title: "Vidéo 1", thumbnail: "https://i.ytimg.com/vi/ScMzIvxBSi4/hqdefault.jpg", url: "https://www.youtube.com/watch?v=ScMzIvxBSi4" },
    { title: "Vidéo 2", thumbnail: "https://i.ytimg.com/vi/ysz5S6PUM-U/hqdefault.jpg", url: "https://www.youtube.com/watch?v=ysz5S6PUM-U" },
    { title: "Vidéo 3", thumbnail: "https://i.ytimg.com/vi/aqz-KE-bpKQ/hqdefault.jpg", url: "https://www.youtube.com/watch?v=aqz-KE-bpKQ" },
    { title: "Vidéo 4", thumbnail: "https://i.ytimg.com/vi/e-ORhEE9VVg/hqdefault.jpg", url: "https://www.youtube.com/watch?v=e-ORhEE9VVg" },
    { title: "Vidéo 5", thumbnail: "https://i.ytimg.com/vi/lTTajzrSkCw/hqdefault.jpg", url: "https://www.youtube.com/watch?v=lTTajzrSkCw" },
    { title: "Vidéo 6", thumbnail: "https://i.ytimg.com/vi/lTTajzrSkCw/hqdefault.jpg", url: "https://www.youtube.com/watch?v=lTTajzrSkCw" },
    { title: "Vidéo 7", thumbnail: "https://i.ytimg.com/vi/lTTajzrSkCw/hqdefault.jpg", url: "https://www.youtube.com/watch?v=lTTajzrSkCw" },
    { title: "Vidéo 8", thumbnail: "https://i.ytimg.com/vi/lTTajzrSkCw/hqdefault.jpg", url: "https://www.youtube.com/watch?v=lTTajzrSkCw" }
];

function PlaylistContent() {
    const { roomId } = useParams();  // Récupère l'ID de la room depuis l'URL
    const [isSelected, setisSelected] = useState(true);
    const handleLinkClick = () => {
        setisSelected((prev) => !prev);
    };

    return (
        <section className='PlaylistContent'>
            <div className="SelectionBar">
                <span onClick={handleLinkClick} className={`button ${isSelected ? 'down' : 'up'}`}>History</span>
                <span onClick={handleLinkClick} className={`button ${isSelected ? 'up' : 'down'}`}>Playlist</span>
            </div>
            <div className={`ContentPlaylistHistory ${isSelected ? 'desactived' : ''}`}>
            <Swiper
                modules={[Pagination]}
                direction="vertical"
                spaceBetween={10}
                slidesPerView="auto"
                pagination={{ clickable: true }}
                freeMode={true} // permet de scroller librement
                >
                {videoPlaylist.map((video, i) => (
                    <SwiperSlide
                    key={i}
                    style={{
                        height: "auto", // important pour s’adapter au contenu
                        paddingBottom: "10px"
                    }}
                    >
                    <PlaylistVideo
                        title={video.title}
                        thumbnail={video.thumbnail}
                        url={video.url}
                    />
                    </SwiperSlide>
                ))}
            </Swiper>

            </div>
            <div className={`ContentPlaylistHistory ${isSelected ? '' : 'desactived'}`}>
                Les vidéos dans l'historique
            </div>
        </section>
    );
}

export default PlaylistContent;
