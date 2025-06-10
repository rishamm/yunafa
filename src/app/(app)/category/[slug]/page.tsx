import { getCategoryBySlug, getProductsByCategoryId } from '@/lib/data';
import { ProductList } from '@/components/products/ProductList';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const category = await getCategoryBySlug(params.slug);
  if (!category) {
    return { title: 'Category Not Found' };
  }
  return {
    title: `${category.name} - Yunafa`,
    description: `Browse products in the ${category.name} category. ${category.description || ''}`,
  };
}

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const category = await getCategoryBySlug(params.slug);

  if (!category) {
    notFound();
  }

  const products = await getProductsByCategoryId(category.id);

  return (
    <div className="container mx-auto px-4">
       <Button variant="outline" asChild className="mb-8">
        <Link href="/">
          <ChevronLeft className="mr-2 h-4 w-4" /> All Categories
        </Link>
      </Button>
      <h1 className="text-4xl font-bold mb-4 font-headline">{category.name}</h1>
      {category.description && <p className="text-lg text-muted-foreground mb-8">{category.description}</p>}
      <ProductList products={products} />
    </div>
  );
}
