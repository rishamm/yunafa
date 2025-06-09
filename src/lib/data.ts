
import type { Product, Category, CarouselItem } from './types';
import fs from 'fs/promises';
import path from 'path';

// --- Configuration for File-based Storage ---
const DATA_DIR = path.join(process.cwd(), 'data');
const CATEGORIES_FILE = path.join(DATA_DIR, 'categories.json');
const PRODUCTS_FILE = path.join(DATA_DIR, 'products.json');
const CAROUSEL_ITEMS_FILE = path.join(DATA_DIR, 'carouselItems.json');

// --- Default Data (used if files don't exist) ---
const defaultCategories: Category[] = [
  { id: '1', name: 'Luxury Timepieces', slug: 'luxury-timepieces', description: 'Exquisite watches from renowned craftsmen.' },
  { id: '2', name: 'Fine Jewelry', slug: 'fine-jewelry', description: 'Elegant necklaces, bracelets, and rings.' },
  { id: '3', name: 'Artisanal Decor', slug: 'artisanal-decor', description: 'Handcrafted items to beautify your space.' },
  { id: '4', name: 'Gourmet Delights', slug: 'gourmet-delights', description: 'Exclusive culinary experiences and products.' },
];

const defaultProducts: Product[] = [
  { id: '1', name: 'ChronosMaster Elite', description: 'A masterpiece of horological engineering, featuring a platinum case and sapphire crystal.', price: 12500, imageUrl: 'https://placehold.co/600x400.png', categoryIds: ['1'], tags: ['watch', 'luxury', 'platinum'], "data-ai-hint": "luxury watch" },
  { id: '2', name: 'Seraphina Diamond Necklace', description: 'An enchanting necklace adorned with ethically sourced diamonds, set in 18k white gold.', price: 8800, imageUrl: 'https://placehold.co/600x400.png', categoryIds: ['2'], tags: ['necklace', 'diamond', 'gold'], "data-ai-hint": "diamond necklace" },
  { id: '3', name: 'Azure Ceramic Vase', description: 'A stunning hand-thrown ceramic vase with a unique azure glaze, perfect for contemporary homes.', price: 350, imageUrl: 'https://placehold.co/600x400.png', categoryIds: ['3'], tags: ['vase', 'ceramic', 'decor'], "data-ai-hint": "blue dress"  },
  { id: '4', name: 'Vintage Leather Armchair', description: 'A classic armchair upholstered in rich, patinated leather. Timeless comfort and style.', price: 2200, imageUrl: 'https://placehold.co/600x400.png', categoryIds: ['3'], tags: ['furniture', 'leather', 'vintage'], "data-ai-hint": "leather jacket" },
  { id: '5', name: 'Organic Truffle Oil Set', description: 'A selection of the finest organic truffle oils, sourced from Italian artisans.', price: 120, imageUrl: 'https://placehold.co/600x400.png', categoryIds: ['4'], tags: ['gourmet', 'truffle', 'organic'], "data-ai-hint": "knit sweater" },
  { id: '6', name: 'Silk Scarf "Impression"', description: 'A luxurious silk scarf featuring an abstract impressionist design. Hand-rolled edges.', price: 280, imageUrl: 'https://placehold.co/600x400.png', categoryIds: ['2'], tags: ['scarf', 'silk', 'fashion'], "data-ai-hint": "silk scarf" },
];

const defaultCarouselItems: CarouselItem[] = [
  {
    id: 'car1',
    title: "Timeless Elegance",
    category: "Luxury Watches",
    content: "Discover watches that are a testament to craftsmanship and precision. Each piece is a work of art.",
    imageUrl: "https://images.unsplash.com/photo-1616583936499-d4116e7e2e76?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    dataAiHint: "luxury watch",
  },
  {
    id: 'car2',
    title: "Sparkling Designs",
    category: "Fine Jewelry",
    content: "Adorn yourself with jewelry that tells a story. Exquisite designs for every occasion.",
    imageUrl: "http://images.unsplash.com/photo-1657367144402-73ed741837dc?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8ZXRobmljJTIwJTVDZmFzaGlvbnxlbnwwfHwwfHx8MA%3D%3D",
    dataAiHint: "ethnic fashion",
  },
  {
    id: 'car3',
    title: "Handcrafted Beauty",
    category: "Artisanal Decor",
    content: "Elevate your space with unique decor items, handcrafted by skilled artisans.",
    imageUrl: "https://placehold.co/600x800.png",
    dataAiHint: "home decor",
  },
  {
    id: 'car4',
    title: "Exquisite Tastes",
    category: "Gourmet Delights",
    content: "Indulge in a curated selection of gourmet foods and rare culinary ingredients.",
    imageUrl: "https://placehold.co/600x800.png",
    dataAiHint: "gourmet food",
  },
];

// --- Helper Functions for File I/O ---
async function ensureDataDirExists() {
  try {
    await fs.access(DATA_DIR);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
  }
}

async function readData<T>(filePath: string, defaultData: T[]): Promise<T[]> {
  await ensureDataDirExists();
  try {
    const fileContent = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(fileContent) as T[];
  } catch (error: any) {
    if (error.code === 'ENOENT') { // File not found
      await writeData(filePath, defaultData); // Create file with default data
      return defaultData;
    }
    console.error(`Error reading data from ${filePath}:`, error);
    return defaultData; // Return default data on other errors
  }
}

async function writeData<T>(filePath: string, data: T[]): Promise<void> {
  await ensureDataDirExists();
  try {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error(`Error writing data to ${filePath}:`, error);
  }
}

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// --- Category Functions ---
export async function getCategories(): Promise<Category[]> {
  await delay(50);
  return readData<Category>(CATEGORIES_FILE, defaultCategories);
}

export async function getCategoryById(id: string): Promise<Category | undefined> {
  await delay(50);
  const categories = await getCategories();
  return categories.find(cat => cat.id === id);
}

export async function getCategoryBySlug(slug: string): Promise<Category | undefined> {
  await delay(50);
  const categories = await getCategories();
  return categories.find(cat => cat.slug === slug);
}

export async function createCategory(categoryData: Omit<Category, 'id' | 'slug'>): Promise<Category> {
  await delay(100);
  const categories = await getCategories();
  const newCategory: Category = {
    ...categoryData,
    id: String(Date.now().toString(36) + Math.random().toString(36).substring(2)), // More robust unique ID
    slug: categoryData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, ''),
  };
  categories.push(newCategory);
  await writeData(CATEGORIES_FILE, categories);
  return newCategory;
}

export async function updateCategory(id: string, updates: Partial<Omit<Category, 'id' | 'slug'>>): Promise<Category | null> {
  await delay(100);
  let categories = await getCategories();
  const categoryIndex = categories.findIndex(cat => cat.id === id);
  if (categoryIndex === -1) return null;
  
  const originalCategory = categories[categoryIndex];
  const updatedCategoryData = { ...originalCategory, ...updates };
  if (updates.name && updates.name !== originalCategory.name) {
    updatedCategoryData.slug = updates.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
  }
  
  categories[categoryIndex] = updatedCategoryData;
  await writeData(CATEGORIES_FILE, categories);
  return updatedCategoryData;
}

export async function deleteCategory(id: string): Promise<boolean> {
  await delay(100);
  let categories = await getCategories();
  const initialLength = categories.length;
  categories = categories.filter(cat => cat.id !== id);
  
  if (categories.length < initialLength) {
    await writeData(CATEGORIES_FILE, categories);
    // Also remove this categoryId from products
    let products = await getProducts();
    products = products.map(p => ({
      ...p,
      categoryIds: p.categoryIds.filter(catId => catId !== id)
    }));
    await writeData(PRODUCTS_FILE, products);
    return true;
  }
  return false;
}

// --- Product Functions ---
export async function getProducts(limit?: number): Promise<Product[]> {
  await delay(50);
  const products = await readData<Product>(PRODUCTS_FILE, defaultProducts);
  const sortedProducts = [...products].sort((a, b) => (a.name < b.name ? -1 : 1)); // Sort by name for consistency
  return limit ? sortedProducts.slice(0, limit) : sortedProducts;
}

export async function getProductById(id: string): Promise<Product | undefined> {
  await delay(50);
  const products = await getProducts();
  return products.find(prod => prod.id === id);
}

export async function getProductsByCategoryId(categoryId: string): Promise<Product[]> {
  await delay(50);
  const products = await getProducts();
  return products.filter(prod => prod.categoryIds.includes(categoryId));
}

export async function createProduct(productData: Omit<Product, 'id'>): Promise<Product> {
  await delay(100);
  const products = await getProducts();
  const newProduct: Product = {
    ...productData,
    id: String(Date.now().toString(36) + Math.random().toString(36).substring(2)), // More robust unique ID
  };
  products.push(newProduct);
  await writeData(PRODUCTS_FILE, products);
  return newProduct;
}

export async function updateProduct(id: string, updates: Partial<Omit<Product, 'id'>>): Promise<Product | null> {
  await delay(100);
  let products = await getProducts();
  const productIndex = products.findIndex(prod => prod.id === id);
  if (productIndex === -1) return null;
  products[productIndex] = { ...products[productIndex], ...updates };
  await writeData(PRODUCTS_FILE, products);
  return products[productIndex];
}

export async function deleteProduct(id: string): Promise<boolean> {
  await delay(100);
  let products = await getProducts();
  const initialLength = products.length;
  products = products.filter(prod => prod.id !== id);
  if (products.length < initialLength) {
    await writeData(PRODUCTS_FILE, products);
    return true;
  }
  return false;
}

// --- Carousel Item Functions ---
export async function getCarouselItems(): Promise<CarouselItem[]> {
  await delay(50);
  return readData<CarouselItem>(CAROUSEL_ITEMS_FILE, defaultCarouselItems);
}

export async function getCarouselItemById(id: string): Promise<CarouselItem | undefined> {
  await delay(50);
  const items = await getCarouselItems();
  return items.find(item => item.id === id);
}

export async function createCarouselItem(itemData: Omit<CarouselItem, 'id'>): Promise<CarouselItem> {
  await delay(100);
  const items = await getCarouselItems();
  const newItem: CarouselItem = {
    ...itemData,
    id: `car${Date.now().toString(36) + Math.random().toString(36).substring(2)}`, // More robust unique ID
  };
  items.push(newItem);
  await writeData(CAROUSEL_ITEMS_FILE, items);
  return newItem;
}

export async function updateCarouselItem(id: string, updates: Partial<Omit<CarouselItem, 'id'>>): Promise<CarouselItem | null> {
  await delay(100);
  let items = await getCarouselItems();
  const itemIndex = items.findIndex(item => item.id === id);
  if (itemIndex === -1) return null;
  items[itemIndex] = { ...items[itemIndex], ...updates };
  await writeData(CAROUSEL_ITEMS_FILE, items);
  return items[itemIndex];
}

export async function deleteCarouselItem(id: string): Promise<boolean> {
  await delay(100);
  let items = await getCarouselItems();
  const initialLength = items.length;
  items = items.filter(item => item.id !== id);
  if (items.length < initialLength) {
    await writeData(CAROUSEL_ITEMS_FILE, items);
    return true;
  }
  return false;
}
