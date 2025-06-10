
import { getCategories, getCarouselItems } from '@/lib/data';
import type { Category, CarouselItem } from '@/lib/types';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { HomePageCarousel } from '@/components/sections/HomePageCarousel';
import { ContainerScroll } from '@/components/ui/container-scroll-animation';

export default async function HomePage() {
  const categories: Category[] = await getCategories(); // Not used directly here, but good for context
  const carouselItems: CarouselItem[] = await getCarouselItems();

  const heroTextContent = (
    // This div is positioned absolutely by its parent
    <div className="max-w-5xl mx-auto text-center h-auto"> {/* Adjusted height to auto, parent controls positioning */}
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

  const collectionsHeadingElement = (
    <div className="flex-shrink-0 h-full flex items-center justify-center px-2 md:px-4">
      <div className="h-80 md:h-[40rem] flex items-center">
        <h2
          className="transform -rotate-90 whitespace-nowrap text-3xl md:text-4xl font-bold font-headline text-foreground tracking-widest uppercase origin-center"
        >
          Collections
        </h2>
      </div>
    </div>
  );

  return (
    <div className="space-y-12 md:space-y-20 flex flex-col ">
      {/* Hero Section with ContainerScroll Background - RELATIVE positioning for absolute children */}
      <div className="relative flex flex-col items-center justify-start pt-20 md:pt-40"> {/* Parent for overlay */}
        <ContainerScroll titleComponent={<span className="text-base md:text-lg font-medium text-muted-foreground">Scroll to discover our showcase</span>}>
          <div className="relative w-full h-full">
            <Image
              src="https://images.unsplash.com/photo-1644429909407-85e23c35a95d?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjQ1fHx3b21lbiUyMGZhc2hpb24lMjBsYW5kc2NhcGUlMjBpbWFnZXxlbnwwfHwwfHx8MA%3D%3D"
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

      {/* Carousel Section with leading Collections heading */}
      <section id="home-carousel" className="py-10 md:py-16">
        <HomePageCarousel items={carouselItems} leadingElement={collectionsHeadingElement} />
      </section>

       <section className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6 font-headline">About Yunafa</h2>
            <p className="text-foreground/80 mb-4">
              At Yunafa, we believe in the art of fine living. Our mission is to bring you a curated selection of products that embody craftsmanship, elegance, and timeless appeal. Each item in our collection is chosen with meticulous care, ensuring it meets our high standards of quality and design.
            </p>
            <p className="text-foreground/80 mb-6">
              Whether you are looking for a statement piece for your home, a unique gift, or a personal treasure, Yunafa offers an unparalleled shopping experience.
            </p>
            <Button asChild variant="outline" className="border-primary text-primary hover:bg-primary/10">
              <Link href="/contact">Learn More</Link>
            </Button>
          </div>
          <div className="rounded-lg overflow-hidden shadow-xl aspect-video relative">
            <Image
              src="https://placehold.co/800x600.png"
              alt="Artisanal products"
              fill
              className="object-cover"
              data-ai-hint="fashion boutique"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
