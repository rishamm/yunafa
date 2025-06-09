import { CategoryForm } from '@/components/forms/CategoryForm';
import { getCategoryById } from '@/lib/data';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }: { params: { id: string } }) {
  const category = await getCategoryById(params.id);
  return {
    title: category ? `Edit: ${category.name} - Yunafa Admin` : 'Category Not Found',
  };
}

export default async function EditCategoryPage({ params }: { params: { id: string } }) {
  const category = await getCategoryById(params.id);

  if (!category) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold font-headline">Edit Category: <span className="text-primary">{category.name}</span></h1>
      <div className="bg-card p-6 rounded-lg shadow-lg">
        <CategoryForm category={category} />
      </div>
    </div>
  );
}
