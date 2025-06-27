
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ContainerScroll } from '@/components/ui/container-scroll-animation';
import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

export function HeroScrollSection() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoFileName = 'hero.mp4';

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(error => {
        console.warn("Hero scroll video autoplay was prevented:", error);
      });
    }
  }, [videoFileName]);

  const heroTextContent = (
    <div className="max-w-5xl mx-auto text-center h-auto">
      <p className="text-lg md:text-xl text-white/80 mb-8 max-w-2xl mx-auto">
        Discover an exquisite collection of unique and luxurious items, curated for the discerning eye.
      </p>
    </div>
  );

  const MarqueeText = () => (
    <>
        <span className="text-8xl md:text-9xl font-bold text-black font-headline mx-12">YUNAFA</span>
        <span className="text-8xl md:text-9xl font-bold text-black font-headline mx-12">YUNAFA</span>
        <span className="text-8xl md:text-9xl font-bold text-black font-headline mx-12">YUNAFA</span>
        <span className="text-8xl md:text-9xl font-bold text-black font-headline mx-12">YUNAFA</span>
        <span className="text-8xl md:text-9xl font-bold text-black font-headline mx-12">YUNAFA</span>
    </>
  );

  return (
    <div className="relative flex flex-col justify-start overflow-hidden">
      <div
        className="absolute top-8 left-0 w-full pointer-events-none z-0 overflow-hidden"
        aria-hidden="true"
      >
        <motion.div 
            className="flex whitespace-nowrap"
            animate={{
                x: ['0%', '-100%'],
            }}
            transition={{
                ease: 'linear',
                duration: 40,
                repeat: Infinity,
            }}
        >
            <MarqueeText />
            <MarqueeText />
        </motion.div>
      </div>
      
      <ContainerScroll titleComponent={<span className="text-base md:text-lg font-medium text-white">Scroll to discover our showcase</span>}>
        <div className="relative w-full h-full">
          <video
            ref={videoRef}
            key={videoFileName}
            src={`/${videoFileName}`}
            autoPlay
            loop
            muted
            playsInline
            className="object-cover w-full h-full bg-top"
            poster="https://images.unsplash.com/photo-1601672439911-572af5dcf128?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          >
            Your browser does not support the video tag.
          </video>
        </div>
      </ContainerScroll>
      
      <section className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center z-10 pointer-events-none">
          <div className="pointer-events-auto">
               {heroTextContent}
          </div>
      </section>
    </div>
  );
}
