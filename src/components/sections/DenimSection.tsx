"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const collection = [
    { id: "01", src: "/Turvibe_1.jpg", name: "RAW SLOUCH", price: "€185" },
    { id: "02", src: "/Turvibe_2.jpg", name: "ACID WARP", price: "€210" },
    { id: "03", src: "/Turvibe_3.jpg", name: "UTILITY V3", price: "€245" },
    { id: "04", src: "/Turvibe_4.jpg", name: "WIDE ARC", price: "€195" },
];

export function DenimSection() {
    const targetRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: targetRef,
    });

    const x = useTransform(scrollYProgress, [0, 1], ["0%", "-55%"]);
    const headerX = useTransform(scrollYProgress, [0, 1], ["15%", "-10%"]);

    return (
        <section ref={targetRef} className="relative h-[400vh] bg-zinc-950 text-white">

            <div className="sticky top-0 h-screen w-full overflow-hidden">

                {/* --- BACKGROUND VIDEO --- */}
                <div className="absolute inset-0 lg:w-[50vw] lg:border-r lg:border-zinc-800 bg-black overflow-hidden z-0">
                    <video
                        autoPlay
                        muted
                        loop
                        playsInline
                        className="w-full h-full object-cover opacity-60 lg:opacity-100 grayscale transition-all duration-700"
                    >
                        <source src="/denim.mp4" type="video/mp4" />
                    </video>
                </div>

                {/* --- ARCHITECTURAL ADAPTIVE HEADING --- */}
                <div className="absolute inset-0 z-50 pointer-events-none flex items-center overflow-hidden">
                    <motion.div style={{ x: headerX }} className="whitespace-nowrap">
                        <h2
                            className="relative text-[32vw] lg:text-[25vw] font-[1000] italic uppercase leading-none tracking-tighter"
                        >
                            {/* Layer 1: The Main Text (Black on mobile for maximum contrast, Ghost on Desktop) */}
                            <span
                                className="text-zinc-950 lg:text-transparent"
                                style={{
                                    WebkitTextStroke: "1px rgba(255, 255, 255, 0.3)",
                                    // This glow creates a "halo" so it never gets lost in white video parts
                                    filter: "drop-shadow(0 0 15px rgba(255,255,255,0.4))"
                                }}
                            >
                                TURVIBE
                            </span>

                            {/* Layer 2: The Red Accent (Technical Detail) */}
                            <span className="text-[6vw] lg:text-[4vw] align-top font-mono not-italic ml-2 text-red-600 drop-shadow-md">
                                [S26]
                            </span>

                            {/* Layer 3: Trademark (Solid) */}
                            <span
                                className="text-[4vw] lg:text-[3vw] align-top font-mono not-italic ml-2 text-zinc-900 lg:text-zinc-400"
                                style={{ WebkitTextStroke: "0px" }}
                            >
                                ®
                            </span>
                        </h2>

                        {/* Layer 4: Subtitle Bar (Moves with the heading) */}
                        <div className="mt-[-2vw] ml-[10vw] flex items-center gap-4">
                            <div className="h-[1px] w-20 bg-red-600 lg:bg-zinc-800" />
                            <span className="text-[10px] font-mono font-bold tracking-[0.5em] text-zinc-900 lg:text-zinc-500 uppercase">
                                Structural_Utility_Archive
                            </span>
                        </div>
                    </motion.div>
                </div>
                {/* --- MOBILE: INTERACTIVE OVERLAY CARDS --- */}
                <div className="lg:hidden relative h-full w-full z-40 overflow-y-auto snap-y snap-mandatory px-4 pt-[20vh] pb-10">
                    {collection.map((item) => (
                        <div key={item.id} className="h-[75vh] w-full mb-10 snap-center flex flex-col justify-end">
                            <div className="bg-white text-zinc-900 p-1 mb-4 inline-block w-fit">
                                <span className="text-[10px] font-mono font-bold px-2 uppercase tracking-tighter">Archive_S26_{item.id}</span>
                            </div>

                            <div className="relative aspect-[3/4] w-full border border-white/20 overflow-hidden backdrop-blur-md bg-black/40">
                                <img src={item.src} alt={item.name} className="w-full h-full object-cover" />

                                <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black/80 to-transparent text-white">
                                    {/* Product Title with Blend Mode */}
                                    <h3 className="text-5xl font-[1000] italic leading-none mb-2 mix-blend-difference">
                                        {item.name}
                                    </h3>
                                    <div className="flex justify-between items-center text-[10px] font-mono tracking-widest opacity-80">
                                        <span>{item.price}</span>
                                        <span className="border-b border-white pb-0.5">SPEC: RAW</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* --- DESKTOP: THE ORIGINAL 50/50 HORIZONTAL SPLIT --- */}
                <div className="hidden lg:flex">
                    <div className="w-[50vw] h-screen" />

                    <motion.div style={{ x }} className="flex gap-40 items-center px-[10vw] z-[60]">
                        {collection.map((item) => (
                            <div key={item.id} className="shrink-0 flex flex-col gap-12 w-[28vw]">
                                {/* Product Image */}
                                <div className="relative aspect-[3/4] bg-zinc-900 overflow-hidden group border border-zinc-800">
                                    <img src={item.src} className="w-full h-full object-cover" alt={item.name} />
                                    <span className="absolute top-6 left-6 text-[10px] font-black italic bg-white text-zinc-900 px-2 py-0.5">#{item.id}</span>
                                </div>

                                {/* --- FIXED ITEM NAME DESIGN --- */}
                                <div className="relative group/title">
                                    <div className="space-y-4">
                                        <div className="transform skew-x-12">
                                            <h3
                                                className="text-4xl lg:text-6xl font-[1000] italic uppercase leading-none text-white tracking-tighter relative"
                                                style={{
                                                    // 1. Thin black stroke to define edges on white backgrounds
                                                    WebkitTextStroke: "1px rgba(0, 0, 0, 0.8)",
                                                    // 2. High-spread dark shadow to create a "pocket" of visibility on bright/busy videos
                                                    filter: "drop-shadow(0px 4px 10px rgba(0, 0, 0, 0.5))",
                                                    // 3. Ensuring text is crisp
                                                    paintOrder: "stroke fill"
                                                }}
                                            >
                                                {/* Background Layer: Optional subtle glow for extra pop */}
                                                <span className="absolute inset-0 text-white blur-[20px] opacity-20 pointer-events-none">
                                                    {item.name}
                                                </span>

                                                {/* Main Text */}
                                                <span className="relative z-10">
                                                    {item.name}
                                                </span>
                                            </h3>
                                            <div className="mt-4 flex justify-between items-center border-t border-zinc-200 pt-2 font-mono text-[10px] font-bold text-zinc-500 uppercase">

                                                <span className="text-red-600">Locked_Stock</span>
                                            </div>
                                        </div>

                                        {/* 2. Horizontal line with a "power bar" feel */}
                                        <div className="flex flex-col gap-2 border-t border-zinc-700/50 pt-4">
                                            <div className="flex justify-between items-center">
                                                <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">
                                                    Spec: Reinforced_Denim
                                                </span>
                                                <span className="text-[10px] font-mono text-white bg-red-600 px-2 py-0.5">
                                                    Enquire
                                                </span>
                                            </div>

                                            {/* 3. Subtle background highlight for extra legibility over white video pixels */}
                                            <div className="absolute -inset-x-4 -inset-y-2 bg-gradient-to-r from-black/60 via-black/20 to-transparent opacity-0 group-hover/title:opacity-100 transition-opacity duration-500 -z-10 blur-md" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </div>

            {/* --- UI ELEMENTS --- */}
            <div className="fixed bottom-6 left-6 z-[100] text-[10px] font-mono mix-blend-difference text-white uppercase tracking-[0.4em]">
                System: Archive_S26
            </div>
        </section>
    );
}