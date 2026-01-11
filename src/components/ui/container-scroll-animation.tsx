"use client";
import React, { useRef } from "react";
import { useScroll, useTransform, motion, type MotionValue } from "framer-motion";

export const ContainerScroll = ({
  titleComponent,
  children,
}: {
  titleComponent: string | React.ReactNode;
  children: React.ReactNode;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // RESTORED: Your original offset
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 1%", "start 90%"],
  });

  const [isMobile, setIsMobile] = React.useState(false);
  const [isVeryLargeScreen, setIsVeryLargeScreen] = React.useState(false);

  React.useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 768);
      setIsVeryLargeScreen(window.innerWidth > 1440);
    };
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // RESTORED: Your original video logic
  const scaleDimensions = () => {
    if (isMobile) return [1, 0.65];
    if (isVeryLargeScreen) return [1, 0.75];
    return [1, 0.75];
  };

  const rotate = useTransform(scrollYProgress, [1, 0], [90, 0]);
  const cardScale = useTransform(scrollYProgress, [0, 1], scaleDimensions());

  const headerTranslateY = useTransform(
    scrollYProgress,
    [0, 1],
    isMobile ? [0, -50] : [-50, -100]
  );

  const cardTranslateY = useTransform(
    scrollYProgress,
    [0, 0.2],
    isMobile ? [0, 0] : isVeryLargeScreen ? [0, 1] : [0, 11]
  );

  // --- NEW: LOOK BOOK JOINING ANIMATION ---
  // Starts at the edges (-150% / 150%) and meets at 0%
  const xLook = useTransform(scrollYProgress, [0, 0.3], ["0%", "-150%"]);
  const xBook = useTransform(scrollYProgress, [0, 0.3], ["0%", "150%"]);
  const opacityText = useTransform(scrollYProgress, [1, 0.1, 1], [0, 1, 1]);

  return (
    <div
      className="flex items-center justify-center relative"
      ref={containerRef}
    >
      <div
        className="w-full relative"
        style={{ perspective: "1200px" }}
      >
        {/* LOOK BOOK LAYER (Top Layer) - Minimalist Luxury Style */}
        <div className="absolute inset-x-0 top-[50%] md:top-[40%] z-50 pointer-events-none overflow-hidden">
          <motion.div
            style={{ opacity: opacityText }}
            className="flex items-center justify-center gap-4 md:gap-8"
          >
            <motion.span
              style={{ x: xLook }}
              className="text-[16vw] font-[1000] tracking-tighter uppercase italic leading-none 
                         text-slate-100/80 backdrop-blur-[2px] 
                         drop-shadow-2xl"
            >
              LOOK
            </motion.span>
            <motion.span
              style={{ x: xBook }}
              className="text-[16vw] font-[1000] tracking-tighter uppercase italic leading-none 
                         text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,0.6)]"
            >
              BOOK
            </motion.span>
          </motion.div>
        </div>
        <Header translate={headerTranslateY} titleComponent={titleComponent} />

        <Card rotate={rotate} scale={cardScale} translateY={cardTranslateY}>
          {children}
        </Card>
      </div>
    </div>
  );
};

export const Header = ({
  translate,
  titleComponent,
}: {
  translate: MotionValue<number>;
  titleComponent: string | React.ReactNode;
}) => {
  return (
    <motion.div
      style={{ translateY: translate }}
      className="w-full mx-auto text-center absolute z-20 top-0 pointer-events-none"
    >
      {titleComponent}
    </motion.div>
  );
};

export const Card = ({
  rotate,
  scale,
  translateY,
  children,
}: {
  rotate: MotionValue<number>;
  scale: MotionValue<number>;
  translateY: MotionValue<number>;
  children: React.ReactNode;
}) => {
  return (
    <motion.div
      style={{
        rotateX: rotate,
        scale: scale,
        translateY: translateY,
      }}
      className="mt-[-3px] h-[40rem] md:h-[60rem] w-full shadow-2xl relative z-10"
    >
      <div className="h-full w-full overflow-hidden md:p-0">
        {children}
      </div>
    </motion.div>
  );
};