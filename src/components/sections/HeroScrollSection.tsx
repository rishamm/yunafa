
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ContainerScroll } from '@/components/ui/container-scroll-animation';

export function HeroScrollSection() {
  const heroTextContent = (
    <div className="max-w-5xl mx-auto text-center h-auto">
      <h1 className="text-4xl md:text-6xl font-bold mb-6 font-headline text-foreground">
        Welcome to Yunafa
      </h1>
      <p className="text-lg md:text-xl text-foreground/80 mb-8 max-w-2xl mx-auto">
        Discover an exquisite collection of unique and luxurious items, curated for the discerning eye.
      </p>
      <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground transition-transform hover:scale-105">
        <Link href="#home-carousel">Explore Collection</Link>
      </Button>
    </div>
  );

  return (
    <div className="relative flex flex-col justify-start pt-20 md:pt-40">
      <ContainerScroll titleComponent={<span className="text-base md:text-lg font-medium text-muted-foreground">Scroll to discover our showcase</span>}>
        <div className="relative w-full h-full">
          <Image
            src="https://plus.unsplash.com/premium_photo-1683143646131-92a439faca4d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8d29tZW4lMjBmYXNoaW9uJTIwbGFuZHNjYXBlJTIwaW1hZ2V8ZW58MHx8MHx8fDA%3D"
            alt="Yunafa Collection Showcase"
            fill
            className="object-cover bg-top rounded-2xl"
            data-ai-hint="fashion landscape"
            priority
          />
        </div>
      </ContainerScroll>
      {/* Absolutely positioned hero text on top */}
      <section className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center pt-10 md:pt-20 z-10 pointer-events-none">
          <div className="pointer-events-auto"> {/* Allow interaction with hero text content */}
               {heroTextContent}
          </div>
      </section>
    </div>
  );
}
