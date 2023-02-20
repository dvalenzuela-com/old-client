import { Swiper, SwiperRef, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import CategorySwiperSlide from "./CategorySwiperSlide";
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';

export type HeaderData = {
    id: string;
    title: string;
}

type CategorySwiperProps = {
    categories: HeaderData[];
    onSwipeTo: (categoryId: string) => void;
}

export interface CategorySwiperRef extends React.HTMLAttributes<HTMLElement> {
    swipeTo: (categoryId: string) => void;
}

const CategorySwiper = forwardRef<CategorySwiperRef, CategorySwiperProps>((props, ref) => {
    const { categories, onSwipeTo } = props;

    const swiperRef = useRef<SwiperRef>(null);

    const [ignoreOnSlide, setIgnoreOnSlide] = useState(false);
    const [touching, setTouching] = useState(false);

    useImperativeHandle(ref, () => ({
        swipeTo: (categoryId: string) => {
            const index = categories.findIndex(cat => cat.id === categoryId) ?? 0;
            const catTitle = categories[index].title;
            //console.log(`CategorySwiper: swipeTo(${catTitle})`);
    
            //console.log("CategorySwiper: swipeTo: ignoreOnSlide: TRUE");
            setIgnoreOnSlide(true);
            swiperRef.current?.swiper.slideTo(index);
            setTimeout(() => {
                setIgnoreOnSlide(false);
                //console.log("CategorySwiper: swipeTo: ignoreOnSlide: FALSE");
            }, 0);
        }
    }));

    const handleSlideChange = (newIndex: number) => {
        if (ignoreOnSlide) {
            //console.log(`CategorySwiper: handleSlideChange(${newIndex}): IGNORED`);
            return;
        };
        if (!touching) {
            //console.log(`CategorySwiper: handleSlideChange(${newIndex}): TOUCHED`);
            return;
        };
        //console.log(`CategorySwiper:  handleSlideChange(${newIndex})`);
        onSwipeTo(categories[newIndex].id);   
    }

    const handleOnSlideClick = (index: number) => {
        
        //console.log(`CategorySwiper: handleOnSlideClick(${index})`);
        onSwipeTo(categories[index].id);   

        //swiperRef.current?.swiper.slideTo(index, undefined, false);
    }

    return (
        <>
            <Swiper
                centeredSlides={true}
                spaceBetween={16}
                slidesPerView={'auto'}
                onSlideChange={(swiper) => {handleSlideChange(swiper.activeIndex)}}
                onTouchStart={(swiper, event) => {setTouching(true)}}
                onTouchEnd={(swiper, event) => {setTouching(false)}}
                ref={swiperRef}
                style={{
                    position: 'sticky', /* Safari */
                    top: 56,
                    backgroundColor: 'white',
                    marginTop: 0,
                    height: 44
                }}
            >
                {categories.map((category, index) => (
                    <SwiperSlide key={category.id} style={{width: 'auto'}}>
                        {({ isActive, isVisible }) => {
                            return <CategorySwiperSlide
                                        title={category.title}
                                        active={isActive}
                                        onClick={() => {handleOnSlideClick(index)}} />
                        }}
                    </SwiperSlide>
                ))}
            </Swiper>
        </>
    );
});

CategorySwiper.displayName = 'CategorySwiper';

export default CategorySwiper;
