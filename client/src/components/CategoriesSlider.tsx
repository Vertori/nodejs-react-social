import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import SliderCard from "../components/SliderCard";
import { recipesCategories } from "../lib/constants";

interface CategoriesSliderProps {
  fetchRecipesByCategory: (categoryName: string) => void;
}

const CategoriesSlider = ({
  fetchRecipesByCategory,
}: CategoriesSliderProps) => {
  return (
    <div className="py-8">
      <Swiper
        className="px-2 mx-2"
        modules={[Navigation]}
        loop={true}
        spaceBetween={10}
        loopAddBlankSlides={false}
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
                <SliderCard
                  category={category}
                  key={index}
                  fetchRecipesByCategory={fetchRecipesByCategory}
                />
              </SwiperSlide>
            );
          })}
        </div>
      </Swiper>
    </div>
  );
};

export default CategoriesSlider;
