'use client';
import { useRef, useEffect } from 'react';

interface FullScreenVideoProps {
  videoSrc: string;
  posterSrc: string;
  videoHint?: string;
}

export function FullScreenVideo({
  videoSrc,
  posterSrc,
  videoHint = "background video"
}: FullScreenVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(error => {
        console.warn("Video autoplay was prevented by the browser:", error);
      });
    }
  }, [videoSrc]);

  return (
    /* OUTER DIV: This is the 'Track'. 
      Because it is 'relative h-screen', the sticky video inside 
      is ONLY sticky while the user is looking at this specific 100vh block.
    */
    <div className="relative h-screen w-full">
      {/* INNER DIV: The actual sticky element. 
        Once you scroll past the 100vh above, this div will move UP.
      */}
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-zinc-950 z-0">
        <video
          ref={videoRef}
          src={videoSrc}
          poster={posterSrc}
          autoPlay
          loop
          muted
          playsInline
          className="absolute top-0 left-0 w-full h-full object-cover"
          data-ai-hint={videoHint}
        />
        {/* Subtle overlay to help text readability */}
        <div className="absolute inset-0 z-[1] bg-black/10" />

        {/* Bottom fade for smooth transition */}
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-zinc-950 to-transparent z-[2]" />
      </div>
    </div>
  );
}