
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
    if (isMobile) return [0.7, 0.9];
    if (isVeryLargeScreen) return [0.85, 1.0]; // Starts a bit larger on very large screens
    return [0.8, 1.0]; // Medium desktop
  };

  const rotate = useTransform(scrollYProgress, [0, 1], [89.65, 0]);
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
      ? [0, -75] // Mobile: card moves 75px up
      : isVeryLargeScreen
      ? [0, 10]   // Very Large Desktop (>1440px): card moves 10px down
      : [0, -40]  // Medium Desktop (<=1440px): card moves 40px up
  );


  return (
    <div
      className="flex items-center justify-center relative p-2 min-h-[60vh] md:min-h-[80vh]"
      ref={containerRef}
    >
      <div
        className="pt-10 md:pt-40 w-full relative"
        style={{
          perspective: "600px",
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
      className="div w-full mx-auto text-center" 
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
      className="-mt-12 h-[30rem] md:h-[40rem] w-full rounded-[30px] shadow-2xl"
    >
      <div className=" h-full w-full overflow-hidden rounded-2xl md:rounded-2xl md:p-0 ">
        {children}
      </div>
    </motion.div>
  );
};
