
import type { Category } from '@/lib/types';
import { CategoryCard } from './CategoryCard';
import { CategoryCardSkeleton } from './CategoryCardSkeleton';

interface CategoryListProps {
  categories: Category[];
}

export function CategoryList({ categories }: CategoryListProps) {
  if (categories.length === 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        {[...Array(3)].map((_, index) => (
          <CategoryCardSkeleton key={`cat-skeleton-${index}`} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
      {categories.map((category) => (
        <CategoryCard key={category.id} category={category} />
      ))}
    </div>
  );
}
