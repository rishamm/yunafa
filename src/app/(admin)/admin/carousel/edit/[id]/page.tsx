
import { CarouselItemForm } from '@/components/forms/CarouselItemForm';
import { getCarouselItemById, getCategories } from '@/lib/data';
import { notFound } from 'next/navigation';
import type { Category } from '@/lib/types';

export async function generateMetadata({ params }: { params: { id: string } }) {
  const item = await getCarouselItemById(params.id);
  return {
    title: item ? `Edit: ${item.title} - Yunafa Admin` : 'Carousel Item Not Found',
  };
}

export default async function EditCarouselItemPage({ params }: { params: { id: string } }) {
  const item = await getCarouselItemById(params.id);
  const allCategories: Category[] = await getCategories();
  console.log(`EditCarouselItemPage (id: ${params.id}): allCategories fetched:`, JSON.stringify(allCategories.map(c => ({id: c.id, name: c.name})), null, 2));


  if (!item) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold font-headline">Edit Carousel Item: <span className="text-primary">{item.title}</span></h1>
      <div className="bg-card p-6 rounded-lg shadow-lg">
        <CarouselItemForm carouselItem={item} allCategories={allCategories} />
      </div>
    </div>
  );
}

