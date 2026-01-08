// src/app/(app)/page.tsx
'use client';

import { getCarouselItems } from '@/lib/data';
import type { CarouselItem as CarouselItemType } from '@/lib/types';
import { HomePageCarousel } from '@/components/sections/HomePageCarousel';
import { HeroScrollSection } from '@/components/sections/HeroScrollSection';
import { ParallaxSwiper } from '@/components/sections/ParallaxSwiper';
import { useEffect, useState } from 'react';
import EditorialHero from '@/components/EditorialHero';


export default function HomePage() {
  const [carouselItems, setCarouselItems] = useState<CarouselItemType[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoadingData(true);
      try {
        const items = await getCarouselItems();
        setCarouselItems(items);
      } catch (error) {
        console.error("Failed to load page data:", error);
      } finally {
        setIsLoadingData(false);
      }
    };

    loadData();
  }, []);

  return (
    <>
      <div className="relative">

        <div className='h-screen'>
          {/* Your top spacer/content */}
        </div>

        <div className='relative'>
          <HeroScrollSection />
        </div>



        {/* FIXED: Changed h-[70vh] to min-h-screen to prevent EditorialHero from colliding with the carousel */}
        <section className="min-h-screen w-full bg-transparent flex items-center overflow-hidden">
          {/* <ParallaxSwiper /> */}
          <EditorialHero />
        </section>

        <section id="home-carousel" className="py-10 md:py-16 bg-white">
          {isLoadingData ? (
            <div className="flex w-full overflow-x-hidden py-10 md:py-20 justify-center">
              <p>Loading collections...</p>
            </div>
          ) : (
            <HomePageCarousel items={carouselItems} />
          )}
        </section>
      </div>
    </>
  );
}