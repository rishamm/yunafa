
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
    return isMobile ? [0.7, 0.9] : [0.8, 1.2];
  };

  const rotate = useTransform(scrollYProgress, [0, 1], [96.7, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], scaleDimensions());
  const translate = useTransform(scrollYProgress, [0, 0], [0, -100]); // Adjusted translate for more initial visibility

  return (
    <div
      className="flex items-center justify-center relative p-2 md:p-20" // This padding defines the bounds for the "full-width" card
      ref={containerRef}
    >
      <div
        className="pt-10 md:pt-40 w-full relative"
        style={{
          perspective: "600px",
        }}
      >
        <Header translate={translate} titleComponent={titleComponent} />
        <Card rotate={rotate} translate={translate} scale={scale}>
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
      className="div max-w-5xl mx-auto text-center" // Header text remains centered and max-width
    >
      {titleComponent}
    </motion.div>
  );
};

export const Card = ({
  rotate,
  scale,
  children,
  // translate prop is passed but not used in the original code, keeping it for now
}: {
  rotate: MotionValue<number>;
  scale: MotionValue<number>;
  translate: MotionValue<number>; 
  children: React.ReactNode;
}) => {
  return (
    <motion.div
      style={{
        rotateX: rotate,
      
       
      }}
      className="-mt-12 h-[30rem] md:h-[40rem] w-full   rounded-[30px] shadow-2xl" // Removed max-w-5xl and mx-auto
    >
      <div className=" h-full w-full  overflow-hidden rounded-2xl  md:rounded-2xl md:p-0 ">
        {children}
      </div>
    </motion.div>
  );
};
