
import { getProductById, getCategories } from '@/lib/data';
import { notFound } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ChevronLeft, Mail } from 'lucide-react';
import type { Category } from '@/lib/types';
import { ImageWithFallback } from '@/components/common/ImageWithFallback'; // Import the new component

export async function generateMetadata({ params }: { params: { id: string } }) {
  const product = await getProductById(params.id);
  if (!product) {
    return { title: 'Product Not Found' };
  }
  return {
    title: `${product.name} - Yunafa`,
    description: product.description,
  };
}

export default async function ProductDetailPage({ params }: { params: { id: string } }) {
  const product = await getProductById(params.id);
  
  if (!product) {
    notFound();
  }

  const allCategories: Category[] = await getCategories();
  const productCategories = allCategories.filter(cat => product.categoryIds.includes(cat.id));

  return (
    <div className="max-w-4xl mx-auto">
      <Button variant="outline" asChild className="mb-8">
        <Link href="/">
          <ChevronLeft className="mr-2 h-4 w-4" /> Back to Products
        </Link>
      </Button>
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-start">
        <div className="aspect-square relative rounded-lg overflow-hidden shadow-xl">
          <ImageWithFallback
            initialSrc={product.imageUrl}
            alt={product.name}
            fill={true}
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
            priority
            data-ai-hint={product['data-ai-hint'] || "product image"}
          />
        </div>
        <div>
          <h1 className="text-4xl font-bold mb-4 font-headline">{product.name}</h1>
          <p className="text-2xl font-semibold text-primary mb-6 font-headline">${product.price.toLocaleString()}</p>
          
          <div className="mb-6 prose max-w-none">
            <h2 className="text-xl font-semibold mb-2 font-headline">Description</h2>
            <p className="text-foreground/80">{product.description}</p>
          </div>

          {productCategories.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-2 font-headline">Categories:</h3>
              <div className="flex flex-wrap gap-2">
                {productCategories.map(category => (
                  <Link key={category.id} href={`/category/${category.slug}`}>
                    <Badge variant="secondary" className="hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer">{category.name}</Badge>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {product.tags.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-medium mb-2 font-headline">Tags:</h3>
              <div className="flex flex-wrap gap-2">
                {product.tags.map(tag => (
                  <Badge key={tag} variant="outline">{tag}</Badge>
                ))}
              </div>
            </div>
          )}

          <Button asChild size="lg" className="w-full md:w-auto bg-accent hover:bg-accent/90 text-accent-foreground">
            <Link href={`/contact?product_id=${product.id}&product_name=${encodeURIComponent(product.name)}`}>
              <Mail className="mr-2 h-5 w-5" /> Inquire about this product
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
