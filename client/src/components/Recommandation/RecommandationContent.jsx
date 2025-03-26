import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import RecommandationVideo from './RecommandationVideo.jsx';
import { Navigation, Pagination } from 'swiper/modules';

const videoList = [
    {
        title: "Vidéo 1 ddddddd dddddddddddddddd ddddddddddd ddddddddddd sssssssssssss",
        thumbnail: "https://i.ytimg.com/vi/ScMzIvxBSi4/hqdefault.jpg",
        url: "https://www.youtube.com/watch?v=ScMzIvxBSi4"
    },
    {
        title: "Vidéo 2",
        thumbnail: "https://i.ytimg.com/vi/ysz5S6PUM-U/hqdefault.jpg",
        url: "https://www.youtube.com/watch?v=ysz5S6PUM-U"
    },
    {
        title: "Vidéo 3",
        thumbnail: "https://i.ytimg.com/vi/aqz-KE-bpKQ/hqdefault.jpg",
        url: "https://www.youtube.com/watch?v=aqz-KE-bpKQ"
    },
    {
        title: "Vidéo 4",
        thumbnail: "https://i.ytimg.com/vi/e-ORhEE9VVg/hqdefault.jpg",
        url: "https://www.youtube.com/watch?v=e-ORhEE9VVg"
    },
    {
        title: "Vidéo 5",
        thumbnail: "https://i.ytimg.com/vi/lTTajzrSkCw/hqdefault.jpg",
        url: "https://www.youtube.com/watch?v=lTTajzrSkCw"
    }
];

function RecommandationContent() {

    const nbrRecommendation = 50;

    // TODO : fetch real recommandation array based on master's subscription
    // If the master is not subscribed, fetch the most popular videos on youtube via the youtube API

    return (
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
    );
}

export default RecommandationContent;
