
// src/app/(app)/page.tsx
'use client';

import { getCategories, getCarouselItems } from '@/lib/data';
import type { Category, CarouselItem as CarouselItemType } from '@/lib/types';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { HomePageCarousel } from '@/components/sections/HomePageCarousel';
import { HeroScrollSection } from '@/components/sections/HeroScrollSection';
import { ParallaxSwiper } from '@/components/sections/ParallaxSwiper';
import { FullScreenVideo } from '@/components/sections/FullScreenVideo';
import { motion } from 'framer-motion'; // Keep motion for potential future simple animations
import { useEffect, useState } from 'react';

export default function HomePage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [carouselItems, setCarouselItems] = useState<CarouselItemType[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  useEffect(() => {
    async function loadData() {
      setIsLoadingData(true);
      try {
        const [cats, items] = await Promise.all([
          getCategories(),
          getCarouselItems()
        ]);
        setCategories(cats);
        setCarouselItems(items);
      } catch (error) {
        console.error("Failed to load page data:", error);
      } finally {
        setIsLoadingData(false);
      }
    }
    loadData();
  }, []);

  const collectionsHeadingElement = (
    <div className="flex-shrink-0 h-full flex items-center justify-center px-2 md:px-4">
      <div className="h-80 md:h-[40rem] flex items-center">
        <h2
          className="transform -rotate-90 whitespace-nowrap text-3xl md:text-4xl font-bold font-headline text-foreground tracking-widest uppercase origin-center"
        >
          Collections
        </h2>
      </div>
    </div>
  );

  return (
    <div className="relative flex flex-col overflow-x-hidden min-h-screen">
      <FullScreenVideo
        videoSrc="/land_scape.mp4"
        posterSrc="https://images.unsplash.com/photo-1488375633099-766993104619?w=1920&h=1080&fit=crop&q=80"
        videoHint="ocean waves"
      />
      
      {/* Content that scrolls normally AFTER the video section */}
      <div className="relative bg-background"> {/* z-20 less critical here, bg-background important */}
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
              <HomePageCarousel items={carouselItems} leadingElement={collectionsHeadingElement} />
          )}
        </section>

        <section className="px-4 py-12 bg-background">
            <p className="text-primary mb-4 whitespace-pre-wrap max-w-3xl">
              At Yunafa, we believe in the art of fine living. Our mission is to bring you a curated selection of products that embody craftsmanship, elegance, and timeless appeal. Each item in our collection is chosen with meticulous care, ensuring it meets our high standards of quality and design.
            </p>
        </section>
      </div>
    </div>
  );
}
