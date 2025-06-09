
import { getCategories, getCarouselItems } from '@/lib/data'; // Added getCarouselItems
import type { Category, CarouselItem } from '@/lib/types'; // Added CarouselItem type
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { HomePageCarousel } from '@/components/sections/HomePageCarousel';
import { ContainerScroll } from '@/components/ui/container-scroll-animation';

export default async function HomePage() {
  const categories: Category[] = await getCategories(); 
  const carouselItems: CarouselItem[] = await getCarouselItems();

  const titleComponent = (
    <>
      <h1 className="text-4xl md:text-6xl font-bold mb-6 font-headline text-foreground">
        Welcome to Yunafa
      </h1>
      <p className="text-lg md:text-xl text-foreground/80 mb-8 max-w-2xl mx-auto">
        Discover an exquisite collection of unique and luxurious items, curated for the discerning eye.
      </p>
      <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground transition-transform hover:scale-105">
        <Link href="#home-carousel">Explore Collection</Link>
      </Button>
    </>
  );

  return (
    <div className="space-y-16">
      <ContainerScroll titleComponent={titleComponent}>
        <div className="relative w-full h-full">
          <Image
            src="https://placehold.co/1200x800.png"
            alt="Yunafa Collection Showcase"
            fill
            className="object-cover rounded-2xl"
            data-ai-hint="luxury lifestyle"
            priority // Good to add priority for LCP element if this is high on the page
          />
        </div>
      </ContainerScroll>
      
      <section id="home-carousel">
        <HomePageCarousel items={carouselItems} />
      </section>

       <section className="py-12">
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
