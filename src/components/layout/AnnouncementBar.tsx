'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useScroll } from 'framer-motion';

export function AnnouncementBar({ targetId = 'hero-scroll' }: { targetId?: string }) {
  const [show, setShow] = useState(true);
  const targetRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    targetRef.current = document.getElementById(targetId);
  }, [targetId]);

  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ['start start', 'end start'],
  });

  useEffect(() => {
    const unsubscribe = scrollYProgress.onChange((progress) => {
      setShow(progress < 0.1); // visible when above 10% of section
    });
    return () => unsubscribe();
  }, [scrollYProgress]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          exit={{ y: -100 }}
          transition={{ duration: 0.4 }}
          className="fixed top-0 left-0 w-full z-50 bg-white text-black text-center py-1 z-[51]"
        >
           welcome to {"    "}yunafa !
        </motion.div>
      )}
    </AnimatePresence>
  );
}
