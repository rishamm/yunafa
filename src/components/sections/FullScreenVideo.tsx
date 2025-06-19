
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
    <section className="relative w-full h-full overflow-hidden bg-neutral-800">
      <video
        key={videoSrc} 
        src={videoSrc}
        poster={posterSrc}
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
        data-ai-hint={videoHint} 
      >
        Your browser does not support the video tag.
      </video>
      {/* You can add content on top of the video here if needed */}
      {/* Example overlay:
      <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/30">
        <h2 className="text-white text-4xl font-bold font-headline">Immersive Video Experience</h2>
      </div>
      */}
    </section>
  );
}

