import { ProductForm } from '@/components/forms/ProductForm';
import { getProductById, getCategories } from '@/lib/data';
import { notFound } from 'next/navigation';
import type { Category } from '@/lib/types';

export async function generateMetadata({ params }: { params: { id: string } }) {
  const product = await getProductById(params.id);
  return {
    title: product ? `Edit: ${product.name} - Yunafa Admin` : 'Product Not Found',
  };
}

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const product = await getProductById(params.id);
  const allCategories: Category[] = await getCategories();

  if (!product) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold font-headline">Edit Product: <span className="text-primary">{product.name}</span></h1>
      <div className="bg-card p-6 rounded-lg shadow-lg">
        <ProductForm product={product} allCategories={allCategories} />
      </div>
    </div>
  );
}
