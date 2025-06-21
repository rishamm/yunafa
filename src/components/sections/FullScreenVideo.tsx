// src/components/sections/FullScreenVideo.tsx
'use client';
import Link from 'next/link';

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
  const heroLinks = [
    { href: "/category/new-arrivals", label: "New Arrivals" },
    { href: "/category/best-sellers", label: "Best Sellers" },
    { href: "#home-carousel", label: "Collections" },
    { href: "/our-story", label: "Our Story" },
  ];

  return (
    <section className="relative h-screen w-full overflow-hidden bg-neutral-800">
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
       <nav className="absolute left-8 md:left-16 top-1/2 -translate-y-1/2 z-20 pointer-events-auto hidden md:block">
        <ul className="space-y-4">
          {heroLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="text-sm font-medium text-white underline hover:opacity-80 transition-opacity"
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
