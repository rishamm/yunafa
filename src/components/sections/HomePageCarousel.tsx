
"use client"; // Keep this if hooks like useState/useEffect are used, or for interactivity

import { Carousel, Card as CarouselUICard } from "@/components/ui/carousel";
import type { CardData } from "@/components/ui/carousel"; // Import the type
import React, { useEffect, useState } from "react";
import { getCarouselItems } from "@/lib/data"; // Fetch dynamic data
import type { CarouselItem as CarouselItemType } from "@/lib/types"; // CMS item type
import { Skeleton } from "@/components/ui/skeleton"; // For loading state

// This component now needs to be async if we fetch data directly,
// or it needs to receive data as props, or use a client-side fetch.
// For simplicity with `getCarouselItems` being async, we'll make a wrapper or fetch on client.

// Client component to handle fetching and rendering
export function HomePageCarousel() {
  const [items, setItems] = useState<CarouselItemType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const fetchedItems = await getCarouselItems();
        setItems(fetchedItems);
      } catch (error) {
        console.error("Failed to load carousel items:", error);
        // Optionally set some error state here
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <section className="py-12">
        <h2 className="text-3xl font-bold mb-8 text-center font-headline">Featured Collections</h2>
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

  if (!items.length) {
    return (
       <section className="py-12">
        <h2 className="text-3xl font-bold mb-8 text-center font-headline">Featured Collections</h2>
        <p className="text-center text-muted-foreground">No featured collections to display at the moment.</p>
      </section>
    );
  }

  const carouselUiItems = items.map((item, index) => (
    <CarouselUICard
      key={item.id || index} // Use item.id if available
      card={{ 
        src: item.imageUrl,
        title: item.title,
        category: item.category,
        content: <p>{item.content}</p>, // Wrap string content in a P tag
        'data-ai-hint': item.dataAiHint || item.category.toLowerCase(),
      }}
      index={index}
      layout // Enable layout animation
    />
  ));

  return (
    <section className="py-12">
      <h2 className="text-3xl font-bold mb-8 text-center font-headline">Featured Collections</h2>
      {carouselUiItems.length > 0 ? <Carousel items={carouselUiItems} /> : <p className="text-center text-muted-foreground">Loading collections...</p>}
    </section>
  );
}
