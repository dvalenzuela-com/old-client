import { Swiper, SwiperRef, SwiperSlide, useSwiper } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import CategorySwiperSlide from "./CategorySwiperSlide";
import { useEffect, useRef } from 'react';

export type HeaderData = {
    id: string;
    title: string;
}

type CategorySwiperProps = {
    categories: HeaderData[];
    activeCategoryId: string;
    onSwipeTo: (categoryId: string) => void;
}


const CategorySwiper = (props: CategorySwiperProps) => {
    const { categories, activeCategoryId, onSwipeTo } = props;

    const swiperRef = useRef<SwiperRef>(null);

    useEffect(() => {
        const index = categories.findIndex(cat => cat.id === activeCategoryId) ?? 0;
        swiperRef.current?.swiper.slideTo(index);
    }, [activeCategoryId]);

    const handleSlideChange = (newIndex: number) => {
        onSwipeTo(categories[newIndex].id);
        
    }

    return (
        <>
            <Swiper
                centeredSlides={true}
                spaceBetween={16}
                slidesPerView={'auto'}
                onSlideChange={(swiper) => {handleSlideChange(swiper.activeIndex)}}
                ref={swiperRef}
            >
                {categories.map((category) => (
                    <SwiperSlide style={{width: 'auto'}}>
                        {({ isActive, isVisible }) => {
                            return <CategorySwiperSlide title={category.title} active={isActive} />
                        }}
                    </SwiperSlide>
                ))}
            </Swiper>
        </>
    );
}

export default CategorySwiper;
