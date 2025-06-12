
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

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  const scaleDimensions = () => {
    return isMobile ? [0.7, 0.9] : [0.8, 1];
  };

  const rotate = useTransform(scrollYProgress, [0, 1], [89.65, 0]);
  const cardScale = useTransform(scrollYProgress, [0, 1], scaleDimensions());
  const headerTranslateY = useTransform(scrollYProgress, [0, 1], [0, -100]); 
  // Adjusting cardTranslateY: less upward movement for desktop
  const cardTranslateY = useTransform(scrollYProgress, [0, 1], isMobile ? [0, -75] : [0, -40]);


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
      className="div max-w-5xl mx-auto text-center" 
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
        translateY: translateY, // Apply translateY here
      }}
      className="-mt-12 h-[30rem] md:h-[40rem] w-full rounded-[30px] shadow-2xl"
    >
      <div className=" h-full w-full overflow-hidden rounded-2xl md:rounded-2xl md:p-0 ">
        {children}
      </div>
    </motion.div>
  );
};

