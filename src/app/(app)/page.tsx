
// src/app/(app)/page.tsx
'use client';

import { getCarouselItems } from '@/lib/data';
import type { CarouselItem as CarouselItemType } from '@/lib/types';
import { HomePageCarousel } from '@/components/sections/HomePageCarousel';
import { HeroScrollSection } from '@/components/sections/HeroScrollSection';
import { ParallaxSwiper } from '@/components/sections/ParallaxSwiper';
import { useEffect, useState } from 'react';
import { AnnouncementBar } from '@/components/layout/AnnouncementBar';

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
      <AnnouncementBar/>
        <div className='h-screen'>

        </div>
        <div className='relative'>
        <HeroScrollSection />
        </div>
        <div className='h-[200px] bg-white flex justify-center items-center text-3xl font-bold'>
    Fashion is the form of art
</div>

        <section className="h-[70vh] md:h-[80vh] w-full bg-transparent">
          <ParallaxSwiper />
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
