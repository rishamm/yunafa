
import type { Product, Category, CarouselItem } from './types';
import { getCollection } from './mongodb';
import { ObjectId } from 'mongodb'; // Import ObjectId

// Helper function to map MongoDB's _id to our string id and ensure correct type
function mapMongoDocument<T extends { _id?: ObjectId; id?: string }>(doc: any): T {
  if (doc && doc._id) {
    // If 'id' field is not already present or is not a string, set it from _id
    if (typeof doc.id !== 'string') {
      doc.id = doc._id.toHexString();
    }
    delete doc._id; // Remove the MongoDB ObjectId
  }
  return doc as T;
}


// --- Category Functions ---
export async function getCategories(): Promise<Category[]> {
  try {
    const collection = await getCollection<Category>('categories');
    const categories = await collection.find({}).sort({ name: 1 }).toArray();
    return categories.map(mapMongoDocument);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return []; // Return empty array on error
  }
}

export async function getCategoryById(id: string): Promise<Category | undefined> {
  try {
    const collection = await getCollection<Category>('categories');
    const category = await collection.findOne({ id: id });
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
    const collection = await getCollection<Category>('categories');
    const newId = new ObjectId().toHexString(); // Generate a string ID
    const newCategory: Category = {
      ...categoryData,
      id: newId,
      slug: categoryData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, ''),
    };
    const result = await collection.insertOne(newCategory as any); // Cast to any to avoid _id issue with mongodb driver
    // MongoDB driver adds _id automatically. We are using `id` as our primary string identifier.
    // To return the object consistent with our type, we fetch it or map it.
    return { ...newCategory, id: result.insertedId ? newId : newId }; // Ensure the ID we generated is returned
  } catch (error) {
    console.error('Error creating category:', error);
    throw error; // Re-throw to be handled by action
  }
}

export async function updateCategory(id: string, updates: Partial<Omit<Category, 'id' | 'slug'>>): Promise<Category | null> {
  try {
    const collection = await getCollection<Category>('categories');
    const updatePayload: any = { ...updates };
    if (updates.name) {
      updatePayload.slug = updates.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
    }
    
    const result = await collection.findOneAndUpdate(
      { id: id },
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
    const categoriesCollection = await getCollection<Category>('categories');
    const productsCollection = await getCollection<Product>('products');

    const deleteResult = await categoriesCollection.deleteOne({ id: id });
    
    if (deleteResult.deletedCount && deleteResult.deletedCount > 0) {
      // Remove this categoryId from products
      await productsCollection.updateMany(
        { categoryIds: id },
        { $pull: { categoryIds: id } as any } // Type assertion for $pull
      );
      return true;
    }
    return false;
  } catch (error) {
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
    const collection = await getCollection<Product>('products');
    const product = await collection.findOne({ id: id });
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
    const collection = await getCollection<Product>('products');
    const newId = new ObjectId().toHexString();
    const newProduct: Product = {
      ...productData,
      id: newId,
    };
    const result = await collection.insertOne(newProduct as any);
    return { ...newProduct, id: result.insertedId ? newId : newId };
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
}

export async function updateProduct(id: string, updates: Partial<Omit<Product, 'id'>>): Promise<Product | null> {
  try {
    const collection = await getCollection<Product>('products');
    const result = await collection.findOneAndUpdate(
      { id: id },
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
    const collection = await getCollection<Product>('products');
    const result = await collection.deleteOne({ id: id });
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
    // You might want to add sorting here, e.g., by a creation date or an order field
    const items = await collection.find({}).sort({ title: 1 }).toArray();
    return items.map(mapMongoDocument);
  } catch (error) {
    console.error('Error fetching carousel items:', error);
    return [];
  }
}

export async function getCarouselItemById(id: string): Promise<CarouselItem | undefined> {
  try {
    const collection = await getCollection<CarouselItem>('carouselItems');
    const item = await collection.findOne({ id: id });
    return item ? mapMongoDocument(item) : undefined;
  } catch (error) {
    console.error(`Error fetching carousel item by id ${id}:`, error);
    return undefined;
  }
}

export async function createCarouselItem(itemData: Omit<CarouselItem, 'id'>): Promise<CarouselItem> {
  try {
    const collection = await getCollection<CarouselItem>('carouselItems');
    const newId = `car${new ObjectId().toHexString()}`;
    const newItem: CarouselItem = {
      ...itemData,
      id: newId,
    };
    const result = await collection.insertOne(newItem as any);
    return { ...newItem, id: result.insertedId ? newId : newId };
  } catch (error) {
    console.error('Error creating carousel item:', error);
    throw error;
  }
}

export async function updateCarouselItem(id: string, updates: Partial<Omit<CarouselItem, 'id'>>): Promise<CarouselItem | null> {
  try {
    const collection = await getCollection<CarouselItem>('carouselItems');
    const result = await collection.findOneAndUpdate(
      { id: id },
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
    const collection = await getCollection<CarouselItem>('carouselItems');
    const result = await collection.deleteOne({ id: id });
    return result.deletedCount ? result.deletedCount > 0 : false;
  } catch (error) {
    console.error(`Error deleting carousel item ${id}:`, error);
    throw error;
  }
}
