
'use client';
import Link from 'next/link';
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

  const heroLinks = [
    { href: "/category/ethnic", label: "Ethnic" },
    { href: "/category/casual", label: "Casual" },
    { href: "/category/traditional", label: "Traditional" },
    { href: "/category/modest", label: "Modest" },
    { href: "/category/western", label: "Western" },
    { href: "/category/korean", label: "Korean" },
    { href: "/category/junior", label: "Junior" },
    { href: "/category/tervibe", label: "Tervibe" },
  ];

  return (
    <section className="relative h-screen w-full overflow-hidden bg-neutral-800">
      <video
        ref={videoRef}
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
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          width: '100%',
          height: '100%',
          backgroundSize: '100px',
          backgroundRepeat: 'repeat',
          backgroundImage: "url('/overlay.png')", 
          opacity: 0.1, 
          borderRadius: 0,
        }}
        aria-hidden="true"
      />
       <nav className="fixed left-8 md:left-16 bottom-[7rem] z-40 pointer-events-auto">
        <ul className="space-y-4">
          {heroLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="inline-block font-plex-mono text-xs font-normal uppercase tracking-normal leading-[1.6] text-white hover:opacity-80 transition-opacity"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </section>
  );
}
