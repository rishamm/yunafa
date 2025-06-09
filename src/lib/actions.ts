'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { 
  createProduct as dbCreateProduct, 
  updateProduct as dbUpdateProduct, 
  deleteProduct as dbDeleteProduct,
  createCategory as dbCreateCategory,
  updateCategory as dbUpdateCategory,
  deleteCategory as dbDeleteCategory
} from './data'; // Assuming these are your data access functions
import type { Product, Category } from './types';

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
  
  // Simulate sending an email or saving to DB
  console.log('New Inquiry:', validatedFields.data);
  await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay

  return { success: true };
}


// Product Actions
const productSchema = z.object({
  name: z.string().min(3, 'Product name must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.coerce.number().positive('Price must be a positive number'),
  imageUrl: z.string().url('Must be a valid URL').or(z.string().startsWith('https://placehold.co')),
  categoryIds: z.array(z.string()).min(1, 'At least one category is required'),
  tags: z.string().transform(val => val.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)), // Handles comma-separated string
});

export async function createProductAction(formData: FormData) {
  const rawData = Object.fromEntries(formData.entries());
  // categoryIds might come as a single string if only one is selected, or might not be present if using a multi-select component that doesn't directly map.
  // For robust handling, ensure categoryIds is an array.
  const categoryIds = formData.getAll('categoryIds[]'); // Assuming name="categoryIds[]" for multi-select
  
  const parsedData = productSchema.safeParse({
    ...rawData,
    categoryIds: categoryIds.length > 0 ? categoryIds : (rawData.categoryIds ? [rawData.categoryIds as string] : []),
  });

  if (!parsedData.success) {
    console.error('Validation errors:', parsedData.error.flatten().fieldErrors);
    return { success: false, error: 'Invalid product data.', errors: parsedData.error.flatten().fieldErrors };
  }

  try {
    await dbCreateProduct(parsedData.data as Omit<Product, 'id'>);
    revalidatePath('/admin/products');
    revalidatePath('/'); // Revalidate homepage if it shows products
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
    console.error('Validation errors:', parsedData.error.flatten().fieldErrors);
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
    revalidatePath('/'); // Categories might affect homepage
    return { success: true, message: 'Category deleted successfully.' };
  } catch (e) {
    console.error(e);
    return { success: false, error: 'Failed to delete category.' };
  }
}
