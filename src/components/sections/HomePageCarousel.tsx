
"use client"; 

import { Carousel, Card as CarouselUICard } from "@/components/ui/carousel";
import type { CardData } from "@/components/ui/carousel"; 
import React from "react"; 
import type { CarouselItem as CarouselItemType } from "@/lib/types"; 
// Skeleton import removed as it's no longer used

interface HomePageCarouselProps {
  items: CarouselItemType[]; 
}

export function HomePageCarousel({ items }: HomePageCarouselProps) {
  // items is guaranteed to be CarouselItemType[] by the parent page.tsx
  // If items array is empty, it means "no carousels loaded" from the data source.

  // Removed skeleton rendering block.
  // If items is empty, carouselUiItems will be empty, and the Carousel component will render without cards.

  const carouselUiItems = items.map((item, index) => (
    <CarouselUICard
      key={item.id || index} 
      card={{ 
        src: item.imageUrl,
        title: item.title,
        category: item.category,
        content: <p>{item.content}</p>, 
        'data-ai-hint': item.dataAiHint || item.category.toLowerCase(),
      }}
      index={index}
      layout 
    />
  ));

  // Render the Carousel with the items (or an empty array if no items)
  return (
    <section className="py-12">
      <h2 className="text-3xl font-bold mb-8 text-center font-headline">Collections</h2>
      <Carousel items={carouselUiItems} />
    </section>
  );
}

