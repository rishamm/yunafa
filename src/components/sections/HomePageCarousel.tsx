"use client";

import React, { useRef, useState, useEffect } from "react";
import type { CarouselItem as CarouselItemType } from "@/lib/types";
import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import Image from "next/image";

export function HomePageCarousel({ items }: { items: CarouselItemType[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);

  const demoItems = [
    { id: "1", title: "Lush Silhouettes", category: "SS/26 Collection", imageSrc: "/Ethnic_1.jpg", year: "2026", material: "Raw Silk" },
    { id: "2", title: "Ivory Textures", category: "Handcrafted Heritage", imageSrc: "/Ethnic_2.jpg", year: "2025", material: "Hand-loomed Cotton" },
    { id: "3", title: "Heritage Weave", category: "The Archive 03", imageSrc: "/Ethnic_1.jpg", year: "2026", material: "Tussar Silk" },
    { id: "4", title: "Modern Muse", category: "Studio Editorial", imageSrc: "/Ethnic_2.jpg", year: "2026", material: "Organza" },
  ];

  const displayItems = demoItems;

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Calculate the active index based on scroll to fix the ReferenceError
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const step = 1 / displayItems.length;
    const current = Math.min(Math.floor(latest / step), displayItems.length - 1);
    setActiveIdx(current);
  });

  return (
    <section
      ref={containerRef}
      className="relative bg-[#080808]"
      style={{ height: `${displayItems.length * 100}vh` }}
    >
      <div className="sticky top-0 h-screen w-full flex items-center overflow-hidden">

        {/* Background Decorative "Ghost" Text */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
          <motion.h1
            style={{ x: useTransform(scrollYProgress, [0, 1], [200, -200]) }}
            className="text-[25vw] font-serif italic text-white whitespace-nowrap"
          >
            Yunafa Archive
          </motion.h1>
        </div>

        <div className="container mx-auto px-6 h-screen flex items-center relative z-10">
          <div className="grid grid-cols-12 w-full gap-8 items-center">

            {/* LEFT: Portrait Image Frame */}
            <div className="col-span-12 md:col-span-6 flex justify-center">
              <div className="relative w-full max-w-[420px] aspect-[3/4.5] overflow-hidden rounded-sm shadow-2xl">
                {displayItems.map((item, index) => {
                  const start = index / displayItems.length;
                  const end = (index + 1) / displayItems.length;

                  // Per-image scroll animations
                  // eslint-disable-next-line react-hooks/rules-of-hooks
                  const opacity = useTransform(scrollYProgress, [start, start + 0.1, end - 0.1, end], [0, 1, 1, 0]);
                  // eslint-disable-next-line react-hooks/rules-of-hooks
                  const scale = useTransform(scrollYProgress, [start, end], [1.1, 1]);
                  // eslint-disable-next-line react-hooks/rules-of-hooks
                  const y = useTransform(scrollYProgress, [start, end], ["10%", "0%"]);

                  return (
                    <motion.div
                      key={item.id}
                      style={{ opacity, zIndex: displayItems.length - index }}
                      className="absolute inset-0 bg-zinc-900"
                    >
                      <motion.div style={{ scale, y }} className="relative w-full h-full">
                        <Image
                          src={item.imageSrc}
                          alt={item.title}
                          fill
                          className="object-cover"
                          priority
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
                        <div className="absolute inset-0 border border-white/5" />
                      </motion.div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* RIGHT: Detailed Content Section */}
            <div className="col-span-12 md:col-span-6 space-y-12">
              <div className="relative min-h-[350px]">
                {displayItems.map((item, index) => {
                  const start = index / displayItems.length;
                  const end = (index + 1) / displayItems.length;

                  // Text reveal animations
                  // eslint-disable-next-line react-hooks/rules-of-hooks
                  const textOpacity = useTransform(scrollYProgress, [start + 0.05, start + 0.15, end - 0.15, end - 0.05], [0, 1, 1, 0]);
                  // eslint-disable-next-line react-hooks/rules-of-hooks
                  const textX = useTransform(scrollYProgress, [start, start + 0.15], [30, 0]);

                  return (
                    <motion.div
                      key={`content-${item.id}`}
                      style={{ opacity: textOpacity, x: textX }}
                      className={`absolute top-0 left-0 w-full ${activeIdx === index ? 'pointer-events-auto' : 'pointer-events-none'}`}
                    >
                      <div className="space-y-6">
                        <div className="flex items-center gap-4">
                          <span className="h-[1px] w-12 bg-lime-400" />
                          <p className="text-lime-400 font-mono text-[10px] tracking-[0.4em] uppercase font-bold">
                            {item.category}
                          </p>
                        </div>

                        <h2 className="text-6xl md:text-8xl font-serif italic text-white leading-[0.85] tracking-tight">
                          {item.title}
                        </h2>

                        <div className="grid grid-cols-2 gap-8 pt-10 border-t border-white/10 max-w-sm">
                          <div className="space-y-1">
                            <p className="text-[9px] text-zinc-500 uppercase tracking-widest">Material</p>
                            <p className="text-white font-light uppercase text-[11px] tracking-widest">{item.material}</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-[9px] text-zinc-500 uppercase tracking-widest">Edition</p>
                            <p className="text-white font-light uppercase text-[11px] tracking-widest">{item.year} Series</p>
                          </div>
                        </div>

                        <p className="text-zinc-400 text-sm font-light leading-relaxed max-w-sm pt-4">
                          Explore the tactile geometry of our latest silhouettes. A marriage of traditional weave and modern form.
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Progress and Counter UI */}
              <div className="pt-12 flex items-center gap-12">
                <div className="flex flex-col gap-3">
                  {displayItems.map((_, i) => (
                    <motion.div
                      key={i}
                      style={{
                        width: useTransform(scrollYProgress, [i / displayItems.length, (i + 0.5) / displayItems.length], [20, 50]),
                        backgroundColor: useTransform(scrollYProgress, [i / displayItems.length, (i + 0.5) / displayItems.length], ["#27272a", "#a3e635"])
                      }}
                      className="h-[1px]"
                    />
                  ))}
                </div>
                <div className="text-white font-mono text-[11px] tracking-tighter h-5 overflow-hidden">
                  <motion.div
                    style={{ y: useTransform(scrollYProgress, [0, 1], ["0%", `-${(displayItems.length - 1) * 100}%`]) }}
                  >
                    {displayItems.map((_, i) => (
                      <p key={i} className="leading-none mb-5">0{i + 1} &mdash; 0{displayItems.length}</p>
                    ))}
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Global Vertical Progress */}
        <motion.div
          style={{ scaleY: scrollYProgress }}
          className="absolute right-0 top-0 w-[2px] h-full bg-lime-400 origin-top z-50 shadow-[0_0_15px_rgba(163,230,53,0.5)]"
        />
      </div>
    </section>
  );
}