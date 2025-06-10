
"use client"; 

import { Carousel, Card as CarouselUICard } from "@/components/ui/carousel";
import type { CardData } from "@/components/ui/carousel"; 
import React from "react"; 
import type { CarouselItem as CarouselItemType } from "@/lib/types"; 
// Removed Link import as it's not used
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

interface HomePageCarouselProps {
  items: CarouselItemType[]; 
}

function CarouselItemSkeleton() {
  return (
    <div className="relative z-10 flex h-80 w-56 flex-col items-start justify-start overflow-hidden rounded-3xl bg-muted/30 md:h-[40rem] md:w-96">
      <div className="relative z-40 p-8 w-full">
        <Skeleton className="h-4 w-1/3 mb-2 bg-muted" /> {/* Category */}
        <Skeleton className="h-6 w-3/4 bg-muted" />      {/* Title */}
      </div>
      {/* Background (image area) can just be the muted background */}
    </div>
  );
}

export function HomePageCarousel({ items }: HomePageCarouselProps) {
  if (!items || items.length === 0) {
    return (
      <section className="py-12">
        {/* Removed h2 heading from here */}
        <div className="flex w-full overflow-x-hidden py-10 md:py-20 justify-center">
          <div className="flex flex-row justify-start gap-4 pl-4">
            {[...Array(4)].map((_, index) => ( 
               <motion.div
                key={`skeleton-${index}`}
                className="rounded-3xl"
              >
                <CarouselItemSkeleton />
              </motion.div>
            ))}
          </div>
        </div>
         <div className="mr-10 flex justify-end gap-2">
          <Button
            variant="secondary"
            className="relative z-40 flex h-10 w-10 items-center justify-center rounded-full text-secondary-foreground hover:bg-primary/80 hover:text-primary-foreground disabled:opacity-50 transition-colors"
            disabled
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
          </Button>
           <Button
            variant="secondary"
            className="relative z-40 flex h-10 w-10 items-center justify-center rounded-full text-secondary-foreground hover:bg-primary/80 hover:text-primary-foreground disabled:opacity-50 transition-colors"
            disabled
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
          </Button>
        </div>
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
      {/* Removed h2 heading from here */}
      <Carousel items={carouselUiItems} />
    </section>
  );
}
