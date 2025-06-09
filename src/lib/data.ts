
import type { Product, Category, CarouselItem } from './types';

let categories: Category[] = [
  { id: '1', name: 'Luxury Timepieces', slug: 'luxury-timepieces', description: 'Exquisite watches from renowned craftsmen.' },
  { id: '2', name: 'Fine Jewelry', slug: 'fine-jewelry', description: 'Elegant necklaces, bracelets, and rings.' },
  { id: '3', name: 'Artisanal Decor', slug: 'artisanal-decor', description: 'Handcrafted items to beautify your space.' },
  { id: '4', name: 'Gourmet Delights', slug: 'gourmet-delights', description: 'Exclusive culinary experiences and products.' },
];

let products: Product[] = [
  { id: '1', name: 'ChronosMaster Elite', description: 'A masterpiece of horological engineering, featuring a platinum case and sapphire crystal.', price: 12500, imageUrl: 'https://placehold.co/600x400.png', categoryIds: ['1'], tags: ['watch', 'luxury', 'platinum'], "data-ai-hint": "luxury watch" },
  { id: '2', name: 'Seraphina Diamond Necklace', description: 'An enchanting necklace adorned with ethically sourced diamonds, set in 18k white gold.', price: 8800, imageUrl: 'https://placehold.co/600x400.png', categoryIds: ['2'], tags: ['necklace', 'diamond', 'gold'], "data-ai-hint": "diamond necklace" },
  { id: '3', name: 'Azure Ceramic Vase', description: 'A stunning hand-thrown ceramic vase with a unique azure glaze, perfect for contemporary homes.', price: 350, imageUrl: 'https://placehold.co/600x400.png', categoryIds: ['3'], tags: ['vase', 'ceramic', 'decor'], "data-ai-hint": "blue dress"  },
  { id: '4', name: 'Vintage Leather Armchair', description: 'A classic armchair upholstered in rich, patinated leather. Timeless comfort and style.', price: 2200, imageUrl: 'https://placehold.co/600x400.png', categoryIds: ['3'], tags: ['furniture', 'leather', 'vintage'], "data-ai-hint": "leather jacket" },
  { id: '5', name: 'Organic Truffle Oil Set', description: 'A selection of the finest organic truffle oils, sourced from Italian artisans.', price: 120, imageUrl: 'https://placehold.co/600x400.png', categoryIds: ['4'], tags: ['gourmet', 'truffle', 'organic'], "data-ai-hint": "knit sweater" },
  { id: '6', name: 'Silk Scarf "Impression"', description: 'A luxurious silk scarf featuring an abstract impressionist design. Hand-rolled edges.', price: 280, imageUrl: 'https://placehold.co/600x400.png', categoryIds: ['2'], tags: ['scarf', 'silk', 'fashion'], "data-ai-hint": "silk scarf" },
];

let carouselItems: CarouselItem[] = [
  {
    id: 'car1',
    src: "https://images.unsplash.com/photo-1616583936499-d4116e7e2e76?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    title: "Timeless Elegance",
    category: "Luxury Watches",
    content: "Discover watches that are a testament to craftsmanship and precision. Each piece is a work of art.",
    dataAiHint: "luxury watch",
    // Keep existing imageUrl naming for consistency with Product, but map 'src' from existing data
    imageUrl: "https://images.unsplash.com/photo-1616583936499-d4116e7e2e76?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 'car2',
    src: "http://images.unsplash.com/photo-1657367144402-73ed741837dc?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8ZXRobmljJTIwJTVDZmFzaGlvbnxlbnwwfHwwfHx8MA%3D%3D",
    title: "Sparkling Designs",
    category: "Fine Jewelry",
    content: "Adorn yourself with jewelry that tells a story. Exquisite designs for every occasion.",
    dataAiHint: "ethnic fashion",
    imageUrl: "http://images.unsplash.com/photo-1657367144402-73ed741837dc?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8ZXRobmljJTIwJTVDZmFzaGlvbnxlbnwwfHwwfHx8MA%3D%3D",
  },
  {
    id: 'car3',
    src: "https://placehold.co/600x800.png",
    title: "Handcrafted Beauty",
    category: "Artisanal Decor",
    content: "Elevate your space with unique decor items, handcrafted by skilled artisans.",
    dataAiHint: "home decor",
    imageUrl: "https://placehold.co/600x800.png",
  },
  {
    id: 'car4',
    src: "https://placehold.co/600x800.png",
    title: "Exquisite Tastes",
    category: "Gourmet Delights",
    content: "Indulge in a curated selection of gourmet foods and rare culinary ingredients.",
    dataAiHint: "gourmet food",
    imageUrl: "https://placehold.co/600x800.png",
  },
].map(item => ({ ...item, imageUrl: item.src, dataAiHint: item.dataAiHint || item.category.toLowerCase() }));


// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Category Functions
export async function getCategories(): Promise<Category[]> {
  await delay(100);
  return [...categories];
}

export async function getCategoryById(id: string): Promise<Category | undefined> {
  await delay(100);
  return categories.find(cat => cat.id === id);
}

export async function getCategoryBySlug(slug: string): Promise<Category | undefined> {
  await delay(100);
  return categories.find(cat => cat.slug === slug);
}

export async function createCategory(categoryData: Omit<Category, 'id' | 'slug'>): Promise<Category> {
  await delay(100);
  const newCategory: Category = {
    ...categoryData,
    id: String(categories.length + 1 + Math.random()), // ensure unique id
    slug: categoryData.name.toLowerCase().replace(/\s+/g, '-'),
  };
  categories.push(newCategory);
  return newCategory;
}

export async function updateCategory(id: string, updates: Partial<Omit<Category, 'id' | 'slug'>>): Promise<Category | null> {
  await delay(100);
  const categoryIndex = categories.findIndex(cat => cat.id === id);
  if (categoryIndex === -1) return null;
  
  const originalCategory = categories[categoryIndex];
  const updatedCategory = { ...originalCategory, ...updates };
  if (updates.name && updates.name !== originalCategory.name) {
    updatedCategory.slug = updates.name.toLowerCase().replace(/\s+/g, '-');
  }
  
  categories[categoryIndex] = updatedCategory;
  return updatedCategory;
}

export async function deleteCategory(id: string): Promise<boolean> {
  await delay(100);
  const initialLength = categories.length;
  categories = categories.filter(cat => cat.id !== id);
  // Also remove this categoryId from products
  products = products.map(p => ({
    ...p,
    categoryIds: p.categoryIds.filter(catId => catId !== id)
  }));
  return categories.length < initialLength;
}

// Product Functions
export async function getProducts(limit?: number): Promise<Product[]> {
  await delay(100);
  const sortedProducts = [...products].sort((a, b) => parseFloat(a.id) - parseFloat(b.id));
  return limit ? sortedProducts.slice(0, limit) : sortedProducts;
}

export async function getProductById(id: string): Promise<Product | undefined> {
  await delay(100);
  return products.find(prod => prod.id === id);
}

export async function getProductsByCategoryId(categoryId: string): Promise<Product[]> {
  await delay(100);
  return products.filter(prod => prod.categoryIds.includes(categoryId));
}

export async function createProduct(productData: Omit<Product, 'id'>): Promise<Product> {
  await delay(100);
  const newProduct: Product = {
    ...productData,
    id: String(products.length + 1 + Math.random()), // ensure unique id
  };
  products.push(newProduct);
  return newProduct;
}

export async function updateProduct(id: string, updates: Partial<Omit<Product, 'id'>>): Promise<Product | null> {
  await delay(100);
  const productIndex = products.findIndex(prod => prod.id === id);
  if (productIndex === -1) return null;
  products[productIndex] = { ...products[productIndex], ...updates };
  return products[productIndex];
}

export async function deleteProduct(id: string): Promise<boolean> {
  await delay(100);
  const initialLength = products.length;
  products = products.filter(prod => prod.id !== id);
  return products.length < initialLength;
}

// Carousel Item Functions
export async function getCarouselItems(): Promise<CarouselItem[]> {
  await delay(50);
  return [...carouselItems];
}

export async function getCarouselItemById(id: string): Promise<CarouselItem | undefined> {
  await delay(50);
  return carouselItems.find(item => item.id === id);
}

export async function createCarouselItem(itemData: Omit<CarouselItem, 'id'>): Promise<CarouselItem> {
  await delay(100);
  const newItem: CarouselItem = {
    ...itemData,
    id: `car${carouselItems.length + 1 + Math.random()}`, // ensure unique id
  };
  carouselItems.push(newItem);
  return newItem;
}

export async function updateCarouselItem(id: string, updates: Partial<Omit<CarouselItem, 'id'>>): Promise<CarouselItem | null> {
  await delay(100);
  const itemIndex = carouselItems.findIndex(item => item.id === id);
  if (itemIndex === -1) return null;
  carouselItems[itemIndex] = { ...carouselItems[itemIndex], ...updates };
  return carouselItems[itemIndex];
}

export async function deleteCarouselItem(id: string): Promise<boolean> {
  await delay(100);
  const initialLength = carouselItems.length;
  carouselItems = carouselItems.filter(item => item.id !== id);
  return carouselItems.length < initialLength;
}
