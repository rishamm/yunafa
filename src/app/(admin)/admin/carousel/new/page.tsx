
import { CarouselItemForm } from '@/components/forms/CarouselItemForm';
import { getCategories } from '@/lib/data';
import type { Category } from '@/lib/types';

export const metadata = {
  title: 'Add New Carousel Item - Yunafa Admin',
};

export default async function NewCarouselItemPage() {
  const allCategories: Category[] = await getCategories();
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold font-headline">Add New Carousel Item</h1>
      <div className="bg-card p-6 rounded-lg shadow-lg">
        <CarouselItemForm allCategories={allCategories} />
      </div>
    </div>
  );
}
