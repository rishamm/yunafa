import { ProductForm } from '@/components/forms/ProductForm';
import { getCategories } from '@/lib/data';
import type { Category } from '@/lib/types';

export const metadata = {
  title: 'Add New Product - Yunafa Admin',
};

export default async function NewProductPage() {
  const allCategories: Category[] = await getCategories();
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold font-headline">Add New Product</h1>
      <div className="bg-card p-6 rounded-lg shadow-lg">
        <ProductForm allCategories={allCategories} />
      </div>
    </div>
  );
}
