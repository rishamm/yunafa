import Link from 'next/link';
import { getCategories } from '@/lib/data';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import { DeleteCategoryButton } from './_components/DeleteCategoryButton';


export const metadata = {
  title: 'Manage Categories - Yunafa Admin',
};

export default async function AdminCategoriesPage() {
  const categories = await getCategories();
   console.log(categories)
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold font-headline">Categories</h1>
        <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
          <Link href="/admin/categories/new">
            <PlusCircle className="mr-2 h-5 w-5" /> Add New Category
          </Link>
        </Button>
      </div>

      <div className="bg-card p-6 rounded-lg shadow-lg">
        {categories.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell className="font-medium">{category.name}</TableCell>
                  <TableCell className="text-muted-foreground">{category.slug}</TableCell>
                  <TableCell className="text-muted-foreground max-w-md truncate">{category.description || 'N/A'}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" asChild className="hover:text-primary transition-colors">
                      <Link href={`/admin/categories/edit/${category.id}`}>
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Link>
                    </Button>
                    <DeleteCategoryButton categoryId={category.id} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
           <p className="text-center text-muted-foreground py-8">No categories found. Add your first category!</p>
        )}
      </div>
    </div>
  );
}
