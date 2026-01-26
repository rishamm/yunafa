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

    // Desktop: Moves further (-55%) | Mobile: Moves less to keep items in frame (-70% of a smaller container)
    const x = useTransform(scrollYProgress, [0, 1], ["0%", "-70%"]);


    // Mobile heading fade out so it doesn't clash with images
    const headerOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0.3]);

    return (
        /* Increased height to 500vh to ensure "scrolling time" for all images */
        <section ref={targetRef} className="relative h-[500vh] bg-zinc-950 text-white">

            {/* STICKY CONTAINER: This keeps the content in view while you scroll the 500vh parent */}
            <div className="sticky top-0 h-screen w-full overflow-hidden">

                {/* 1. Shared Background Video */}
                <div className="absolute inset-0 w-full lg:w-[50vw] border-r border-zinc-800 bg-black overflow-hidden z-0 opacity-30 lg:opacity-100">
                    <video autoPlay muted loop playsInline className="w-full h-full object-cover grayscale">
                        <source src="/denim.mp4" type="video/mp4" />
                    </video>
                </div>



                {/* 3. Horizontal Gallery (Mobile & Desktop Unified) */}
                <div className="flex h-full items-center">
                    {/* Desktop Spacer */}
                    <div className="hidden lg:block w-[40vw] shrink-0" />

                    <motion.div style={{ x }} className="flex gap-10 lg:gap-40 items-center px-6 lg:px-[10vw] z-20">
                        {collection.map((item) => (
                            <div key={item.id} className="shrink-0 flex flex-col gap-6 lg:gap-12 w-[80vw] lg:w-[28vw]">
                                <div className="relative aspect-[3/4] bg-zinc-900 overflow-hidden border border-zinc-800 shadow-2xl">
                                    <img src={item.src} className="w-full h-full object-cover" alt={item.name} />
                                    <span className="absolute top-4 left-4 lg:top-6 lg:left-6 text-[10px] font-black italic bg-white text-zinc-900 px-2 py-0.5">
                                        #{item.id}
                                    </span>
                                </div>

                                <div className="space-y-4">
                                    <div className="inline-block lg:block">
                                        <h3 className="text-4xl lg:text-7xl font-[1000] italic uppercase leading-none text-white lg:drop-shadow-[0px_4px_10px_rgba(0,0,0,0.5)]">
                                            {item.name}
                                        </h3>
                                    </div>
                                    <div className="flex justify-between items-center border-t border-zinc-700/50 pt-4 font-mono text-[10px] text-zinc-400">
                                        <span>{item.price}</span>
                                        <span className="bg-red-600 text-white px-2 py-0.5">ENQUIRE</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {/* Buffer at the end to ensure the last image is fully seen */}
                        <div className="w-[20vw] shrink-0" />
                    </motion.div>
                </div>

            </div>
        </section>
    );
}