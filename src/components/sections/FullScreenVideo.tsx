// src/components/sections/FullScreenVideo.tsx
'use client';

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
  return (
    <section className="sticky top-0 h-screen w-full overflow-hidden bg-neutral-800 z-10"> {/* Made sticky, z-10 */}
      <video
        key={videoSrc} 
        src={videoSrc}
        poster={posterSrc}
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover z-0" // video itself is z-0 within this section
        data-ai-hint={videoHint} 
      >
        Your browser does not support the video tag.
      </video>
      <div
        className="absolute inset-0 z-[1] pointer-events-none" // Overlay is z-1 within this section
        style={{
          width: '100%',
          height: '100%',
          backgroundSize: '100px',
          backgroundRepeat: 'repeat',
          backgroundImage: "url('/overlay.png')", // Using local overlay.png
          opacity: 0.1, // Adjusted opacity for local overlay
          borderRadius: 0,
        }}
        aria-hidden="true"
      />
    </section>
  );
}
