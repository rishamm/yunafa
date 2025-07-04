
import Link from 'next/link';
import { getCarouselItems } from '@/lib/data';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { PlusCircle, Edit, Video, VideoOff } from 'lucide-react';
import { DeleteCarouselItemButton } from './_components/DeleteCarouselItemButton';

export const metadata = {
  title: 'Manage Carousel - Yunafa Admin',
};

export default async function AdminCarouselPage() {
  const carouselItems = await getCarouselItems();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold font-headline">Carousel Items</h1>
        <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
          <Link href="/admin/carousel/new">
            <PlusCircle className="mr-2 h-5 w-5" /> Add New Item
          </Link>
        </Button>
      </div>

      <div className="bg-card p-6 rounded-lg shadow-lg">
        {carouselItems.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Content Snippet</TableHead>
                <TableHead className="w-[100px] text-center">Video</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {carouselItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.title}</TableCell>
                  <TableCell className="text-muted-foreground">{item.category}</TableCell>
                  <TableCell className="text-muted-foreground max-w-sm truncate">{item.content}</TableCell>
                  <TableCell className="text-center">
                    {item.videoSrc ? (
                      <Video className="h-5 w-5 mx-auto text-green-500" />
                    ) : (
                      <VideoOff className="h-5 w-5 mx-auto text-muted-foreground" />
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" asChild className="hover:text-primary transition-colors">
                      <Link href={`/admin/carousel/edit/${item.id}`}>
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Link>
                    </Button>
                    <DeleteCarouselItemButton itemId={item.id} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
           <p className="text-center text-muted-foreground py-8">No carousel items found. Add your first item!</p>
        )}
      </div>
    </div>
  );
}
