
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
  getCarouselItemById,
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
const carouselItemActionSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters.'),
  category: z.string().min(3, 'Category must be at least 3 characters.'),
  content: z.string().min(10, 'Content must be at least 10 characters.'),
  dataAiHint: z.string().optional(),
  imageUrlFile: z.custom((val) => val === undefined || val instanceof File, {
    message: "Poster image must be a file if provided.",
  }).optional(),
  videoFile: z.custom((val) => val === undefined || val instanceof File || val === null, {
    message: "Video must be a file if provided, or null to remove.",
  }).optional().nullable(),
  currentImageUrl: z.string().url().optional(),
  currentVideoSrc: z.string().url().optional().nullable(),
});

// Helper function conceptual placeholder for Firebase Storage upload
async function uploadFileToFirebaseStorage(file: File, pathPrefix: string): Promise<string> {
  // DEVELOPER TODO: Implement actual Firebase Storage upload
  // 1. Ensure Firebase Admin SDK is initialized (ideally globally or via a helper)
  //    e.g., import admin from 'firebase-admin';
  //         import { getStorage } from 'firebase-admin/storage';
  //         if (!admin.apps.length) { admin.initializeApp({ credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY!)), storageBucket: 'YOUR_BUCKET_NAME.appspot.com' }); }
  //    NOTE: Add 'firebase-admin' to package.json dependencies.
  //          Store service account key and bucket name securely (e.g., environment variables).

  // 2. Get storage bucket
  //    const bucket = getStorage().bucket();

  // 3. Generate a unique filename (e.g., using timestamp or UUID)
  //    const uniqueFileName = `${pathPrefix}/${Date.now()}-${file.name.replace(/\s+/g, '_')}`;
  //    const fileUpload = bucket.file(uniqueFileName);

  // 4. Convert File object to Buffer
  //    const buffer = Buffer.from(await file.arrayBuffer());

  // 5. Upload the buffer
  //    await fileUpload.save(buffer, { resumable: false, public: true, contentType: file.type });
  
  // 6. Get the public URL
  //    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${uniqueFileName}`; // Or fileUpload.publicUrl() if configured
  //    return publicUrl;

  console.log(`DEVELOPER_TODO: Uploading ${file.name} to Firebase Storage at ${pathPrefix}. This is a placeholder.`);
  // Return a placeholder URL for now. Replace with actual URL from Firebase Storage.
  return `https://placehold.co/600x400.png?text=Uploaded+${encodeURIComponent(file.name)}`;
}

// Helper function conceptual placeholder for Firebase Storage deletion
async function deleteFileFromFirebaseStorage(fileUrl: string | undefined | null): Promise<void> {
  if (!fileUrl) return;
  // DEVELOPER TODO: Implement actual Firebase Storage deletion
  // 1. Ensure Firebase Admin SDK is initialized.
  // 2. Parse the bucket and file path from the URL.
  //    (e.g., for https://storage.googleapis.com/YOUR_BUCKET_NAME/path/to/file.jpg)
  //    const bucketName = 'YOUR_BUCKET_NAME.appspot.com'; // From env or config
  //    const filePath = fileUrl.substring(fileUrl.indexOf(bucketName) + bucketName.length + 1);
  // 3. Get storage bucket and file reference.
  //    const bucket = getStorage().bucket(bucketName);
  //    const file = bucket.file(filePath);
  // 4. Delete the file.
  //    await file.delete({ ignoreNotFound: true });

  console.log(`DEVELOPER_TODO: Deleting ${fileUrl} from Firebase Storage. This is a placeholder.`);
}


export async function createCarouselItemAction(formData: FormData) {
  const rawData = Object.fromEntries(formData);
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
    console.error("File upload process error:", uploadError);
    return { success: false, error: `File upload failed: ${uploadError.message}. Firebase Storage integration may not be complete.` };
  }
  
  if (!imageFinalUrl) {
      return { success: false, error: 'Failed to process poster image. Firebase Storage integration may not be complete.', errors: { imageUrlFile: ['Failed to obtain image URL after conceptual upload.'] } };
  }

  const itemToCreate: Omit<CarouselItem, 'id'> = {
    ...otherData,
    imageUrl: imageFinalUrl,
    videoSrc: videoFinalUrl,
    dataAiHint: otherData.dataAiHint || otherData.category.toLowerCase(),
  };

  try {
    await dbCreateCarouselItem(itemToCreate);
    revalidatePath('/admin/carousel');
    revalidatePath('/');
    return { success: true, message: 'Carousel item data received. DEVELOPER_ACTION_REQUIRED: Ensure Firebase Storage upload logic is fully implemented and service account/permissions are configured.' };
  } catch (e) {
    console.error(e);
    return { success: false, error: 'Failed to create carousel item in database after processing files.' };
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
    videoFile: formData.get('videoFile') instanceof File ? formData.get('videoFile') : (formData.get('videoFile') === 'null' ? null : undefined),
    currentImageUrl: formData.get('currentImageUrl') as string || undefined,
    currentVideoSrc: formData.get('currentVideoSrc') as string || undefined,
  });

  if (!parsedResult.success) {
    console.error('Validation errors (updateCarouselItemAction):', parsedResult.error.flatten().fieldErrors);
    return { success: false, error: 'Invalid carousel item data.', errors: parsedResult.error.flatten().fieldErrors };
  }

  const { imageUrlFile, videoFile, currentImageUrl, currentVideoSrc, ...otherData } = parsedResult.data;

  let imageFinalUrl = currentImageUrl || existingItem.imageUrl;
  let videoFinalUrl: string | undefined | null = currentVideoSrc !== undefined ? currentVideoSrc : existingItem.videoSrc;

  try {
    if (imageUrlFile instanceof File) {
      // If new image is uploaded, delete old one before uploading new
      if (existingItem.imageUrl && existingItem.imageUrl !== imageFinalUrl) { // Check if it's not a placeholder/same URL
          await deleteFileFromFirebaseStorage(existingItem.imageUrl);
      }
      imageFinalUrl = await uploadFileToFirebaseStorage(imageUrlFile, 'carousel_posters');
    }

    if (videoFile instanceof File) {
      // If new video is uploaded, delete old one
      if (existingItem.videoSrc && existingItem.videoSrc !== videoFinalUrl) {
          await deleteFileFromFirebaseStorage(existingItem.videoSrc);
      }
      videoFinalUrl = await uploadFileToFirebaseStorage(videoFile, 'carousel_videos');
    } else if (videoFile === null && parsedResult.data.hasOwnProperty('videoFile')) {
      // Video is being explicitly removed
      if (existingItem.videoSrc) {
          await deleteFileFromFirebaseStorage(existingItem.videoSrc);
      }
      videoFinalUrl = null;
    }
  } catch (uploadError: any) {
    console.error("File update process error:", uploadError);
    return { success: false, error: `File update failed: ${uploadError.message}. Firebase Storage integration may not be complete.` };
  }
  
  if (!imageFinalUrl) {
      return { success: false, error: 'Failed to process poster image for update. Firebase Storage integration may not be complete.', errors: { imageUrlFile: ['Failed to obtain image URL after conceptual upload.'] } };
  }

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
    return { success: true, message: 'Carousel item data received for update. DEVELOPER_ACTION_REQUIRED: Ensure Firebase Storage upload/delete logic is fully implemented and service account/permissions are configured.' };
  } catch (e) {
    console.error(e);
    return { success: false, error: 'Failed to update carousel item in database after processing files.' };
  }
}


export async function deleteCarouselItemAction(id: string) {
  try {
    const itemToDelete = await getCarouselItemById(id);
    if (itemToDelete) {
      await deleteFileFromFirebaseStorage(itemToDelete.imageUrl);
      if (itemToDelete.videoSrc) {
        await deleteFileFromFirebaseStorage(itemToDelete.videoSrc);
      }
    }

    await dbDeleteCarouselItem(id);
    revalidatePath('/admin/carousel');
    revalidatePath('/');
    return { success: true, message: 'Carousel item deleted successfully. DEVELOPER_ACTION_REQUIRED: Confirm Firebase Storage files were also deleted if implemented.' };
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
