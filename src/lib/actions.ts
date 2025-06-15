
'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
// Firebase Admin SDK and related imports are removed
import {
  createProduct as dbCreateProduct,
  updateProduct as dbUpdateProduct,
  deleteProduct as dbDeleteProduct,
  createCategory as dbCreateCategory,
  updateCategory as dbUpdateCategory,
  deleteCategory as dbDeleteCategory,
  createCarouselItem as dbCreateCarouselItem,
  updateCarouselItem as dbUpdateCarouselItem,
  deleteCarouselItem as dbDeleteCarouselItem,
  // getCarouselItemById is not directly used in actions but good for consistency if needed
} from './data';
import type { Product, Category, CarouselItem } from './types';

// --- File Upload/Deletion Helpers (Removed Firebase specific ones) ---
// Placeholder for any future generic file handling if not using Firebase
// For now, these are not used as we revert to URL inputs.

// Contact Form Inquiry
const inquirySchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  subject: z.string().min(5),
  message: z.string().min(10),
  productId: z.string().optional(),
});

export async function submitInquiry(values: z.infer<typeof inquirySchema>) {
  const validatedFields = inquirySchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: 'Invalid data.', success: false };
  }

  console.log('New Inquiry:', validatedFields.data);
  await new Promise(resolve => setTimeout(resolve, 1000));

  return { success: true };
}


// Product Actions
const productSchema = z.object({
  name: z.string().min(3, 'Product name must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.coerce.number().positive('Price must be a positive number'),
  imageUrl: z.preprocess(
    (val) => (typeof val === 'string' ? val.trim() : val),
    z.string().url('Must be a valid URL. Example: https://example.com/image.png').or(z.string().startsWith('https://placehold.co'))
  ),
  categoryIds: z.array(z.string()).min(1, 'At least one category is required'),
  tags: z.string().transform(val => val.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)),
  'data-ai-hint': z.string().optional(),
});

export async function createProductAction(formData: FormData) {
  const rawData = Object.fromEntries(formData.entries());
  const categoryIds = formData.getAll('categoryIds[]');

  const parsedData = productSchema.safeParse({
    ...rawData,
    categoryIds: categoryIds.length > 0 ? categoryIds : (rawData.categoryIds ? [rawData.categoryIds as string] : []),
  });

  if (!parsedData.success) {
    console.error('Validation errors (createProductAction):', parsedData.error.flatten().fieldErrors);
    return { success: false, error: 'Invalid product data.', errors: parsedData.error.flatten().fieldErrors };
  }

  try {
    await dbCreateProduct(parsedData.data as Omit<Product, 'id'>);
    revalidatePath('/admin/products');
    revalidatePath('/');
    return { success: true, message: 'Product created successfully.' };
  } catch (e) {
    console.error(e);
    return { success: false, error: 'Failed to create product.' };
  }
}

export async function updateProductAction(id: string, formData: FormData) {
  const rawData = Object.fromEntries(formData.entries());
  const categoryIds = formData.getAll('categoryIds[]');

  const parsedData = productSchema.safeParse({
    ...rawData,
    categoryIds: categoryIds.length > 0 ? categoryIds : (rawData.categoryIds ? [rawData.categoryIds as string] : []),
  });

  if (!parsedData.success) {
    console.error('Validation errors (updateProductAction):', parsedData.error.flatten().fieldErrors);
    return { success: false, error: 'Invalid product data.', errors: parsedData.error.flatten().fieldErrors };
  }

  try {
    await dbUpdateProduct(id, parsedData.data as Partial<Omit<Product, 'id'>>);
    revalidatePath('/admin/products');
    revalidatePath(`/admin/products/edit/${id}`);
    revalidatePath(`/products/${id}`);
    revalidatePath('/');
    return { success: true, message: 'Product updated successfully.' };
  } catch (e) {
    console.error(e);
    return { success: false, error: 'Failed to update product.' };
  }
}

export async function deleteProductAction(id: string) {
  try {
    await dbDeleteProduct(id);
    revalidatePath('/admin/products');
    revalidatePath('/');
    return { success: true, message: 'Product deleted successfully.' };
  } catch (e) {
    console.error(e);
    return { success: false, error: 'Failed to delete product.' };
  }
}


// Category Actions
const categorySchema = z.object({
  name: z.string().min(2, 'Category name must be at least 2 characters'),
  description: z.string().optional(),
});

export async function createCategoryAction(formData: FormData) {
  const parsedData = categorySchema.safeParse(Object.fromEntries(formData.entries()));

  if (!parsedData.success) {
    return { success: false, error: 'Invalid category data.', errors: parsedData.error.flatten().fieldErrors };
  }

  try {
    await dbCreateCategory(parsedData.data as Omit<Category, 'id' | 'slug'>);
    revalidatePath('/admin/categories');
    return { success: true, message: 'Category created successfully.' };
  } catch (e) {
    console.error(e);
    return { success: false, error: 'Failed to create category.' };
  }
}

export async function updateCategoryAction(id: string, formData: FormData) {
  const parsedData = categorySchema.safeParse(Object.fromEntries(formData.entries()));

  if (!parsedData.success) {
    return { success: false, error: 'Invalid category data.', errors: parsedData.error.flatten().fieldErrors };
  }

  try {
    await dbUpdateCategory(id, parsedData.data as Partial<Omit<Category, 'id' | 'slug'>>);
    revalidatePath('/admin/categories');
    revalidatePath(`/admin/categories/edit/${id}`);
    return { success: true, message: 'Category updated successfully.' };
  } catch (e) {
    console.error(e);
    return { success: false, error: 'Failed to update category.' };
  }
}

export async function deleteCategoryAction(id: string) {
  try {
    await dbDeleteCategory(id);
    revalidatePath('/admin/categories');
    revalidatePath('/');
    return { success: true, message: 'Category deleted successfully.' };
  } catch (e) {
    console.error(e);
    return { success: false, error: 'Failed to delete category.' };
  }
}

// Carousel Item Actions
const carouselItemActionSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters.'),
  category: z.string().min(3, 'Category must be at least 3 characters.'),
  content: z.string().min(10, 'Content must be at least 10 characters.'),
  imageUrl: z.string().url('Image URL must be a valid URL.').or(z.string().startsWith('/')), // Allow relative paths for public folder
  videoSrc: z.string().url('Video Source must be a valid URL.').or(z.string().startsWith('/')).optional().nullable(),
  dataAiHint: z.string().optional(),
});


export async function createCarouselItemAction(formData: FormData) {
  const rawData = Object.fromEntries(formData.entries());
  // Ensure videoSrc is correctly handled if empty or not present
  if (rawData.videoSrc === '') {
    delete rawData.videoSrc; // Treat empty string as undefined for optional field
  }

  const parsedResult = carouselItemActionSchema.safeParse(rawData);

  if (!parsedResult.success) {
    console.error('Validation errors (createCarouselItemAction):', parsedResult.error.flatten().fieldErrors);
    return { success: false, error: 'Invalid carousel item data.', errors: parsedResult.error.flatten().fieldErrors };
  }

  const { ...itemData } = parsedResult.data;

  const itemToCreate: Omit<CarouselItem, 'id'> = {
    ...itemData,
    imageUrl: itemData.imageUrl.trim(),
    videoSrc: itemData.videoSrc ? itemData.videoSrc.trim() : null, // Ensure videoSrc is null if not provided or empty
    dataAiHint: itemData.dataAiHint || itemData.category.toLowerCase(),
  };

  try {
    await dbCreateCarouselItem(itemToCreate);
    revalidatePath('/admin/carousel');
    revalidatePath('/');
    return { success: true, message: 'Carousel item created successfully.' };
  } catch (e) {
    console.error('Error creating carousel item:', e);
    return { success: false, error: 'Failed to create carousel item in database.' };
  }
}

export async function updateCarouselItemAction(id: string, formData: FormData) {
  const rawData = Object.fromEntries(formData.entries());
  if (rawData.videoSrc === '') {
    delete rawData.videoSrc;
  }
  const parsedResult = carouselItemActionSchema.safeParse(rawData);

  if (!parsedResult.success) {
    console.error('Validation errors (updateCarouselItemAction):', parsedResult.error.flatten().fieldErrors);
    return { success: false, error: 'Invalid carousel item data.', errors: parsedResult.error.flatten().fieldErrors };
  }

  const { ...itemData } = parsedResult.data;
  
  const itemToUpdate: Partial<Omit<CarouselItem, 'id'>> = {
    ...itemData,
    imageUrl: itemData.imageUrl.trim(),
    videoSrc: itemData.videoSrc ? itemData.videoSrc.trim() : null,
    dataAiHint: itemData.dataAiHint || itemData.category.toLowerCase(),
  };

  try {
    await dbUpdateCarouselItem(id, itemToUpdate);
    revalidatePath('/admin/carousel');
    revalidatePath(`/admin/carousel/edit/${id}`);
    revalidatePath('/');
    return { success: true, message: 'Carousel item updated successfully.' };
  } catch (e) {
    console.error('Error updating carousel item:', e);
    return { success: false, error: 'Failed to update carousel item in database.' };
  }
}


export async function deleteCarouselItemAction(id: string) {
  try {
    await dbDeleteCarouselItem(id);
    revalidatePath('/admin/carousel');
    revalidatePath('/');
    return { success: true, message: 'Carousel item deleted successfully.' };
  } catch (e) {
    console.error(e);
    return { success: false, error: 'Failed to delete carousel item.' };
  }
}

// Site Settings Actions
const hostnameSchema = z.object({
  hostname: z.string().min(3, 'Hostname must be valid (e.g., example.com).'),
});

export async function requestNewHostnameAction(hostname: string) {
  const validatedHostname = hostnameSchema.safeParse({ hostname });

  if (!validatedHostname.success) {
    return { success: false, error: 'Invalid hostname format.', errors: validatedHostname.error.flatten().fieldErrors };
  }

  console.log(`ADMIN ACTION: New hostname requested for approval: ${validatedHostname.data.hostname}`);
  console.log("IMPORTANT: This hostname must be manually added to next.config.js and the server restarted.");

  await new Promise(resolve => setTimeout(resolve, 500));

  return {
    success: true,
    message: `Request for hostname '${validatedHostname.data.hostname}' has been logged. A developer needs to manually update the configuration and restart the server.`
  };
}
