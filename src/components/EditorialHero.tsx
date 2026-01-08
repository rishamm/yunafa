'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import { useRef } from 'react';

export default function EditorialHero() {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    // Subtler parallax: reduced distance for a more controlled feel
    const xLeft = useTransform(scrollYProgress, [0, 1], [0, -80]);
    const xRight = useTransform(scrollYProgress, [0, 1], [0, 80]);

    // Smooth scale: subtly grows from 0.9 to 1 without breaking the mask
    const scaleVideo = useTransform(scrollYProgress, [0, 0.4], [0.92, 1]);

    return (
        <section
            ref={containerRef}
            className="relative z-10 w-full bg-[#fcfcfc] overflow-hidden py-16 md:py-28"
        >
            {/* Background Text - Scaled down for subtleness */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.02] select-none">
                <h2 className="text-[25vw] font-black leading-none">YUNAFA</h2>
            </div>

            <div className="container mx-auto px-6 relative">

                {/* Main Heading - Reduced sizes and tighter margins */}
                <div className="relative z-20 flex flex-col items-center mb-[-6vh] md:mb-[-10vh]">
                    <motion.h1
                        style={{ x: xLeft }}
                        className="text-[12vw] md:text-[9vw] font-light tracking-tighter text-black leading-none self-start md:pl-20"
                    >
                        ETHNIC
                    </motion.h1>
                    <motion.h1
                        style={{ x: xRight }}
                        className="text-[12vw] md:text-[9vw] font-serif italic text-lime-900/80 leading-none self-end md:pr-20"
                    >
                        tradition
                    </motion.h1>
                </div>

                {/* Central Video Frame - Optimized Masking */}
                <div className="flex justify-center items-center relative z-10">
                    <motion.div
                        style={{
                            scale: scaleVideo,
                            isolation: 'isolate' // Fixes the "square edges" bleeding issue
                        }}
                        className="relative w-full max-w-[460px] aspect-[9/16] rounded-[3rem] overflow-hidden shadow-[0_40px_100px_-20px_rgba(0,0,0,0.12)] group"
                    >
                        <video
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="w-full h-full object-cover rounded-[3rem]" // Explicitly rounded video
                        >
                            <source src="/yunafa-portrait.mp4" type="video/mp4" />
                        </video>

                        {/* Minimalist Overlay */}
                        <div className="absolute inset-0 flex flex-col justify-end items-center p-10 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                            <Link href="/collections" className="bg-white px-8 py-3 rounded-full text-[10px] tracking-[0.3em] text-black uppercase hover:bg-lime-50 transition-colors duration-300">
                                View Collection
                            </Link>
                        </div>
                    </motion.div>
                </div>

                {/* Bottom Info Grid - Clean and centered */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-16 items-start">
                    <div className="hidden md:flex flex-col gap-3">
                        <span className="h-[1px] w-12 bg-black" />
                        <p className="text-[9px] uppercase tracking-[0.4em] text-gray-400 font-bold">Collection 2026</p>
                    </div>

                    <div className="text-center">
                        <p className="text-gray-400 font-light text-xs md:text-sm leading-relaxed max-w-[300px] mx-auto uppercase tracking-widest">
                            Handcrafted in India <br /> inspired by raw silhouettes.
                        </p>
                    </div>

                    <div className="flex justify-center md:justify-end gap-8">
                        <Link href="/lookbook" className="text-[10px] uppercase tracking-[0.3em] font-medium border-b border-transparent hover:border-black pb-1 transition-all">
                            Lookbook
                        </Link>
                        <Link href="/contact" className="text-[10px] uppercase tracking-[0.3em] font-medium border-b border-transparent hover:border-black pb-1 transition-all">
                            Contact
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}