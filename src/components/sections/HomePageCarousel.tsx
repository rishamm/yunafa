"use client";

import React, { useRef, useState } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent, MotionValue } from "framer-motion";
import Image from "next/image";

// --- Sub-Components to handle hooks correctly ---

const CarouselImage = ({ src, title, index, total, scrollYProgress }: { src: string, title: string, index: number, total: number, scrollYProgress: MotionValue<number> }) => {
  const start = index / total;
  const end = (index + 1) / total;

  const opacity = useTransform(
    scrollYProgress,
    [start, start + 0.05, end - 0.05, end],
    [index === 0 ? 1 : 0, 1, 1, 0]
  );

  return (
    <motion.div style={{ opacity, zIndex: total - index }} className="absolute inset-0 bg-zinc-900">
      <div className="relative w-full h-full">
        <Image
          src={src}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover" // Ensures the image fills the frame without stretching
          priority={index === 0}
          quality={85}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
      </div>
    </motion.div>
  );
};

const CarouselText = ({ item, index, total, scrollYProgress, activeIdx }: { item: any, index: number, total: number, scrollYProgress: MotionValue<number>, activeIdx: number }) => {
  const start = index / total;
  const end = (index + 1) / total;

  const opacity = useTransform(
    scrollYProgress,
    [start, start + 0.1, end - 0.1, end],
    [index === 0 ? 1 : 0, 1, 1, 0]
  );
  const y = useTransform(scrollYProgress, [start, start + 0.1], [index === 0 ? 0 : 20, 0]);

  return (
    <motion.div
      style={{ opacity, y }}
      className={`absolute top-0 left-0 w-full ${activeIdx === index ? 'pointer-events-auto' : 'pointer-events-none'}`}
    >
      <div className="space-y-3 md:space-y-6">
        <div className="flex items-center gap-3 md:gap-4">
          <span className="h-[1px] w-8 md:w-12 bg-lime-400" />
          <p className="text-lime-400 font-mono text-[10px] tracking-[0.3em] uppercase font-bold">{item.category}</p>
        </div>
        <h2 className="text-4xl md:text-8xl font-serif italic text-white leading-[0.9]">{item.title}</h2>

        <div className="grid grid-cols-2 gap-4 md:gap-8 pt-4 md:pt-8 border-t border-white/10 max-w-sm">
          <div>
            <p className="text-[8px] text-zinc-500 uppercase tracking-widest">Material</p>
            <p className="text-white font-light text-[10px] md:text-[11px] uppercase tracking-widest">{item.material}</p>
          </div>
          <div>
            <p className="text-[8px] text-zinc-500 uppercase tracking-widest">Series</p>
            <p className="text-white font-light text-[10px] md:text-[11px] uppercase tracking-widest">{item.year}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// --- Main Component ---

export function HomePageCarousel() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);

  const demoItems = [
    { id: "1", title: "Lush Silhouettes", category: "SS/26 Collection", imageSrc: "/Ethnic_1.jpg", year: "2026", material: "Raw Silk" },
    { id: "2", title: "Ivory Textures", category: "Handcrafted Heritage", imageSrc: "/Ethnic_2.jpg", year: "2025", material: "Hand-loomed Cotton" },
    { id: "3", title: "Heritage Weave", category: "The Archive 03", imageSrc: "/Ethnic_1.jpg", year: "2026", material: "Tussar Silk" },
    { id: "4", title: "Modern Muse", category: "Studio Editorial", imageSrc: "/Ethnic_2.jpg", year: "2026", material: "Organza" },
  ];

  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const step = 1 / demoItems.length;
    const current = Math.min(Math.floor(latest / step), demoItems.length - 1);
    if (current !== activeIdx) setActiveIdx(current);
  });

  return (
    <section
      ref={containerRef}
      className="relative bg-[#080808]"
      style={{ height: `${demoItems.length * 100}vh` }}
    >
      {/* Changed h-screen to h-[100dvh] for mobile browser support */}
      <div className="sticky top-0 h-[100dvh] w-full flex flex-col items-center overflow-hidden">

        <div className="container mx-auto px-6 h-full flex flex-col relative z-10">

          {/* MOBILE FIX: Added mt-16 to avoid header overlap and used flex-1 to center remaining space */}
          <div className="flex-1 flex flex-col md:grid md:grid-cols-12 w-full gap-4 md:gap-12 items-center justify-center mt-20 md:mt-0">

            {/* IMAGE SECTION */}
            <div className="w-full md:col-span-6 flex justify-center order-1">
              {/* Reduced max-w on mobile to ensure height doesn't exceed screen */}
              <div className="relative w-full max-w-[280px] md:max-w-[440px] aspect-[3/4] md:aspect-[3/4.5] overflow-hidden rounded-sm shadow-2xl">
                {demoItems.map((item, index) => (
                  <CarouselImage
                    key={item.id}
                    src={item.imageSrc}
                    title={item.title}
                    index={index}
                    total={demoItems.length}
                    scrollYProgress={scrollYProgress}
                  />
                ))}
              </div>
            </div>

            {/* CONTENT SECTION */}
            <div className="w-full md:col-span-6 space-y-6 md:space-y-12 order-2 pb-10 md:pb-0">
              <div className="relative h-[180px] md:min-h-[350px]">
                {demoItems.map((item, index) => (
                  <CarouselText
                    key={`text-${item.id}`}
                    item={item}
                    index={index}
                    total={demoItems.length}
                    scrollYProgress={scrollYProgress}
                    activeIdx={activeIdx}
                  />
                ))}
              </div>

              {/* Progress UI */}
              <div className="flex items-center gap-4">
                <div className="h-[1px] w-16 md:w-24 bg-zinc-800 relative overflow-hidden">
                  <motion.div
                    style={{ scaleX: scrollYProgress }}
                    className="absolute inset-0 bg-lime-400 origin-left"
                  />
                </div>
                <div className="text-white font-mono text-[10px] opacity-50">
                  0{activeIdx + 1} / 0{demoItems.length}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Rail */}
        <motion.div
          style={{ scaleY: scrollYProgress }}
          className="absolute right-0 top-0 w-[1px] h-full bg-lime-400 origin-top z-50 opacity-20"
        />
      </div>
    </section>
  );
}