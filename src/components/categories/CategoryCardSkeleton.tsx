
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function CategoryCardSkeleton() {
  return (
    <Card className="shadow-lg h-full flex flex-col bg-card">
      <CardHeader>
        <Skeleton className="h-6 w-3/4 rounded-md bg-muted" />
      </CardHeader>
      <CardContent className="flex-grow space-y-2">
        <Skeleton className="h-4 w-full rounded-md bg-muted" />
        <Skeleton className="h-4 w-5/6 rounded-md bg-muted" />
      </CardContent>
      <CardContent className="pt-0">
        <Skeleton className="h-5 w-1/2 rounded-md bg-muted" />
      </CardContent>
    </Card>
  );
}
