
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
    return () => {
      window.removeEventListener("resize", checkScreenSize);
    };
  }, []);

  const scaleDimensions = () => {
    if (isMobile) return [0.7, 0.9]; // mobile: starts smaller, ends a bit smaller than full
    if (isVeryLargeScreen) return [0.85, 1.0]; // very large: starts larger, ends at full
    return [0.8, 1.0]; // medium desktop: default
  };

  const rotate = useTransform(scrollYProgress, [0, 1], [20, 0]);
  const cardScale = useTransform(scrollYProgress, [0, 1], scaleDimensions());
  
  const headerTranslateY = useTransform(
    scrollYProgress,
    [0, 1],
    isMobile ? [0, -60] : [0, -100] 
  );
  
  const cardTranslateY = useTransform(
    scrollYProgress,
    [0, 1],
    isMobile
      ? [0, -75] 
      : isVeryLargeScreen
      ? [0, -20]  // Moves 20px up on very large screens
      : [0, -40]  // Moves 40px up on medium desktop screens
  );


  return (
    <div
      className="flex items-center justify-center relative p-2 min-h-[60vh] md:min-h-[80vh]"
      ref={containerRef}
    >
      <div
        className="pt-12 md:pt-44 w-full relative" // Increased top padding here
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
      className="w-full mx-auto text-center" // Corrected className
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
      className="-mt-10 h-[30rem] md:h-[40rem] w-full shadow-2xl" // Reduced negative top margin
    >
      <div className=" h-full w-full overflow-hidden   md:p-0 ">
        {children}
      </div>
    </motion.div>
  );
};
