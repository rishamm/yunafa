'use client';

import { ContainerScroll } from '@/components/ui/container-scroll-animation';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

export function HeroScrollSection() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef });

  // Subtle opacity for the UI elements as you scroll into the 3D tilt
  const uiOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

  return (
    <div className="flex flex-col overflow-hidden bg-black relative">

      {/* 1. TECHNICAL UI OVERLAY (Replaces Marquee) */}
      <motion.div
        style={{ opacity: uiOpacity }}
        className="absolute inset-0 z-10 pointer-events-none"
      >
        {/* Top Left: Collection Info */}
        <div className="absolute top-12 left-12 space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-red-600 rounded-full animate-ping" />
            <span className="text-white font-mono text-[10px] tracking-widest uppercase">System_Active</span>
          </div>
          <p className="text-white/30 font-mono text-[9px] uppercase tracking-tighter">Ref: Archive_001 / 2026</p>
        </div>
        {/* Top Right: Technical Specs */}
        <div className="absolute top-12 right-12 text-right">
          <span className="text-white font-mono text-[10px] tracking-widest uppercase">Material_Report</span>
          <div className="flex flex-col gap-1 mt-2 opacity-30 font-mono text-[8px] text-white">
            <span>{">"} 14oz RAW DENIM</span>
            <span>{">"} REINFORCED STITCHING</span>
            <span>{">"} WEATHER_RESISTANT_04</span>
          </div>
        </div>

        {/* Vertical Side Lines (Industrial Feel) */}
        <div className="absolute left-6 top-1/4 bottom-1/4 w-[1px] bg-gradient-to-b from-transparent via-white/20 to-transparent" />
        <div className="absolute right-6 top-1/4 bottom-1/4 w-[1px] bg-gradient-to-b from-transparent via-white/20 to-transparent" />
      </motion.div>

      {/* 2. MAIN SCROLL CONTAINER */}
      <ContainerScroll
        titleComponent={<GoldenHero />}
      >
        <div className="relative h-full w-full bg-zinc-900">
          {/* Glass Reflection Overlay for the Video */}
          <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent z-10 pointer-events-none" />

          <video
            src="/hero.mp4"
            autoPlay
            muted
            loop
            playsInline
            className="mx-auto object-cover h-full w-full"
            draggable={false}
          />
        </div>
      </ContainerScroll>
    </div>
  );
}

function GoldenHero() {
  return (
    <div className="flex flex-col items-center">
      <h1 className="text-7xl md:text-[10vw] font-black tracking-[-0.08em] leading-none text-white uppercase italic">
        YUNAFA
      </h1>
      <div className="flex items-center gap-4 mt-4">
        <span className="w-8 h-[1px] bg-white/30" />
        <p className="text-[10px] font-mono tracking-[0.6em] text-white/50 uppercase">
          Utility Garments
        </p>
        <span className="w-8 h-[1px] bg-white/30" />
      </div>
    </div>
  );
}