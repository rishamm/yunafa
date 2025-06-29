'use client';

import { ContainerScroll } from '@/components/ui/container-scroll-animation';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

const marqueeText = Array(8).fill('Yunafa Designs');

export function HeroScrollSection() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef });

  const xLeft = useTransform(scrollYProgress, [0.5, 2], ['0%', '-50%']);
  const xRight = useTransform(scrollYProgress, [0, 1], ['-50%', '0%']);

  return (
    <div className="flex flex-col overflow-hidden bg-white relative">
      <div
        ref={containerRef}
        className="absolute top-0 left-0 w-full overflow-hidden"
      >
        {/* Marquee Row 1 */}
        <motion.div
          style={{ x: xLeft }}
          className="text-black md:text-9xl text-5xl font-bold w-max whitespace-nowrap py-4"
        >
          {marqueeText.map((text, i) => (
            <span key={`row1-${i}`} className="mx-4">
              {text}
            </span>
          ))}
        </motion.div>

        {/* Marquee Row 2 (opposite direction) */}
        <motion.div
          style={{ x: xRight }}
          className="text-black md:text-9xl text-5xl font-bold w-max whitespace-nowrap py-4"
        >
          {marqueeText.map((text, i) => (
            <span key={`row2-${i}`} className="mx-4">
              {text}
            </span>
          ))}
        </motion.div>


    
        
        

      
         
      </div>

      {/* Scrollable Container with Background Video */}
      <ContainerScroll>
        <video
          src="/hero.mp4"
          autoPlay
          muted
          loop
          playsInline
          className="mx-auto object-cover h-full w-full"
          draggable={false}
        />
      </ContainerScroll>
    </div>
  );
}
