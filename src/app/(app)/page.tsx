
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
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';

export default function HomePage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [carouselItems, setCarouselItems] = useState<CarouselItemType[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isNavVisible, setIsNavVisible] = useState(true);
  const collectionsSectionRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // When the collections section is intersecting, hide the fixed nav.
        setIsNavVisible(!entry.isIntersecting);
      },
      { threshold: 0.1 } // Fires when 10% of the element is visible
    );

    const currentRef = collectionsSectionRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  const collectionsNavElement = (
    <div className="flex-shrink-0 h-full flex items-center justify-center px-2 md:px-4">
      <div className="h-80 md:h-[40rem] flex items-center justify-center">
        <nav>
          <ul className="space-y-4 flex flex-col items-center">
            {heroLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="inline-block font-plex-mono text-xs font-normal uppercase tracking-widest leading-[1.6] text-foreground hover:opacity-80 transition-opacity"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
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
      
      <AnimatePresence>
        {isNavVisible && (
          <motion.nav
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed left-8 md:left-16 bottom-[7rem] z-40 pointer-events-auto"
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
        )}
      </AnimatePresence>

      <div className="relative bg-background">
        <HeroScrollSection />

        <section className="h-[70vh] md:h-[80vh] w-full bg-white">
          <ParallaxSwiper />
        </section>

        <section id="home-carousel" ref={collectionsSectionRef} className="py-10 md:py-16 bg-background">
          {isLoadingData ? (
              <div className="flex w-full overflow-x-hidden py-10 md:py-20 justify-center">
                  <p>Loading collections...</p>
              </div>
          ) : (
              <HomePageCarousel items={carouselItems} leadingElement={collectionsNavElement} />
          )}
        </section>
      </div>
    </div>
  );
}
