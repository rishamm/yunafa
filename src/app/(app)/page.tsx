
// src/app/(app)/page.tsx
'use client';

import { getCarouselItems } from '@/lib/data';
import type { CarouselItem as CarouselItemType } from '@/lib/types';
import Link from 'next/link';
import { HomePageCarousel } from '@/components/sections/HomePageCarousel';
import { HeroScrollSection } from '@/components/sections/HeroScrollSection';
import { ParallaxSwiper } from '@/components/sections/ParallaxSwiper';
import { FullScreenVideo } from '@/components/sections/FullScreenVideo';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function HomePage() {
  const [carouselItems, setCarouselItems] = useState<CarouselItemType[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  const heroLinks = [
    { href: "/category/ethnic", label: "Ethnic" },
    { href: "/category/casual", label: "Casual" },
    { href: "/category/traditional", label: "Traditional" },
    { href: "/category/modest", label: "Modest" },
    { href: "/category/western", label: "Western" },
    { href: "/category/korean", label: "Korean" },
    { href: "/category/junior", label: "Junior" },
    { href: "/category/tervibe", label: "Tervibe" },
  ];

  useEffect(() => {
    async function loadData() {
      setIsLoadingData(true);
      try {
        const items = await getCarouselItems();
        setCarouselItems(items);
      } catch (error) {
        console.error("Failed to load page data:", error);
      } finally {
        setIsLoadingData(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="relative flex flex-col overflow-x-hidden min-h-screen">
      <FullScreenVideo
        videoSrc="/land_scape.mp4"
        posterSrc="https://images.unsplash.com/photo-1488375633099-766993104619?w=1920&h=1080&fit=crop&q=80"
        videoHint="ocean waves"
      />
      
      <motion.nav
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="fixed left-8 md:left-16 top-1/2 -translate-y-1/2 z-40 pointer-events-auto"
      >
        <ul className="space-y-4">
          {heroLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="inline-block font-plex-mono text-xs font-normal uppercase tracking-widest leading-[1.6] text-white hover:opacity-80 transition-opacity"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </motion.nav>

      <div className="relative bg-background">
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
    </div>
  );
}
