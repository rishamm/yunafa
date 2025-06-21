// src/components/sections/ParallaxSwiper.tsx
'use client';

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Parallax, Mousewheel } from 'swiper/modules'; // Removed Pagination

// Import Swiper styles
import 'swiper/css';
// import 'swiper/css/pagination'; // Removed pagination CSS import
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
    paragraph: ""
  },
  {
    id: 2,
    leftImageUrl: 'https://images.unsplash.com/photo-1509319117193-57bab727e09d?w=800&auto=format&fit=crop&q=60',
    rightImageUrl: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&auto=format&fit=crop&q=60',
    leftImageHint: 'model portrait',
    rightImageHint: 'fashion accessories',
    title: <>The <span className="emphasis">Drop</span>. <br /><span>Of Eternal life.</span></>,
    subtitle: 'Chapter II, page VII',
    paragraph: ""
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
        modules={[Parallax, Mousewheel]} // Removed Pagination
        direction="vertical"
        loop={false}
        // Removed pagination prop: pagination={{ clickable: true, el: '.swiper-pagination-customized' }}
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
            <div className="swiper-image-half" data-swiper-parallax-y="0%">
              <div 
                className="swiper-image-inner swiper-image-left" 
                style={{ backgroundImage: `url(${slide.leftImageUrl})` }}
                data-ai-hint={slide.leftImageHint}
              >
                <h1 data-swiper-parallax-x="-200">{slide.title}</h1>
                <p className="subtitle-custom" data-swiper-parallax-x="-100">{slide.subtitle}</p>
              </div>
            </div>
            <div className="swiper-image-half" data-swiper-parallax-y="50%">
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
        {/* Removed custom Pagination container */}
      </Swiper>
    </div>
  );
}
