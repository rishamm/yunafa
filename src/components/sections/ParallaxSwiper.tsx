// src/components/sections/ParallaxSwiper.tsx
'use client';

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Parallax, Pagination, Mousewheel } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/parallax'; // Ensure parallax styles are imported

// Import custom styles for this component
import './ParallaxSwiper.css';

const slidesData = [
  {
    id: 1,
    leftImageClass: 'bg-swiper-image-one',
    rightImageClass: 'bg-swiper-image-two',
    title: <>A <span className="emphasis">Breath</span>. <br /><span>Of Fresh Air.</span></>,
    subtitle: 'Chapter I, page XV',
    paragraph: "A Prophet sat in the market-place and told the fortunes of all who cared to engage his services. Suddenly there came running up one who told him that his house had been broken into by thieves, and that they had made off with everything they could lay hands on."
  },
  {
    id: 2,
    leftImageClass: 'bg-swiper-image-three',
    rightImageClass: 'bg-swiper-image-four',
    title: <>The <span className="emphasis">Drop</span>. <br /><span>Of Eternal life.</span></>,
    subtitle: 'Chapter II, page VII',
    paragraph: "A thirsty Crow found a Pitcher with some water in it, but so little was there that, try as she might, she could not reach it with her beak, and it seemed as though she would die of thirst within sight of the remedy."
  },
  {
    id: 3,
    leftImageClass: 'bg-swiper-image-five',
    rightImageClass: 'bg-swiper-image-six',
    title: <>A <span className="emphasis">Sense</span>. <br /><span>Of Things to Come.</span></>,
    subtitle: 'Chapter III, page XI',
    paragraph: "Every man carries Two Bags about with him, one in front and one behind, and both are packed full of faults. The Bag in front contains his neighbours’ faults, the one behind his own. Hence it is that men do not see their own faults, but never fail to see those of others."
  },
];

export function ParallaxSwiper() {
  return (
    <div className="parallax-swiper-container">
      <Swiper
        modules={[Parallax, Pagination, Mousewheel]}
        direction="vertical"
        loop={false} // Changed from true to false
        pagination={{ clickable: true, el: '.swiper-pagination-customized' }}
        grabCursor={true}
        speed={1000}
        parallax={true}
        effect="slide"
        mousewheel={{
          releaseOnEdges: true, // Added to allow scrolling past ends
        }}
        className="h-full w-full" // Swiper instance takes full height/width of its container
      >
        {slidesData.map((slide) => (
          <SwiperSlide key={slide.id} className="parallax-swiper-slide flex !bg-transparent">
            <div className="swiper-image-half" data-swiper-parallax-y="-20%">
              <div className={`swiper-image-inner swiper-image-left ${slide.leftImageClass}`}>
                <h1 data-swiper-parallax-x="-200">{slide.title}</h1>
                <p className="subtitle-custom" data-swiper-parallax-x="-100">{slide.subtitle}</p>
              </div>
            </div>
            <div className="swiper-image-half" data-swiper-parallax-y="35%">
              <div className={`swiper-image-inner swiper-image-right ${slide.rightImageClass}`}>
                <p className="paragraph" data-swiper-parallax-x="-100">{slide.paragraph}</p>
              </div>
            </div>
          </SwiperSlide>
        ))}
        {/* Custom Pagination container matching the CSS selector */}
        <div className="swiper-pagination swiper-pagination-customized swiper-pagination-vertical swiper-pagination-bullets"></div>
      </Swiper>
    </div>
  );
}
