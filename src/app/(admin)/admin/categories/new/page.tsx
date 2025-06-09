import { CategoryForm } from '@/components/forms/CategoryForm';

export const metadata = {
  title: 'Add New Category - Yunafa Admin',
};

export default function NewCategoryPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold font-headline">Add New Category</h1>
      <div className="bg-card p-6 rounded-lg shadow-lg">
        <CategoryForm />
      </div>
    </div>
  );
}
