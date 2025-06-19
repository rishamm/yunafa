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
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';

export default function HomePage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [carouselItems, setCarouselItems] = useState<CarouselItemType[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  const contentWrapperRef = useRef<HTMLDivElement>(null);

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
        // Optionally set error state here
      } finally {
        setIsLoadingData(false);
      }
    }
    loadData();
  }, []);

  const { scrollYProgress: contentScrollYProgress } = useScroll({
    target: contentWrapperRef,
    offset: ["start end", "start 0.75"] // Animation starts when top of content hits bottom of VP, ends when top of content is 75% up VP
  });

  const contentTranslateY = useTransform(contentScrollYProgress, [0, 1], ["50px", "0px"]);
  const contentOpacity = useTransform(contentScrollYProgress, [0, 1], [0.5, 1]);

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
    <div className="relative flex flex-col overflow-x-hidden min-h-screen"> {/* Ensure overflow-x-hidden */}
      {/* FullScreenVideo will be sticky and z-10 */}
      <FullScreenVideo
        videoSrc="/land_scape.mp4"
        posterSrc="https://images.unsplash.com/photo-1488375633099-766993104619?w=1920&h=1080&fit=crop&q=80"
        videoHint="ocean waves"
      />

      {/* This div wraps all content that scrolls OVER the sticky video */}
      {/* It needs a background and a higher z-index */}
      <div ref={contentWrapperRef} className="relative z-20 bg-background">
        <motion.div
          style={{
            translateY: contentTranslateY,
            opacity: contentOpacity,
          }}
        >
          <HeroScrollSection />

          <section className="parallax-swiper-outer-wrap m-0 mt-0 ">
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

          <section className="container mx-auto px-4 py-12 bg-background">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6 font-headline">About Yunafa</h2>
                <p className="text-foreground/80 mb-4 whitespace-pre-wrap">
                  At Yunafa, we believe in the art of fine living. Our mission is to bring you a curated selection of products that embody craftsmanship, elegance, and timeless appeal. Each item in our collection is chosen with meticulous care, ensuring it meets our high standards of quality and design.
                </p>
                <p className="text-foreground/80 mb-6 whitespace-pre-wrap">
                  Whether you are looking for a statement piece for your home, a unique gift, or a personal treasure, Yunafa offers an unparalleled shopping experience.
                </p>
                <Button asChild variant="outline" className="border-primary text-primary hover:bg-primary/10">
                  <Link href="/contact">Learn More</Link>
                </Button>
              </div>
              <div className="rounded-lg overflow-hidden shadow-xl aspect-video relative">
                <Image
                  src="https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&h=600&fit=crop&q=60"
                  alt="Artisanal products display in a boutique"
                  fill
                  className="object-cover"
                  data-ai-hint="fashion boutique"
                />
              </div>
            </div>
          </section>
        </motion.div>
      </div>
    </div>
  );
}
