
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function ProductCardSkeleton() {
  return (
    <Card className="overflow-hidden shadow-lg flex flex-col h-full bg-card">
      <CardHeader className="p-0">
        <div className="aspect-[4/3] relative w-full">
          <Skeleton className="h-full w-full bg-muted" />
        </div>
      </CardHeader>
      <CardContent className="p-6 flex-grow space-y-3">
        <Skeleton className="h-5 w-3/4 rounded-md bg-muted" />
        <Skeleton className="h-4 w-full rounded-md bg-muted" />
        <Skeleton className="h-4 w-full rounded-md bg-muted" />
        <Skeleton className="h-4 w-5/6 rounded-md bg-muted" />
      </CardContent>
      <CardFooter className="p-6 pt-0 flex justify-between items-center">
        <Skeleton className="h-6 w-1/4 rounded-md bg-muted" />
        <Skeleton className="h-9 w-1/3 rounded-md bg-muted" />
      </CardFooter>
    </Card>
  );
}
