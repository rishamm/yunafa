
"use client";

import { Carousel, Card as CarouselUICard, type CardData } from "@/components/ui/carousel";
import React from "react";
import type { CarouselItem as CarouselItemType } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

interface HomePageCarouselProps {
  items: CarouselItemType[];
  leadingElement?: React.ReactNode; 
}

function CarouselItemSkeleton() {
  return (
    <div className="relative z-10 flex h-80 w-56 flex-col items-start justify-start overflow-hidden rounded-3xl bg-muted/30 md:h-[40rem] md:w-96">
      <div className="relative z-40 p-8 w-full">
        <Skeleton className="h-4 w-1/3 mb-2 bg-muted" /> {/* Category */}
        <Skeleton className="h-6 w-3/4 bg-muted" />      {/* Title */}
      </div>
      {/* No skeleton for image/video area as it's conditional */}
    </div>
  );
}

export function HomePageCarousel({ items, leadingElement }: HomePageCarouselProps) {
  const hasActualItems = items && items.length > 0;
  let itemsForUiCarousel: React.ReactNode[];

  if (hasActualItems) {
    itemsForUiCarousel = items.map((item, index) => {
      const cardData: CardData = {
        // No src (image) by default
        title: item.title,
        category: item.category,
        content: <p>{item.content}</p>,
        videoSrc: item.videoSrc || undefined, // Pass videoSrc if available
      };

      return (
        <CarouselUICard
          key={item.id || `carousel-card-${index}`}
          card={cardData}
          index={index}
          layout
        />
      );
    });
  } else {
    const skeletonCount = leadingElement ? 3 : 4;
    itemsForUiCarousel = [...Array(skeletonCount)].map((_, index) => (
      <CarouselItemSkeleton key={`skeleton-for-ui-${index}`} />
    ));
  }

  const finalAssembly: React.ReactNode[] = [];
  if (leadingElement) {
    finalAssembly.push(leadingElement);
  }
  finalAssembly.push(...itemsForUiCarousel);

  if (finalAssembly.length === 0 && !leadingElement) {
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
