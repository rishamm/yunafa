
"use client"; 

import { Carousel, Card as CarouselUICard } from "@/components/ui/carousel";
import type { CardData } from "@/components/ui/carousel"; 
import React from "react"; // Removed useEffect, useState
import type { CarouselItem as CarouselItemType } from "@/lib/types"; 
import { Skeleton } from "@/components/ui/skeleton"; 

interface HomePageCarouselProps {
  items: CarouselItemType[]; // Accept items as a prop
}

export function HomePageCarousel({ items }: HomePageCarouselProps) {
  // items is guaranteed to be CarouselItemType[] by the parent page.tsx
  // If items array is empty, it means "no carousels loaded" from the data source.

  if (!items || items.length === 0) { 
    // Display skeletons if no items are available.
    return (
      <section className="py-12">
        <h2 className="text-3xl font-bold mb-8 text-center font-headline">Collections</h2>
        <div className="flex justify-center gap-4 py-10">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-80 w-56 md:h-[40rem] md:w-96 rounded-3xl" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  // If items exist, map them to CarouselUICard components
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

  // Render the Carousel with the items
  return (
    <section className="py-12">
      <h2 className="text-3xl font-bold mb-8 text-center font-headline">Collections</h2>
      <Carousel items={carouselUiItems} />
    </section>
  );
}
