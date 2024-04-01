import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import SliderCard from "../components/SliderCard";
import { recipesCategories } from "../lib/constants";

const Home = () => {
  return (
    <section className="mt-[82px] container mx-auto">
      <div className="py-8">
        <Swiper
          className="py-2"
          modules={[Navigation]}
          loop={true}
          spaceBetween={10}
          slidesPerView={1}
          slidesPerGroup={1}
          navigation={true}
          breakpoints={{
            768: {
              slidesPerView: 3,
              slidesPerGroup: 2,
            },
            1024: {
              slidesPerView: 4,
              slidesPerGroup: 2,
            },
            1440: {
              slidesPerView: 6,
              slidesPerGroup: 2,
            },
          }}
        >
          <div className="flex">
            {recipesCategories.map((category, index) => {
              return (
                <SwiperSlide key={index}>
                  <SliderCard category={category} key={index} />
                </SwiperSlide>
              );
            })}
          </div>
        </Swiper>
      </div>
    </section>
  );
};

export default Home;
