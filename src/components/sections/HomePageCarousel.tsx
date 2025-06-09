
"use client"; 

import { Carousel, Card as CarouselUICard } from "@/components/ui/carousel";
import type { CardData } from "@/components/ui/carousel"; 
import React, { useEffect, useState } from "react";
// getCarouselItems is no longer fetched here, data comes via props
import type { CarouselItem as CarouselItemType } from "@/lib/types"; 
import { Skeleton } from "@/components/ui/skeleton"; 

interface HomePageCarouselProps {
  items: CarouselItemType[]; // Accept items as a prop
}

export function HomePageCarousel({ items }: HomePageCarouselProps) {
  // Removed internal useState for items and loading. Data is now passed via props.
  // This makes the component simpler and reliant on its parent for data.

  // Still show skeleton if items are not yet available (e.g. parent is loading)
  // or if items array is empty initially before parent passes them.
  // However, since HomePage (parent) is a server component, items should always be populated or empty.
  // The skeleton part is more for client-side fetching patterns, but we can keep a simplified version.
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // If items are passed, we are not loading.
    // This effect helps if there's any brief delay or if items prop could change.
    if (items && items.length >= 0) { // Check items.length >= 0 to handle empty array correctly
      setIsLoading(false);
    }
  }, [items]);


  if (isLoading && (!items || items.length === 0)) { // Show skeleton only if truly no items yet and loading
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

  if (!items || !items.length) {
    return (
       <section className="py-12">
        <h2 className="text-3xl font-bold mb-8 text-center font-headline">Collections</h2>
        <p className="text-center text-muted-foreground">No collections to display at the moment.</p>
      </section>
    );
  }

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

  return (
    <section className="py-12">
      <h2 className="text-3xl font-bold mb-8 text-center font-headline">Collections</h2>
      {carouselUiItems.length > 0 ? <Carousel items={carouselUiItems} /> : <p className="text-center text-muted-foreground">No collections to display.</p>}
    </section>
  );
}
