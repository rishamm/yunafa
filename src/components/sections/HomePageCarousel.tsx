
"use client";

import { Carousel, Card as CarouselUICard } from "@/components/ui/carousel";
// CardData is not explicitly used here but is part of CarouselUICard's props
// import type { CardData } from "@/components/ui/carousel";
import React from "react";
import type { CarouselItem as CarouselItemType } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

interface HomePageCarouselProps {
  items: CarouselItemType[];
  leadingElement?: React.ReactNode; // New prop for the leading element
}

function CarouselItemSkeleton() {
  return (
    <div className="relative z-10 flex h-80 w-56 flex-col items-start justify-start overflow-hidden rounded-3xl bg-muted/30 md:h-[40rem] md:w-96">
      <div className="relative z-40 p-8 w-full">
        <Skeleton className="h-4 w-1/3 mb-2 bg-muted" /> {/* Category */}
        <Skeleton className="h-6 w-3/4 bg-muted" />      {/* Title */}
      </div>
    </div>
  );
}

export function HomePageCarousel({ items, leadingElement }: HomePageCarouselProps) {
  const hasActualItems = items && items.length > 0;
  let itemsForUiCarousel: React.ReactNode[];

  if (hasActualItems) {
    itemsForUiCarousel = items.map((item, index) => (
      <CarouselUICard
        key={item.id || `carousel-card-${index}`}
        card={{
          src: item.imageUrl,
          title: item.title,
          category: item.category,
          content: <p>{item.content}</p>,
          'data-ai-hint': item.dataAiHint || item.category.toLowerCase(),
        }}
        index={index} // This is the logical 0-based index for the card itself
        layout
      />
    ));
  } else {
    // Prepare skeleton cards if no actual items
    // The number of skeletons can adjust based on whether a leadingElement is present
    const skeletonCount = leadingElement ? 3 : 4;
    itemsForUiCarousel = [...Array(skeletonCount)].map((_, index) => (
      <CarouselItemSkeleton key={`skeleton-for-ui-${index}`} />
    ));
  }

  const finalAssembly: React.ReactNode[] = [];
  if (leadingElement) {
    // The Carousel component will wrap this in a motion.div with key="card0"
    finalAssembly.push(leadingElement);
  }
  finalAssembly.push(...itemsForUiCarousel);

  // Fallback for when JS might be disabled or initial load before hydration/items are processed by Carousel component
  // This block is less critical if Carousel handles empty `finalAssembly` well or if `finalAssembly` always has skeletons.
  if (finalAssembly.length === 0 && !leadingElement) { // Only show this very basic skeleton if truly nothing to show
     return (
      <section>
        <div className="flex w-full overflow-x-hidden py-10 md:py-20 justify-center">
          <div className="flex flex-row justify-start gap-4 pl-4">
            {[...Array(4)].map((_, index) => (
               <motion.div
                key={`empty-skeleton-${index}`}
                className="rounded-3xl"
              >
                <CarouselItemSkeleton />
              </motion.div>
            ))}
          </div>
        </div>
         <div className="mr-10 flex justify-end gap-2">
          {/* Placeholder buttons, actual buttons are inside <Carousel /> */}
          <Button variant="secondary" className="relative z-40 h-10 w-10" disabled>...</Button>
          <Button variant="secondary" className="relative z-40 h-10 w-10" disabled>...</Button>
        </div>
      </section>
    );
  }

  return (
    <section>
      <Carousel items={finalAssembly} />
    </section>
  );
}
