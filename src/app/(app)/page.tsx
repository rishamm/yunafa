
import { getCategories, getCarouselItems } from '@/lib/data';
import type { Category, CarouselItem } from '@/lib/types';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { HomePageCarousel } from '@/components/sections/HomePageCarousel';
import { HeroScrollSection } from '@/components/sections/HeroScrollSection';
import { ParallaxSwiper } from '@/components/sections/ParallaxSwiper';


export default async function HomePage() {
  const categories: Category[] = await getCategories(); 
  const carouselItems: CarouselItem[] = await getCarouselItems();

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
      
      <HeroScrollSection />

      <section className="parallax-swiper-outer-wrap">
        <ParallaxSwiper />
      </section>
      
      {/* Sticky Banner Section - Now directly using Image components */}
      <section className="relative flex w-full flex-col my-12 md:my-20 bg-background rounded-lg ">
        <div className="relative mx-auto flex w-full max-w-7xl flex-col gap-10 py-8 px-4">
          <div className="relative w-full h-[180px] rounded-lg overflow-hidden shadow-lg">
            <Image
              src="https://images.unsplash.com/photo-1567419099214-0dd03b43e8de?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTY3fHx3b21lbiUyMGZhc2hpb24lMjBsYW5kc2NhcGUlMjBpbWFnZXxlbnwwfHwwfHx8MA%3D%3D"
              alt="Fashion Banner 1"
              fill
              className="object-cover"
              data-ai-hint="fashion style"
            />
          </div>
          <div className="relative w-full h-[180px] rounded-lg overflow-hidden shadow-lg">
            <Image
              src="https://images.unsplash.com/photo-1509319117193-57bab727e09d?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTV8fHdvbWVuJTIwZmFzaGlvbiUyMGxhbmRzY2FwZSUyMGltYWdlfGVufDB8fDB8fHww"
              alt="Fashion Banner 2"
              fill
              className="object-cover"
              data-ai-hint="model lifestyle"
            />
          </div>
          <div className="relative w-full h-[180px] rounded-lg overflow-hidden shadow-lg">
            <Image
              src="https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NzV8fHdvbWVuJTIwZmFzaGlvbiUyMGxhbmRzY2FwZSUyMGltYWdlfGVufDB8fDB8fHww"
              alt="Fashion Banner 3"
              fill
              className="object-cover"
              data-ai-hint="urban fashion"
            />
          </div>
        </div>
      </section>

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
              src="https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&h=600&fit=crop&q=60"
              alt="Artisanal products display in a boutique"
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
