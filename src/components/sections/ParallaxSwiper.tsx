
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
    leftImageUrl: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&auto=format&fit=crop&q=60',
    rightImageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop&q=60',
    leftImageHint: 'fashion shopping',
    rightImageHint: 'street style',
    title: <>A <span className="emphasis">Breath</span>. <br /><span>Of Fresh Air.</span></>,
    subtitle: 'Chapter I, page XV',
    paragraph: "A Prophet sat in the market-place and told the fortunes of all who cared to engage his services. Suddenly there came running up one who told him that his house had been broken into by thieves, and that they had made off with everything they could lay hands on."
  },
  {
    id: 2,
    leftImageUrl: 'https://images.unsplash.com/photo-1509319117193-57bab727e09d?w=800&auto=format&fit=crop&q=60',
    rightImageUrl: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&auto=format&fit=crop&q=60',
    leftImageHint: 'model portrait',
    rightImageHint: 'fashion accessories',
    title: <>The <span className="emphasis">Drop</span>. <br /><span>Of Eternal life.</span></>,
    subtitle: 'Chapter II, page VII',
    paragraph: "A thirsty Crow found a Pitcher with some water in it, but so little was there that, try as she might, she could not reach it with her beak, and it seemed as though she would die of thirst within sight of the remedy."
  },
  {
    id: 3,
    leftImageUrl: 'https://images.unsplash.com/photo-1551803091-e2ab69291dfa?w=800&auto=format&fit=crop&q=60',
    rightImageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=60',
    leftImageHint: 'fabric texture',
    rightImageHint: 'luxury product',
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
        loop={false}
        pagination={{ clickable: true, el: '.swiper-pagination-customized' }}
        grabCursor={true}
        speed={1000}
        parallax={true}
        mousewheel={{
          releaseOnEdges: true,
        }}
        className="h-full w-full" // Swiper instance takes full height/width of its container
      >
        {slidesData.map((slide) => (
          <SwiperSlide key={slide.id} className="parallax-swiper-slide flex !bg-transparent">
            <div className="swiper-image-half" data-swiper-parallax-y="-10%">
              <div 
                className="swiper-image-inner swiper-image-left" 
                style={{ backgroundImage: `url(${slide.leftImageUrl})` }}
                data-ai-hint={slide.leftImageHint}
              >
                <h1 data-swiper-parallax-x="-200">{slide.title}</h1>
                <p className="subtitle-custom" data-swiper-parallax-x="-100">{slide.subtitle}</p>
              </div>
            </div>
            <div className="swiper-image-half" data-swiper-parallax-y="15%">
              <div 
                className="swiper-image-inner swiper-image-right" 
                style={{ backgroundImage: `url(${slide.rightImageUrl})` }}
                data-ai-hint={slide.rightImageHint}
              >
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
