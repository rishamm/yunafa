
export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  categoryIds: string[];
  tags: string[];
  'data-ai-hint'?: string; // Ensure this is part of the Product type
}

export interface CarouselItem {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  content: string; // Stored as simple text/string from CMS
  dataAiHint?: string;
  videoSrc?: string; // Added for video support
}
