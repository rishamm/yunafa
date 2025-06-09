
import Link from 'next/link';
import type { Product } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { ImageWithFallback } from '@/components/common/ImageWithFallback'; // Import the new component

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out flex flex-col h-full">
      <CardHeader className="p-0">
        <Link href={`/products/${product.id}`} className="block group">
          <div className="aspect-[4/3] relative w-full">
            <ImageWithFallback
              initialSrc={product.imageUrl}
              alt={product.name}
              fill={true}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              data-ai-hint={product['data-ai-hint'] || "product image"}
            />
          </div>
        </Link>
      </CardHeader>
      <CardContent className="p-6 flex-grow">
        <CardTitle className="text-xl mb-2 font-headline">
          <Link href={`/products/${product.id}`} className="hover:text-primary transition-colors">
            {product.name}
          </Link>
        </CardTitle>
        <p className="text-muted-foreground text-sm mb-4 line-clamp-3">{product.description}</p>
      </CardContent>
      <CardFooter className="p-6 pt-0 flex justify-between items-center">
        <p className="text-lg font-semibold text-primary font-headline">${product.price.toLocaleString()}</p>
        <Button asChild variant="ghost" size="sm" className="text-primary hover:bg-primary/10">
          <Link href={`/products/${product.id}`}>
            View Details <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
