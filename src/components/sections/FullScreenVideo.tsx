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
      <div className="fixed inset-0 w-full h-full -z-20 bg-zinc-950">
        <video
          ref={videoRef}
          loop
          muted
          playsInline
          autoPlay
          poster={posterSrc}
          className="h-full w-full object-cover brightness-[0.75] saturate-[1.1]"
        >
          <source src={videoSrc} type="video/mp4" />
        </video>

        {/* Top Shadow for Header Readability (Crucial for fixed Navs) */}
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/80 to-transparent pointer-events-none" />

        {/* Bottom Fade to blend into next section */}
        <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-zinc-950 to-transparent pointer-events-none" />
      </div>

      {/* 2. THE HERO CONTENT */}
      <section className="relative h-screen w-full flex flex-col justify-between p-6 lg:p-12 z-10 font-sans text-white">

        {/* HEADER SPACE (Empty to allow your actual Header component to sit here) */}
        <div className="h-20 lg:h-24" aria-hidden="true" />

        {/* MAIN CENTERPIECE */}
        <div className="relative flex flex-col items-center justify-center">
          {/* Subtle Tagline */}
          <div className="flex items-center gap-3 mb-4 opacity-0 animate-fade-in [animation-delay:200ms] [animation-fill-mode:forwards]">
            <span className="w-8 h-[1px] bg-red-600" />
            <span className="text-[10px] font-bold tracking-[0.5em] uppercase text-white/80">Premium Denim Archive</span>
            <span className="w-8 h-[1px] bg-red-600" />
          </div>

          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center pt-20">
            <Logo height={240} className='invert' />
            <GoldenHero />
          </div>
        </div>


        <div className="flex flex-col md:flex-row justify-between items-end gap-6">
          {/* Left: Discovery Quote */}
          <div className="max-w-[280px] pb-2">
            <h2 className="text-xs font-bold uppercase tracking-tighter mb-2">Architectural Utility</h2>
            <p className="text-[10px] leading-relaxed text-white/40 uppercase">
              Redefining the silhouette of durable luxury. <br />
              Crafted for movement, built for longevity.

            </p>
          </div>

          {/* Right: Scroll Indicator */}
          <div className="flex flex-col items-end gap-4 group cursor-pointer">
            <span className="text-[9px] font-bold tracking-[0.3em] uppercase opacity-40 group-hover:opacity-100 transition-opacity">
              Fashion Evolution
            </span>
            <div className="relative h-16 w-[1px] bg-white/10 overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-full bg-red-600 animate-scroll-line" />
            </div>
          </div>

        </div>
      </section>

      {/* Spacer to separate Hero from Denim Section */}
      <div className="relative h-px w-full" />
    </>
  );
}