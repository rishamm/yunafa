
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
    if (isMobile) return [1, 1.023];
    if (isVeryLargeScreen) return [1, 1.2]; //large
    return [1, 1.2]; 
  };

  const rotate = useTransform(scrollYProgress, [0, 1], [0, 92.784321]);
  const cardScale = useTransform(scrollYProgress, [0, 1], scaleDimensions());
  
  const headerTranslateY = useTransform(
    scrollYProgress,
    [0, 1],
    isMobile ? [0, 0] : [0, -100] 
  );
  
  const cardTranslateY = useTransform(
    scrollYProgress,
    [0, 0],
    isMobile
      ? [0, 0] 
      : isVeryLargeScreen
      ? [0, 0]  
      : [0, 0]  
  );


  return (
    <div
      className="flex items-center justify-center relative p-2 min-h-[60vh] md:min-h-[80vh]"
      ref={containerRef}
    >
      <div
        className="pt-10 md:pt-40 w-full relative"
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
      className="-mt-12 h-[30rem] md:h-[40rem] w-full  shadow-2xl"
    >
      <div className=" h-full w-full overflow-hidden   md:p-0 ">
        {children}
      </div>
    </motion.div>
  );
};

