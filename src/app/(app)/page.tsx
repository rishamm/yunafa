// src/app/(app)/page.tsx
'use client';

import { getCarouselItems } from '@/lib/data';
import type { CarouselItem as CarouselItemType } from '@/lib/types';
import { HomePageCarousel } from '@/components/sections/HomePageCarousel';
import { HeroScrollSection } from '@/components/sections/HeroScrollSection';
import { ParallaxSwiper } from '@/components/sections/ParallaxSwiper';
import { useEffect, useState } from 'react';

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
        <HeroScrollSection />

        <section className="h-[70vh] md:h-[80vh] w-full bg-white">
          <ParallaxSwiper />
        </section>

        <section id="home-carousel" className="py-10 md:py-16 bg-background">
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
