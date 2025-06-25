
'use server';

import type { Product, Category, CarouselItem } from './types';
import { getCollection } from './mongodb';
import { ObjectId } from 'mongodb'; // Import ObjectId

// Helper function to map MongoDB's _id to our string id
function mapMongoDocument<T>(doc: any): T {
  if (doc && doc._id) {
    doc.id = doc._id.toHexString();
    delete doc._id;
  }
  return doc as T;
}


// --- Category Functions ---
export async function getCategories(): Promise<Category[]> {
  try {
    const collection = await getCollection<Category>('categories');
    const categoriesRaw = await collection.find({}).sort({ name: 1 }).toArray();
    const categoriesMapped = categoriesRaw.map(mapMongoDocument);
    return categoriesMapped;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return []; // Return empty array on error
  }
}

export async function getCategoryById(id: string): Promise<Category | undefined> {
  try {
    if (!ObjectId.isValid(id)) return undefined; // Prevent invalid ID errors
    const collection = await getCollection<Category>('categories');
    const category = await collection.findOne({ _id: new ObjectId(id) as any });
    return category ? mapMongoDocument(category) : undefined;
  } catch (error) {
    console.error(`Error fetching category by id ${id}:`, error);
    return undefined;
  }
}

export async function getCategoryBySlug(slug: string): Promise<Category | undefined> {
  try {
    const collection = await getCollection<Category>('categories');
    const category = await collection.findOne({ slug: slug });
    return category ? mapMongoDocument(category) : undefined;
  } catch (error) {
    console.error(`Error fetching category by slug ${slug}:`, error);
    return undefined;
  }
}

export async function createCategory(categoryData: Omit<Category, 'id' | 'slug'>): Promise<Category> {
  try {
    const collection = await getCollection<Omit<Category, 'id'>>('categories');
    const newCategoryDocument = {
      ...categoryData,
      slug: categoryData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, ''),
    };
    
    const insertResult = await collection.insertOne(newCategoryDocument as any);
    
    if (insertResult.insertedId) {
      const createdDoc = await collection.findOne({ _id: insertResult.insertedId });
      if (createdDoc) {
        return mapMongoDocument(createdDoc);
      }
    }
    
    throw new Error("Category creation failed or document could not be retrieved after insert.");
  } catch (error) {
    console.error('Error creating category:', error);
    throw error;
  }
}


export async function updateCategory(id: string, updates: Partial<Omit<Category, 'id' | 'slug'>>): Promise<Category | null> {
  try {
    if (!ObjectId.isValid(id)) return null;
    const collection = await getCollection<Category>('categories');
    const updatePayload: any = { ...updates };
    if (updates.name) {
      updatePayload.slug = updates.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
    }
    
    const result = await collection.findOneAndUpdate(
      { _id: new ObjectId(id) as any },
      { $set: updatePayload },
      { returnDocument: 'after' }
    );
    return result ? mapMongoDocument(result) : null;
  } catch (error) {
    console.error(`Error updating category ${id}:`, error);
    throw error;
  }
}

export async function deleteCategory(id: string): Promise<boolean> {
  try {
    if (!ObjectId.isValid(id)) return false;
    const categoriesCollection = await getCollection<Category>('categories');
    const productsCollection = await getCollection<Product>('products');

    const deleteResult = await categoriesCollection.deleteOne({ _id: new ObjectId(id) as any });
    
    if (deleteResult.deletedCount && deleteResult.deletedCount > 0) {
      // Remove this categoryId from products. The `id` here is the string representation of the ObjectId.
      await productsCollection.updateMany(
        { categoryIds: id },
        { $pull: { categoryIds: id } as any }
      );
      return true;
    }
    return false;
  } catch (error)
 {
    console.error(`Error deleting category ${id}:`, error);
    throw error;
  }
}

// --- Product Functions ---
export async function getProducts(limit?: number): Promise<Product[]> {
  try {
    const collection = await getCollection<Product>('products');
    let query = collection.find({}).sort({ name: 1 });
    if (limit) {
      query = query.limit(limit);
    }
    const products = await query.toArray();
    return products.map(mapMongoDocument);
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

export async function getProductById(id: string): Promise<Product | undefined> {
  try {
    if (!ObjectId.isValid(id)) return undefined;
    const collection = await getCollection<Product>('products');
    const product = await collection.findOne({ _id: new ObjectId(id) as any });
    return product ? mapMongoDocument(product) : undefined;
  } catch (error) {
    console.error(`Error fetching product by id ${id}:`, error);
    return undefined;
  }
}

export async function getProductsByCategoryId(categoryId: string): Promise<Product[]> {
  try {
    const collection = await getCollection<Product>('products');
    const products = await collection.find({ categoryIds: categoryId }).sort({ name: 1 }).toArray();
    return products.map(mapMongoDocument);
  } catch (error) {
    console.error(`Error fetching products by categoryId ${categoryId}:`, error);
    return [];
  }
}

export async function createProduct(productData: Omit<Product, 'id'>): Promise<Product> {
  try {
    const collection = await getCollection<Omit<Product, 'id'>>('products');
    const newProductDocument = { ...productData };
    const insertResult = await collection.insertOne(newProductDocument as any);
     if (insertResult.insertedId) {
      const createdDoc = await collection.findOne({ _id: insertResult.insertedId });
      if (createdDoc) {
        return mapMongoDocument(createdDoc);
      }
    }
    throw new Error("Product creation failed or document could not be retrieved after insert.");
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
}

export async function updateProduct(id: string, updates: Partial<Omit<Product, 'id'>>): Promise<Product | null> {
  try {
    if (!ObjectId.isValid(id)) return null;
    const collection = await getCollection<Product>('products');
    const result = await collection.findOneAndUpdate(
      { _id: new ObjectId(id) as any },
      { $set: updates },
      { returnDocument: 'after' }
    );
    return result ? mapMongoDocument(result) : null;
  } catch (error) {
    console.error(`Error updating product ${id}:`, error);
    throw error;
  }
}

export async function deleteProduct(id: string): Promise<boolean> {
  try {
    if (!ObjectId.isValid(id)) return false;
    const collection = await getCollection<Product>('products');
    const result = await collection.deleteOne({ _id: new ObjectId(id) as any });
    return result.deletedCount ? result.deletedCount > 0 : false;
  } catch (error) {
    console.error(`Error deleting product ${id}:`, error);
    throw error;
  }
}

// --- Carousel Item Functions ---
export async function getCarouselItems(): Promise<CarouselItem[]> {
  try {
    const collection = await getCollection<CarouselItem>('carouselItems');
    let items = await collection.find({}).sort({ title: 1 }).toArray();

    // If the collection is empty, seed it with demo data.
    if (items.length === 0) {
      console.log("Carousel collection is empty, seeding with demo data...");
      const demoItems = [
        {
          title: 'Street Style',
          category: 'New Collection',
          content: 'Discover the latest trends from the street and make them your own. Effortless, chic, and uniquely you.',
          imageSrc: 'https://images.unsplash.com/photo-1492707892479-7bc8d5a44d70?w=800&auto=format&fit=crop&q=60',
          'data-ai-hint': 'fashion street',
          videoSrc: null,
        },
        {
          title: 'The Statement Bag',
          category: 'Accessories',
          content: 'Every detail matters. Find the perfect bag to complement your look and carry your world in style.',
          imageSrc: 'https://images.unsplash.com/photo-1548036328-c9fa89d123b5?w=800&auto=format&fit=crop&q=60',
          'data-ai-hint': 'handbag product',
          videoSrc: null,
        },
        {
          title: 'Timeless Elegance',
          category: 'Fine Jewelry',
          content: 'Adorn yourself with pieces that last a lifetime. Exquisite craftsmanship meets modern design.',
          imageSrc: 'https://images.unsplash.com/photo-1611652022417-a51415e91344?w=800&auto=format&fit=crop&q=60',
          'data-ai-hint': 'jewelry detail',
          videoSrc: null,
        },
        {
            title: 'Cinematic Moments',
            category: 'Brand Story',
            content: 'A showcase of our brand essence in motion. Experience the story behind our craft.',
            videoSrc: '/hero.mp4',
            imageSrc: 'https://images.unsplash.com/photo-1601672439911-572af5dcf128?w=800&q=80',
            'data-ai-hint': 'dark fashion',
        }
      ];
      // Use "any" to bypass strict type checks for insertion, as MongoDB will add the _id.
      await collection.insertMany(demoItems as any[]);
      // Re-fetch the items after seeding
      items = await collection.find({}).sort({ title: 1 }).toArray();
    }
    
    return items.map(mapMongoDocument);
  } catch (error) {
    console.error('Error fetching carousel items:', error);
    return [];
  }
}

export async function getCarouselItemById(id: string): Promise<CarouselItem | undefined> {
  try {
    if (!ObjectId.isValid(id)) return undefined;
    const collection = await getCollection<CarouselItem>('carouselItems');
    const item = await collection.findOne({ _id: new ObjectId(id) as any });
    return item ? mapMongoDocument(item) : undefined;
  } catch (error) {
    console.error(`Error fetching carousel item by id ${id}:`, error);
    return undefined;
  }
}

export async function createCarouselItem(itemData: Omit<CarouselItem, 'id'>): Promise<CarouselItem> {
  try {
    const collection = await getCollection<Omit<CarouselItem, 'id'>>('carouselItems');
    const newItemDocument = { ...itemData };
    const insertResult = await collection.insertOne(newItemDocument as any);

    if (insertResult.insertedId) {
      const createdDoc = await collection.findOne({ _id: insertResult.insertedId });
      if (createdDoc) {
        return mapMongoDocument(createdDoc);
      }
    }
    throw new Error("CarouselItem creation failed or document could not be retrieved after insert.");
  } catch (error) {
    console.error('Error creating carousel item:', error);
    throw error;
  }
}

export async function updateCarouselItem(id: string, updates: Partial<Omit<CarouselItem, 'id'>>): Promise<CarouselItem | null> {
  try {
    if (!ObjectId.isValid(id)) return null;
    const collection = await getCollection<CarouselItem>('carouselItems');
    const result = await collection.findOneAndUpdate(
      { _id: new ObjectId(id) as any },
      { $set: updates },
      { returnDocument: 'after' }
    );
    return result ? mapMongoDocument(result) : null;
  } catch (error) {
    console.error(`Error updating carousel item ${id}:`, error);
    throw error;
  }
}

export async function deleteCarouselItem(id: string): Promise<boolean> {
  try {
    if (!ObjectId.isValid(id)) return false;
    const collection = await getCollection<CarouselItem>('carouselItems');
    const result = await collection.deleteOne({ _id: new ObjectId(id) as any });
    return result.deletedCount ? result.deletedCount > 0 : false;
  } catch (error) {
    console.error(`Error deleting carousel item ${id}:`, error);
    throw error;
  }
}
