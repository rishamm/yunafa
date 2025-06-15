
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
  console.log("Attempting to fetch categories from database...");
  try {
    const collection = await getCollection<Category>('categories');
    const categoriesRaw = await collection.find({}).sort({ name: 1 }).toArray();
    console.log(`Fetched ${categoriesRaw.length} raw category documents.`);
    if (categoriesRaw.length > 0) {
        console.log("First raw category document sample:", JSON.stringify(categoriesRaw[0], null, 2));
    }
    const categoriesMapped = categoriesRaw.map(mapMongoDocument);
    if (categoriesMapped.length > 0) {
        console.log("First mapped category document sample:", JSON.stringify(categoriesMapped[0], null, 2));
    }
    console.log(`Returning ${categoriesMapped.length} mapped categories.`);
    return categoriesMapped;
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
    const newCategoryDocument: Category = {
      ...categoryData,
      id: newId,
      slug: categoryData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, ''),
    };
    
    const insertResult = await collection.insertOne(newCategoryDocument as any);
    
    if (insertResult.insertedId) {
      // Fetch the document we just inserted to ensure we return the exact representation from the DB, mapped correctly.
      // MongoDB's insertedId is an ObjectId, so we query by _id using it.
      const createdDoc = await collection.findOne({ _id: insertResult.insertedId });
      if (createdDoc) {
        return mapMongoDocument(createdDoc);
      }
      // Fallback if findOne fails, though unlikely if insert succeeded
      console.warn("Category created, but findOne after insert failed. Returning constructed object.");
      return newCategoryDocument;
    }
    
    throw new Error("Category creation failed, no insertedId returned from MongoDB.");
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
    const newProductDocument: Product = {
      ...productData,
      id: newId,
    };
    const insertResult = await collection.insertOne(newProductDocument as any);
     if (insertResult.insertedId) {
      const createdDoc = await collection.findOne({ _id: insertResult.insertedId });
      if (createdDoc) {
        return mapMongoDocument(createdDoc);
      }
      console.warn("Product created, but findOne after insert failed. Returning constructed object.");
      return newProductDocument;
    }
    throw new Error("Product creation failed, no insertedId returned from MongoDB.");
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
    const newId = `car${new ObjectId().toHexString()}`; // Kept original prefixing logic
    const newItemDocument: CarouselItem = {
      ...itemData,
      id: newId,
    };
    const insertResult = await collection.insertOne(newItemDocument as any);
    if (insertResult.insertedId) {
      const createdDoc = await collection.findOne({ _id: insertResult.insertedId });
      if (createdDoc) {
        return mapMongoDocument(createdDoc);
      }
      console.warn("CarouselItem created, but findOne after insert failed. Returning constructed object.");
      return newItemDocument;
    }
    throw new Error("CarouselItem creation failed, no insertedId returned from MongoDB.");
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

