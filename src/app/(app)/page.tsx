// src/app/(app)/page.tsx
'use client';

import { getCarouselItems } from '@/lib/data';
import type { CarouselItem as CarouselItemType } from '@/lib/types';
import Link from 'next/link';
import { HomePageCarousel } from '@/components/sections/HomePageCarousel';
import { HeroScrollSection } from '@/components/sections/HeroScrollSection';
import { ParallaxSwiper } from '@/components/sections/ParallaxSwiper';
import { FullScreenVideo } from '@/components/sections/FullScreenVideo';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';

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

  const carouselRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: carouselRef,
    offset: ["start end", "start center"], // Animate as section scrolls from bottom to center of screen
    clamp: true, // Prevents values from going outside 0-1 range
  });

  // Animate `left` and `top` CSS properties
  const navLeft = useTransform(scrollYProgress, [0, 1], ["4rem", "50%"]);
  // At the end of the scroll (progress=1), the target landing area's center will be at 70vh of the viewport.
  const navTop = useTransform(scrollYProgress, [0, 1], ["50%", "70%"]);

  // Animate the `transform` property to smoothly switch from vertical to horizontal centering
  const navTransform = useTransform(scrollYProgress, (pos) => {
      // When pos=0 (start), translateX is 0.
      // When pos=1 (end), translateX is -50% to center it horizontally.
      const translateX = pos * -50;

      // translateY should always be -50% to keep the element vertically centered on its `top` coordinate.
      const translateY = -50;

      return `translate(${translateX}%, ${translateY}%)`;
  });


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
        style={{
          left: navLeft,
          top: navTop,
          transform: navTransform,
        }}
        className="fixed z-40 pointer-events-auto"
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

        <section id="home-carousel" ref={carouselRef} className="py-10 md:py-16 bg-background">
          <div className="h-[40vh]">
            {/* This is a spacer div to create a "landing area" for the animated nav above the carousel */}
          </div>
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
