
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
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 1%", "start 90%"], 
  });
  const [isMobile, setIsMobile] = React.useState(false);
  const [isVeryLargeScreen, setIsVeryLargeScreen] = React.useState(false);

  React.useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 768);
      setIsVeryLargeScreen(window.innerWidth > 1440); // Check for screens > 1440px
    };
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => {
      window.removeEventListener("resize", checkScreenSize);
    };
  }, []);

  const scaleDimensions = () => {
    if (isMobile) return [1, 0.65];
    if (isVeryLargeScreen) return [1, 0.75]; // Slightly larger start for very large screens
    return [1, 0.75]; // For medium desktop
  };

  const rotate = useTransform(scrollYProgress, [1, 0], [90, 0]);
  const cardScale = useTransform(scrollYProgress, [0, 1], scaleDimensions());

  // Adjusted headerTranslateY for mobile vs desktop
  const headerTranslateY = useTransform(
    scrollYProgress,
    [0, 1],
    isMobile ? [0, -50] : [-50, -100]
  );

  // Adjusted cardTranslateY with a new breakpoint for very large screens
  const cardTranslateY = useTransform(
    scrollYProgress,
    [0, 0.2],
    isMobile
      ? [0, 0] // Mobile: card moves 75px up
      : isVeryLargeScreen
      ? [0, 1] // Very Large Desktop (>1440px): card moves 20px up
      : [0, 11] // Medium Desktop (<=1440px): card moves 40px up
  );


  return (
    <div
      className="flex items-center justify-center relative   "
      ref={containerRef}
    >
      <div
        className=" w-full relative"
        style={{
          perspective: "1200px",
        }}
      >
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
      style={{
        translateY: translate,
      }}
      className="w-full mx-auto text-center absolute"
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
      className="mt-[-3px] h-[40rem] md:h-[60rem] w-full shadow-2xl"
    >
      <div className=" h-full w-full overflow-hidden   md:p-0 ">
        {children}
      </div>
    </motion.div>
  );
};
