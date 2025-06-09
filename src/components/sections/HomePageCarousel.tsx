
"use client";

import { Carousel, Card as CarouselUICard } from "@/components/ui/carousel"; // Renamed import Card to CarouselUICard
import React from "react";

// Define the type for card data, matching the one in carousel.tsx
type CardData = {
  src: string;
  title: string;
  category: string;
  content: React.ReactNode;
  'data-ai-hint'?: string;
};


const cards: CardData[] = [
  {
    src: "https://images.unsplash.com/photo-1616583936499-d4116e7e2e76?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    title: "Timeless Elegance",
    category: "Luxury Watches",
    content: <p>Discover watches that are a testament to craftsmanship and precision. Each piece is a work of art.</p>,
    'data-ai-hint': "luxury watch",
  },
  {
    src: "http://images.unsplash.com/photo-1657367144402-73ed741837dc?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8ZXRobmljJTIwJTVDZmFzaGlvbnxlbnwwfHwwfHx8MA%3D%3D",
    title: "Sparkling Designs",
    category: "Fine Jewelry",
    content: <p>Adorn yourself with jewelry that tells a story. Exquisite designs for every occasion.</p>,
    'data-ai-hint': "ethnic fashion",
  },
  {
    src: "https://placehold.co/600x800.png",
    title: "Handcrafted Beauty",
    category: "Artisanal Decor",
    content: <p>Elevate your space with unique decor items, handcrafted by skilled artisans.</p>,
    'data-ai-hint': "home decor",
  },
  {
    src: "https://placehold.co/600x800.png",
    title: "Exquisite Tastes",
    category: "Gourmet Delights",
    content: <p>Indulge in a curated selection of gourmet foods and rare culinary ingredients.</p>,
    'data-ai-hint': "gourmet food",
  },
];

export function HomePageCarousel() {
  const carouselItems = cards.map((card, index) => (
    <CarouselUICard
      key={index}
      card={{ 
        src: card.src,
        title: card.title,
        category: card.category,
        content: card.content,
        'data-ai-hint': card['data-ai-hint'],
      }}
      index={index}
      layout // Enable layout animation
    />
  ));

  return (
    <section className="py-12">
      <h2 className="text-3xl font-bold mb-8 text-center font-headline">Featured Collections</h2>
      <Carousel items={carouselItems} />
    </section>
  );
}
