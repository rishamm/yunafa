"use client";

import React from "react";

export function GoldenHero() {
    return (
        <div className="relative flex flex-col items-center justify-center select-none w-full px-6">

            {/* 1. THE BRAND CORE */}
            <div className="relative group">
                {/* Subtle background glow to make text pop against dark denim footage */}
                <div className="absolute inset-0 bg-white/5 blur-[100px] rounded-full scale-150 pointer-events-none" />

                <h1 className="relative flex flex-col items-center">
                    {/* Main Title: Sharp, Clean, Fashion-Forward */}
                    <span className="text-[18vw] lg:text-[14vw] font-[1000] tracking-[-0.06em] leading-none uppercase text-white mix-blend-exclusion">
                        YUNAFA
                    </span>

                    {/* Stencil Sub-line: Industrial Clothing Reference */}
                    <div className="absolute -bottom-2 w-full flex justify-between items-center px-2">
                        <span className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                        <span className="mx-4 text-[9px] font-mono tracking-[0.5em] text-white/40 uppercase whitespace-nowrap">
                            Fine Garments Studio
                        </span>
                        <span className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                    </div>
                </h1>

                {/* Floating Technical Badge (Retail "New Collection" vibe) */}
                <div className="absolute -top-10 -right-4 lg:-right-20">
                    <span className="absolute top-0 -right-[0.25em] text-[2.12em] font-sans leading-none transform -translate-y-[20%]">
                        &reg;
                    </span>
                </div>
            </div>

            {/* 2. CATEGORY NAV (Quick Shop Access) */}
            <div className="mt-20 grid grid-cols-3 gap-12 lg:gap-24">
                {[
                    { label: 'Ethnic', count: '12' },
                    { label: 'Tervibe', count: '08' },
                    { label: 'Modern', count: '15' }
                ].map((item) => (
                    <div key={item.label} className="flex flex-col items-center group cursor-pointer">
                        <span className="text-[8px] font-mono text-white/30 mb-1">[{item.count}]</span>
                        <span className="text-[11px] font-bold tracking-[0.3em] text-white/60 group-hover:text-white transition-all uppercase">
                            {item.label}
                        </span>
                        <div className="mt-2 h-[1px] w-0 bg-red-600 group-hover:w-full transition-all duration-500" />
                    </div>
                ))}
            </div>
        </div>
    );
}