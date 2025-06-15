
'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import admin from 'firebase-admin';
import type { ServiceAccount } from 'firebase-admin';
import { getStorage, type Storage } from 'firebase-admin/storage';
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
  getCarouselItemById,
} from './data';
import type { Product, Category, CarouselItem } from './types';

// --- Firebase Admin SDK Initialization ---
function initializeFirebaseAdmin() {
  if (admin.apps.length > 0) {
    return admin.apps[0]!;
  }

  const serviceAccountKeyJson = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  const storageBucket = process.env.FIREBASE_STORAGE_BUCKET;

  if (!serviceAccountKeyJson) {
    throw new Error('Firebase service account key (FIREBASE_SERVICE_ACCOUNT_KEY) is not set in environment variables.');
  }
  if (!storageBucket) {
    throw new Error('Firebase Storage bucket name (FIREBASE_STORAGE_BUCKET) is not set in environment variables.');
  }

  try {
    const serviceAccount: ServiceAccount = JSON.parse(serviceAccountKeyJson);
    return admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      storageBucket: storageBucket,
    });
  } catch (error: any) {
    console.error('Error parsing Firebase service account key JSON:', error.message);
    throw new Error('Invalid Firebase service account key JSON. Please ensure it is correctly set in FIREBASE_SERVICE_ACCOUNT_KEY.');
  }
}

async function getFirebaseStorage(): Promise<Storage> {
  initializeFirebaseAdmin();
  return getStorage();
}

// --- File Upload Helper ---
async function uploadFileToFirebaseStorage(file: File, pathPrefix: string): Promise<string> {
  if (!file) throw new Error('No file provided for upload.');

  const storage = await getFirebaseStorage();
  const bucket = storage.bucket();

  const uniqueFileName = `${pathPrefix}/${Date.now()}-${file.name.replace(/\s+/g, '_')}`;
  const fileUpload = bucket.file(uniqueFileName);

  const buffer = Buffer.from(await file.arrayBuffer());

  await fileUpload.save(buffer, {
    resumable: false,
    public: true, // Make the file publicly readable
    contentType: file.type,
  });

  // Get the public URL. Note: fileUpload.publicUrl() might not work correctly if bucket is not uniformly public.
  // Constructing URL is generally more reliable if public access is set at upload or via rules.
  return `https://storage.googleapis.com/${bucket.name}/${uniqueFileName}`;
}

// --- File Deletion Helper ---
async function deleteFileFromFirebaseStorage(fileUrl: string | undefined | null): Promise<void> {
  if (!fileUrl) return;

  try {
    const storage = await getFirebaseStorage();
    const bucketName = process.env.FIREBASE_STORAGE_BUCKET;
    if (!bucketName) {
        console.warn('FIREBASE_STORAGE_BUCKET not set, cannot delete file from storage.');
        return;
    }
    
    // Basic check if it's a googleapis URL, otherwise assume it's not a Firebase Storage URL we manage.
    if (!fileUrl.startsWith(`https://storage.googleapis.com/${bucketName}/`)) {
        console.warn(`Skipping deletion for URL not matching current Firebase Storage bucket: ${fileUrl}`);
        return;
    }

    const filePath = fileUrl.substring(`https://storage.googleapis.com/${bucketName}/`.length);
    // Decode URI component in case filename has special characters
    const decodedFilePath = decodeURIComponent(filePath);

    const file = storage.bucket(bucketName).file(decodedFilePath);
    await file.delete({ ignoreNotFound: true });
    console.log(`Successfully deleted ${decodedFilePath} from Firebase Storage.`);
  } catch (error) {
    console.error(`Failed to delete ${fileUrl} from Firebase Storage:`, error);
    // Don't throw error to allow DB operation to proceed if file deletion fails
  }
}


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
  dataAiHint: z.string().optional(),
  imageUrlFile: z.custom((val) => val === undefined || val instanceof File, {
    message: "Poster image must be a file if provided.",
  }).optional(),
  videoFile: z.custom((val) => val === undefined || val instanceof File || val === null, { // Allow null
    message: "Video must be a file if provided, or null to remove.",
  }).optional().nullable(),
  // These are no longer needed as we handle files directly or use existing item's URLs
  // currentImageUrl: z.string().url().optional(),
  // currentVideoSrc: z.string().url().optional().nullable(),
});


export async function createCarouselItemAction(formData: FormData) {
  const parsedResult = carouselItemActionSchema.safeParse({
    title: formData.get('title'),
    category: formData.get('category'),
    content: formData.get('content'),
    dataAiHint: formData.get('dataAiHint') || undefined,
    imageUrlFile: formData.get('imageUrlFile') instanceof File ? formData.get('imageUrlFile') : undefined,
    videoFile: formData.get('videoFile') instanceof File ? formData.get('videoFile') : (formData.get('videoFile') === 'null' ? null : undefined),
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

  try {
    if (imageUrlFile instanceof File) {
      imageFinalUrl = await uploadFileToFirebaseStorage(imageUrlFile, 'carousel_posters');
    }

    if (videoFile instanceof File) {
      videoFinalUrl = await uploadFileToFirebaseStorage(videoFile, 'carousel_videos');
    }
  } catch (uploadError: any) {
    console.error("File upload process error (create):", uploadError);
    return { success: false, error: `File upload failed: ${uploadError.message}. Ensure Firebase environment variables are set and SDK is initialized.` };
  }
  
  if (!imageFinalUrl) { // Should be set if imageUrlFile was provided & upload succeeded
      return { success: false, error: 'Failed to process poster image. Upload might have failed or returned no URL.', errors: { imageUrlFile: ['Failed to obtain image URL after upload.'] } };
  }

  const itemToCreate: Omit<CarouselItem, 'id'> = {
    ...otherData,
    imageUrl: imageFinalUrl,
    videoSrc: videoFinalUrl, // This can be null if no video was uploaded
    dataAiHint: otherData.dataAiHint || otherData.category.toLowerCase(),
  };

  try {
    await dbCreateCarouselItem(itemToCreate);
    revalidatePath('/admin/carousel');
    revalidatePath('/');
    return { success: true, message: 'Carousel item created successfully with uploaded files.' };
  } catch (e) {
    console.error(e);
    // If DB create fails, attempt to clean up uploaded files to prevent orphans
    if (imageFinalUrl) await deleteFileFromFirebaseStorage(imageFinalUrl);
    if (videoFinalUrl) await deleteFileFromFirebaseStorage(videoFinalUrl);
    return { success: false, error: 'Failed to create carousel item in database after processing files.' };
  }
}

export async function updateCarouselItemAction(id: string, formData: FormData) {
  const existingItem = await getCarouselItemById(id);
  if (!existingItem) {
    return { success: false, error: "Carousel item not found." };
  }

  const parsedResult = carouselItemActionSchema.safeParse({
    title: formData.get('title'),
    category: formData.get('category'),
    content: formData.get('content'),
    dataAiHint: formData.get('dataAiHint') || undefined,
    imageUrlFile: formData.get('imageUrlFile') instanceof File ? formData.get('imageUrlFile') : undefined,
    videoFile: formData.get('videoFile') instanceof File ? formData.get('videoFile') : (formData.get('videoFile') === 'null' ? null : undefined),
  });

  if (!parsedResult.success) {
    console.error('Validation errors (updateCarouselItemAction):', parsedResult.error.flatten().fieldErrors);
    return { success: false, error: 'Invalid carousel item data.', errors: parsedResult.error.flatten().fieldErrors };
  }

  const { imageUrlFile, videoFile, ...otherData } = parsedResult.data;

  let imageFinalUrl = existingItem.imageUrl;
  let videoFinalUrl: string | undefined | null = existingItem.videoSrc;
  let oldImageToDelete: string | null = null;
  let oldVideoToDelete: string | null = null;

  try {
    if (imageUrlFile instanceof File) {
      oldImageToDelete = existingItem.imageUrl; // Mark old image for deletion
      imageFinalUrl = await uploadFileToFirebaseStorage(imageUrlFile, 'carousel_posters');
    }

    if (videoFile instanceof File) {
      if (existingItem.videoSrc) oldVideoToDelete = existingItem.videoSrc; // Mark old video for deletion
      videoFinalUrl = await uploadFileToFirebaseStorage(videoFile, 'carousel_videos');
    } else if (parsedResult.data.hasOwnProperty('videoFile') && videoFile === null) {
      // Video is being explicitly removed
      if (existingItem.videoSrc) oldVideoToDelete = existingItem.videoSrc;
      videoFinalUrl = null;
    }
  } catch (uploadError: any) {
    console.error("File update process error:", uploadError);
    return { success: false, error: `File update failed: ${uploadError.message}. Ensure Firebase environment variables are set.` };
  }
  
  const itemToUpdate: Partial<Omit<CarouselItem, 'id'>> = {
    ...otherData,
    imageUrl: imageFinalUrl,
    videoSrc: videoFinalUrl,
    dataAiHint: otherData.dataAiHint || otherData.category.toLowerCase(),
  };

  try {
    await dbUpdateCarouselItem(id, itemToUpdate);
    // Delete old files only after successful DB update
    if (oldImageToDelete && oldImageToDelete !== imageFinalUrl) {
      await deleteFileFromFirebaseStorage(oldImageToDelete);
    }
    if (oldVideoToDelete && oldVideoToDelete !== videoFinalUrl) {
      await deleteFileFromFirebaseStorage(oldVideoToDelete);
    }
    revalidatePath('/admin/carousel');
    revalidatePath(`/admin/carousel/edit/${id}`);
    revalidatePath('/');
    return { success: true, message: 'Carousel item updated successfully with file changes.' };
  } catch (e) {
    console.error(e);
    // If DB update fails, we don't delete the old files. The new files (if any) might become orphans.
    // More sophisticated rollback logic could be added here if needed.
    return { success: false, error: 'Failed to update carousel item in database after processing files.' };
  }
}


export async function deleteCarouselItemAction(id: string) {
  try {
    const itemToDelete = await getCarouselItemById(id);
    
    await dbDeleteCarouselItem(id); // Delete DB record first

    // Then attempt to delete files from storage
    if (itemToDelete) {
      await deleteFileFromFirebaseStorage(itemToDelete.imageUrl);
      if (itemToDelete.videoSrc) {
        await deleteFileFromFirebaseStorage(itemToDelete.videoSrc);
      }
    }

    revalidatePath('/admin/carousel');
    revalidatePath('/');
    return { success: true, message: 'Carousel item deleted successfully. Associated files from Firebase Storage have been scheduled for deletion.' };
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

