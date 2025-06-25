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
import { useEffect, useState, useRef } from 'react';

export default function HomePage() {
  const [carouselItems, setCarouselItems] = useState<CarouselItemType[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [navStyle, setNavStyle] = useState<React.CSSProperties>({
    position: 'fixed',
    top: '50%',
    left: '4rem',
    transform: 'translateY(-50%)',
    zIndex: 40,
  });

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

  const containerRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);


  useEffect(() => {
    const onScroll = () => {
      if (!carouselRef.current || !containerRef.current || !navRef.current) return;

      const scrollY = window.scrollY;
      const viewportHeight = window.innerHeight;
      const navHeight = navRef.current.offsetHeight;
      
      const containerAbsTop = containerRef.current.offsetTop;
      const carouselAbsTop = carouselRef.current.offsetTop + containerAbsTop;
      const carouselHeight = carouselRef.current.offsetHeight;
      
      // Calculate the scrollY value where the middle of the viewport aligns with the middle of the carousel.
      // This is when the nav should switch from 'fixed' to 'absolute'.
      const unstickPoint = (carouselAbsTop + carouselHeight / 2) - (viewportHeight / 2);

      if (scrollY < unstickPoint) {
        // STATE 1: Before the unstick point. The nav is fixed to the viewport's center.
        setNavStyle({
          position: 'fixed',
          top: '50%',
          left: '4rem',
          transform: 'translateY(-50%)',
          zIndex: 40,
        });
      } else {
        // STATE 2: After the unstick point. Pin the nav to the vertical middle of the carousel.
        const carouselTopRelativeToContainer = carouselRef.current.offsetTop;
        const finalTopPosition = carouselTopRelativeToContainer + (carouselHeight / 2) - (navHeight / 2);

        setNavStyle({
          position: 'absolute',
          top: `${finalTopPosition}px`,
          left: '4rem',
          transform: 'translateY(0px)', // Reset the transform used for vertical centering
          zIndex: 40,
        });
      }
    };

    const loadDataAndTrackScroll = async () => {
      setIsLoadingData(true);
      try {
        const items = await getCarouselItems();
        setCarouselItems(items);
      } catch (error) {
        console.error("Failed to load page data:", error);
      } finally {
        setIsLoadingData(false);
        // Use timeout to ensure DOM is updated after data load
        setTimeout(() => {
            window.addEventListener('scroll', onScroll, { passive: true });
            window.addEventListener('resize', onScroll);
            onScroll(); // Initial check
        }, 100);
      }
    };
    
    loadDataAndTrackScroll();

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  return (
    <div className="relative flex flex-col overflow-x-hidden min-h-screen">
      <FullScreenVideo
        videoSrc="/land_scape.mp4"
        posterSrc="https://images.unsplash.com/photo-1488375633099-766993104619?w=1920&h=1080&fit=crop&q=80"
        videoHint="ocean waves"
      />
      
      <div ref={containerRef} className="relative bg-background">
        
        <motion.nav ref={navRef} style={navStyle} className="pointer-events-auto">
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
