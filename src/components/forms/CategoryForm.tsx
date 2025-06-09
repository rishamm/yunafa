'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import type { Category } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { createCategoryAction, updateCategoryAction } from '@/lib/actions';
import { useTransition } from 'react';

const formSchema = z.object({
  name: z.string().min(2, 'Category name must be at least 2 characters.'),
  description: z.string().optional(),
});

type CategoryFormValues = z.infer<typeof formSchema>;

interface CategoryFormProps {
  category?: Category;
}

export function CategoryForm({ category }: CategoryFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: category?.name || '',
      description: category?.description || '',
    },
  });

  async function onSubmit(values: CategoryFormValues) {
    startTransition(async () => {
      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, String(value));
        }
      });

      const action = category ? updateCategoryAction(category.id, formData) : createCategoryAction(formData);
      const result = await action;

      if (result.success) {
        toast({
          title: category ? 'Category Updated' : 'Category Created',
          description: result.message,
        });
        router.push('/admin/categories');
        router.refresh();
      } else {
        toast({
          title: 'Error',
          description: result.error || 'An unknown error occurred.',
          variant: 'destructive',
        });
         if (result.errors) {
          Object.entries(result.errors).forEach(([field, messages]) => {
            form.setError(field as keyof CategoryFormValues, {
              type: 'manual',
              message: (messages as string[]).join(', '),
            });
          });
        }
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-xl">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Luxury Watches" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (Optional)</FormLabel>
              <FormControl>
                <Textarea placeholder="Brief description of the category..." {...field} rows={4} />
              </FormControl>
              <FormDescription>This will be shown on the category page.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" disabled={isPending} className="bg-primary hover:bg-primary/90 text-primary-foreground">
            {isPending ? (category ? 'Saving...' : 'Creating...') : (category ? 'Save Changes' : 'Create Category')}
          </Button>
        </div>
      </form>
    </Form>
  );
}
