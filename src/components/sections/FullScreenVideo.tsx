'use client';
import { useRef, useEffect } from 'react';
import { Logo } from '../icons/Logo';
import { GoldenHero } from '../GoldenHero';

interface FullScreenVideoProps {
  videoSrc: string;
  posterSrc: string;
}

export function FullScreenVideo({ videoSrc, posterSrc }: FullScreenVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => { });
    }
  }, []);

  return (
    <>
      {/* 1. THE FIXED BACKGROUND ENGINE */}
      <div className="fixed h-full inset-0 w-full -z-20 bg-zinc-950 overflow-hidden"
        style={{ height: '-webkit-fill-available' }}>
        <video
          ref={videoRef}
          loop
          muted
          playsInline
          autoPlay
          poster={posterSrc}
          className="h-full w-full object-cover brightness-[0.7] saturate-[1.1]"
        >
          <source src={videoSrc} type="video/mp4" />
        </video>

        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/80 to-transparent pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-zinc-950 to-transparent pointer-events-none" />
      </div>

      {/* 2. THE HERO CONTENT */}
      <section className="relative  min-h-screen w-full flex flex-col justify-between p-6 lg:p-12 z-10 font-sans text-white"
        style={{ minHeight: '-webkit-fill-available' }}>

        {/* HEADER SPACE */}
        <div className="h-16 lg:h-24" aria-hidden="true" />

        {/* MAIN CENTERPIECE - Removed absolute positioning to prevent overlap */}
        <div className="flex-1 flex flex-col items-center justify-center py-10">

          {/* Subtle Tagline */}
          <div className="flex items-center gap-3 mb-6 opacity-0 animate-fade-in [animation-delay:200ms] [animation-fill-mode:forwards]">
            <span className="w-6 md:w-8 h-[1px] bg-red-600" />
            <span className="text-[8px] md:text-[10px] font-bold tracking-[0.4em] md:tracking-[0.5em] uppercase text-white/80 whitespace-nowrap">
              Premium Denim Archive
            </span>
            <span className="w-6 md:w-8 h-[1px] bg-red-600" />
          </div>

          {/* Logo & GoldenHero Stack */}
          <div className="flex flex-col items-center justify-center gap-4 text-center">
            {/* Responsively scaled Logo */}
            <Logo className="invert w-[180px] md:w-[240px] h-auto" />

            {/* GoldenHero Title */}
            <div className="relative z-20">
              <GoldenHero />
            </div>
          </div>
        </div>

        {/* BOTTOM CONTENT - Using Grid for better mobile stacking */}
        <div className="grid grid-cols-1 md:flex md:flex-row justify-between items-end gap-8 pt-4">

          {/* Left: Discovery Quote */}
          <div className="max-w-[280px]">
            <h2 className="text-[10px] md:text-xs font-bold uppercase tracking-widest mb-2 text-white/60">
              Architectural Utility
            </h2>
            <p className="text-[9px] md:text-[10px] leading-relaxed text-white/50 uppercase tracking-tight">
              Redefining the silhouette of durable luxury. <br />
              Crafted for movement, built for longevity.
            </p>
          </div>

          {/* Right: Scroll Indicator - Hidden on very small height screens if needed */}
          <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-end gap-4 group cursor-pointer border-t border-white/10 md:border-none pt-4 md:pt-0">
            <span className="text-[8px] md:text-[9px] font-bold tracking-[0.3em] uppercase opacity-40 group-hover:opacity-100 transition-opacity">
              Fashion Evolution
            </span>
            <div className="relative h-[1px] md:h-16 w-12 md:w-[1px] bg-white/10 overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-full bg-red-600 animate-scroll-line" />
            </div>
          </div>

        </div>
      </section>

      <div className="relative h-px w-full" />
    </>
  );
}