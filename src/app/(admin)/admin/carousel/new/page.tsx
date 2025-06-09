import { CarouselItemForm } from '@/components/forms/CarouselItemForm';

export const metadata = {
  title: 'Add New Carousel Item - Yunafa Admin',
};

export default function NewCarouselItemPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold font-headline">Add New Carousel Item</h1>
      <div className="bg-card p-6 rounded-lg shadow-lg">
        <CarouselItemForm />
      </div>
    </div>
  );
}
