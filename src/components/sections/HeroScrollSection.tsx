
'use client';

import { motion } from 'framer-motion';

export function HeroScrollSection() {
  const heroTextContent = (
    <div className="max-w-5xl mx-auto text-center h-auto">
      <p className="text-lg md:text-xl text-white/80 mb-8 max-w-2xl mx-auto">
        Discover an exquisite collection of unique and luxurious items, curated for the discerning eye.
      </p>
    </div>
  );

  const MarqueeText = () => (
    <>
        <span className="text-8xl md:text-9xl font-bold text-black font-headline mx-12">YUNAFA</span>
        <span className="text-8xl md:text-9xl font-bold text-black font-headline mx-12">YUNAFA</span>
        <span className="text-8xl md:text-9xl font-bold text-black font-headline mx-12">YUNAFA</span>
        <span className="text-8xl md:text-9xl font-bold text-black font-headline mx-12">YUNAFA</span>
        <span className="text-8xl md:text-9xl font-bold text-black font-headline mx-12">YUNAFA</span>
    </>
  );

  return (
    <section className="relative flex h-[150vh] flex-col items-center justify-center overflow-hidden">
      <div
        className="absolute top-8 left-0 w-full pointer-events-none z-0 overflow-hidden"
        aria-hidden="true"
      >
        <motion.div
          className="flex whitespace-nowrap"
          animate={{
            x: ['0%', '-100%'],
          }}
          transition={{
            ease: 'linear',
            duration: 10,
            repeat: Infinity,
          }}
        >
          <MarqueeText />
          <MarqueeText />
        </motion.div>
      </div>

      <div className="relative z-10 pointer-events-auto">
        {heroTextContent}
      </div>
    </section>
  );
}
