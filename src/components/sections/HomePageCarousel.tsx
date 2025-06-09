
"use client"; 

import { Carousel, Card as CarouselUICard } from "@/components/ui/carousel";
import type { CardData } from "@/components/ui/carousel"; 
import React from "react"; 
import type { CarouselItem as CarouselItemType } from "@/lib/types"; 
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface HomePageCarouselProps {
  items: CarouselItemType[]; 
}

export function HomePageCarousel({ items }: HomePageCarouselProps) {
  if (!items || items.length === 0) {
    return (
      <section className="py-12">
        <h2 className="text-3xl font-bold mb-8 text-center font-headline">Collections</h2>
        <div className="text-center text-muted-foreground py-10 border border-dashed rounded-lg">
          <p className="mb-2">No collections to display at the moment.</p>
          <p className="text-sm">
            You can add new carousel items via the{' '}
            <Button variant="link" asChild className="p-0 h-auto text-sm">
                <Link href="/admin/carousel/new">Admin Panel</Link>
            </Button>.
            </p>
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
      <h2 className="text-3xl font-bold mb-8 text-center font-headline">Collections</h2>
      <Carousel items={carouselUiItems} />
    </section>
  );
}

