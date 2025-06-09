import Link from 'next/link';
import type { Category } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';

interface CategoryCardProps {
  category: Category;
}

export function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link href={`/category/${category.slug}`} className="block group">
      <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out h-full flex flex-col">
        <CardHeader>
          <CardTitle className="text-2xl font-headline group-hover:text-primary transition-colors">
            {category.name}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-grow">
          <p className="text-muted-foreground text-sm line-clamp-2">{category.description}</p>
        </CardContent>
        <CardContent className="pt-0">
            <div className="text-sm text-primary font-medium flex items-center">
              Browse Products <ArrowRight className="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
            </div>
        </CardContent>
      </Card>
    </Link>
  );
}
