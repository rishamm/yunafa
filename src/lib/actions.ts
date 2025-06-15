
'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
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
  getCarouselItemById, // Import to fetch current item for updates
} from './data';
import type { Product, Category, CarouselItem } from './types';

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
// This schema is for validating form data that might contain File objects
const carouselItemActionSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters.'),
  category: z.string().min(3, 'Category must be at least 3 characters.'),
  content: z.string().min(10, 'Content must be at least 10 characters.'),
  dataAiHint: z.string().optional(),
  imageUrlFile: z.custom((val) => val === undefined || val instanceof File, {
    message: "Poster image must be a file if provided.",
  }).optional(),
  videoFile: z.custom((val) => val === undefined || val instanceof File, {
    message: "Video must be a file if provided.",
  }).optional().nullable(),
  currentImageUrl: z.string().url().optional(), // Sent if editing and image not changed
  currentVideoSrc: z.string().url().optional().nullable(), // Sent if editing and video not changed
});


export async function createCarouselItemAction(formData: FormData) {
  const rawData = Object.fromEntries(formData);
  const parsedResult = carouselItemActionSchema.safeParse({
    title: formData.get('title'),
    category: formData.get('category'),
    content: formData.get('content'),
    dataAiHint: formData.get('dataAiHint') || undefined,
    imageUrlFile: formData.get('imageUrlFile') instanceof File ? formData.get('imageUrlFile') : undefined,
    videoFile: formData.get('videoFile') instanceof File ? formData.get('videoFile') : undefined,
  });

  if (!parsedResult.success) {
    console.error('Validation errors (createCarouselItemAction):', parsedResult.error.flatten().fieldErrors);
    return { success: false, error: 'Invalid carousel item data.', errors: parsedResult.error.flatten().fieldErrors };
  }

  const { imageUrlFile, videoFile, ...otherData } = parsedResult.data;

  if (!imageUrlFile) {
    return { success: false, error: 'Poster image file is required for new carousel items.', errors: { imageUrlFile: ['Poster image file is required.'] } };
  }

  let imageFinalUrl = '';
  let videoFinalUrl: string | undefined | null = null;

  // --- BEGIN FIREBASE UPLOAD LOGIC (PLACEHOLDER) ---
  if (imageUrlFile instanceof File) {
    // TODO: Implement Firebase Storage upload for imageUrlFile
    // 1. Initialize Firebase Admin SDK (if not already done globally for server actions)
    // 2. Upload imageUrlFile.arrayBuffer() or stream to Firebase Storage
    // 3. Get the downloadURL
    // Example: imageFinalUrl = await uploadToFirebaseStorage(imageUrlFile, `carousel_images/${new Date().getTime()}_${imageUrlFile.name}`);
    console.log(`Placeholder: Would upload image ${imageUrlFile.name} to Firebase Storage.`);
    imageFinalUrl = `https://placehold.co/600x400.png?text=Uploaded+${encodeURIComponent(imageUrlFile.name)}`; // Placeholder URL
  }

  if (videoFile instanceof File) {
    // TODO: Implement Firebase Storage upload for videoFile
    // Example: videoFinalUrl = await uploadToFirebaseStorage(videoFile, `carousel_videos/${new Date().getTime()}_${videoFile.name}`);
    console.log(`Placeholder: Would upload video ${videoFile.name} to Firebase Storage.`);
    videoFinalUrl = `/placeholder-videos/${encodeURIComponent(videoFile.name)}`; // Placeholder path
  }
  // --- END FIREBASE UPLOAD LOGIC (PLACEHOLDER) ---

  if (!imageFinalUrl) { // Should be set by placeholder or actual upload
      return { success: false, error: 'Failed to process poster image.', errors: { imageUrlFile: ['Failed to process poster image.'] } };
  }

  const itemToCreate: Omit<CarouselItem, 'id'> = {
    ...otherData,
    imageUrl: imageFinalUrl,
    videoSrc: videoFinalUrl, // Will be string | undefined | null
    dataAiHint: otherData.dataAiHint || otherData.category.toLowerCase(), // Default AI hint
  };

  try {
    await dbCreateCarouselItem(itemToCreate);
    revalidatePath('/admin/carousel');
    revalidatePath('/');
    return { success: true, message: 'Carousel item data received. Firebase Storage upload logic is pending actual implementation.' };
  } catch (e) {
    console.error(e);
    return { success: false, error: 'Failed to create carousel item in database.' };
  }
}

export async function updateCarouselItemAction(id: string, formData: FormData) {
  const existingItem = await getCarouselItemById(id);
  if (!existingItem) {
    return { success: false, error: "Carousel item not found." };
  }

  const rawData = Object.fromEntries(formData);
  const parsedResult = carouselItemActionSchema.safeParse({
    title: formData.get('title'),
    category: formData.get('category'),
    content: formData.get('content'),
    dataAiHint: formData.get('dataAiHint') || undefined,
    imageUrlFile: formData.get('imageUrlFile') instanceof File ? formData.get('imageUrlFile') : undefined,
    videoFile: formData.get('videoFile') instanceof File ? formData.get('videoFile') : undefined,
    currentImageUrl: formData.get('currentImageUrl') as string || undefined, // To preserve if no new file
    currentVideoSrc: formData.get('currentVideoSrc') as string || undefined, // To preserve if no new file
  });

  if (!parsedResult.success) {
    console.error('Validation errors (updateCarouselItemAction):', parsedResult.error.flatten().fieldErrors);
    return { success: false, error: 'Invalid carousel item data.', errors: parsedResult.error.flatten().fieldErrors };
  }

  const { imageUrlFile, videoFile, currentImageUrl, currentVideoSrc, ...otherData } = parsedResult.data;

  let imageFinalUrl = currentImageUrl || existingItem.imageUrl; // Start with current or existing
  let videoFinalUrl: string | undefined | null = currentVideoSrc !== undefined ? currentVideoSrc : existingItem.videoSrc;


  // --- BEGIN FIREBASE UPLOAD LOGIC (PLACEHOLDER) ---
  if (imageUrlFile instanceof File) {
    // TODO: Implement Firebase Storage upload for imageUrlFile
    // 1. Delete old image from Firebase Storage if necessary (existingItem.imageUrl)
    // 2. Upload new imageUrlFile
    // 3. Get the downloadURL
    console.log(`Placeholder: Would upload NEW image ${imageUrlFile.name} to Firebase Storage, replacing old one.`);
    imageFinalUrl = `https://placehold.co/600x400.png?text=Updated+${encodeURIComponent(imageUrlFile.name)}`; // Placeholder
  }

  if (videoFile instanceof File) {
    // TODO: Implement Firebase Storage upload for videoFile
    // 1. Delete old video from Firebase Storage if necessary (existingItem.videoSrc)
    // 2. Upload new videoFile
    // 3. Get the downloadURL
    console.log(`Placeholder: Would upload NEW video ${videoFile.name} to Firebase Storage, replacing old one.`);
    videoFinalUrl = `/placeholder-videos/updated-${encodeURIComponent(videoFile.name)}`; // Placeholder
  } else if (videoFile === null && parsedResult.data.hasOwnProperty('videoFile')) {
    // If videoFile was explicitly set to null (e.g. user wants to remove video)
    // TODO: Delete existingItem.videoSrc from Firebase Storage
    console.log(`Placeholder: Would delete existing video ${existingItem.videoSrc} from Firebase Storage.`);
    videoFinalUrl = null;
  }
  // --- END FIREBASE UPLOAD LOGIC (PLACEHOLDER) ---

  const itemToUpdate: Partial<Omit<CarouselItem, 'id'>> = {
    ...otherData,
    imageUrl: imageFinalUrl,
    videoSrc: videoFinalUrl,
    dataAiHint: otherData.dataAiHint || otherData.category.toLowerCase(),
  };

  try {
    await dbUpdateCarouselItem(id, itemToUpdate);
    revalidatePath('/admin/carousel');
    revalidatePath(`/admin/carousel/edit/${id}`);
    revalidatePath('/');
    return { success: true, message: 'Carousel item data received for update. Firebase Storage upload logic is pending actual implementation.' };
  } catch (e) {
    console.error(e);
    return { success: false, error: 'Failed to update carousel item in database.' };
  }
}


export async function deleteCarouselItemAction(id: string) {
  try {
    // TODO: Optionally, delete files from Firebase Storage when deleting item from DB
    // const itemToDelete = await getCarouselItemById(id);
    // if (itemToDelete?.imageUrl) { /* delete from Firebase Storage */ }
    // if (itemToDelete?.videoSrc) { /* delete from Firebase Storage */ }
    console.log("Placeholder: Firebase Storage deletion logic for carousel item would go here.");

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
