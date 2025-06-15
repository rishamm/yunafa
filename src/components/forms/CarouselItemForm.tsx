
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
import type { CarouselItem } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { createCarouselItemAction, updateCarouselItemAction } from '@/lib/actions';
import { useTransition } from 'react';

const formSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters.'),
  category: z.string().min(3, 'Category must be at least 3 characters.'),
  imageUrl: z.preprocess(
    (val) => (typeof val === 'string' ? val.trim() : val),
    z.string().url('Must be a valid URL for the image or video poster. Example: https://example.com/image.png')
     .or(z.string().startsWith('https://images.unsplash.com'))
     .or(z.string().startsWith('https://placehold.co'))
  ),
  videoSrc: z.preprocess(
    (val) => (typeof val === 'string' && val.trim() === '' ? null : val), // Treat empty string as null
    z.string()
      .refine(val => val.startsWith('http') || val.startsWith('/'), {
        message: 'Must be a valid URL (e.g., https://...) or a local path (e.g., /my-video.mp4)',
      })
      .optional()
      .nullable()
  ),
  content: z.string().min(10, 'Content must be at least 10 characters.'),
  dataAiHint: z.string().optional(),
});

type CarouselItemFormValues = z.infer<typeof formSchema>;

interface CarouselItemFormProps {
  carouselItem?: CarouselItem;
}

export function CarouselItemForm({ carouselItem }: CarouselItemFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<CarouselItemFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: carouselItem?.title || '',
      category: carouselItem?.category || '',
      imageUrl: carouselItem?.imageUrl?.trim() || 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&h=800&fit=crop&q=60',
      videoSrc: carouselItem?.videoSrc || null,
      content: carouselItem?.content || '',
      dataAiHint: carouselItem?.dataAiHint || 'fashion shopping',
    },
  });

  async function onSubmit(values: CarouselItemFormValues) {
    startTransition(async () => {
      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, String(value));
        } else if (key === 'videoSrc' && value === null) {
          // Explicitly do not append if null, or handle as server expects for deletion/clearing
        }
      });

      // Ensure videoSrc is either a string or not present if it's null/undefined
      // FormData converts null to "null", so we might need to handle this specifically
      // if the action expects absence of the field vs. a "null" string.
      // For now, String(value) will convert null to "null".
      // If `videoSrc` is truly optional and `null` means "not set",
      // the action and data layers should handle "null" string appropriately or
      // the field should be conditionally appended.

      const action = carouselItem ? updateCarouselItemAction(carouselItem.id, formData) : createCarouselItemAction(formData);
      const result = await action;

      if (result.success) {
        toast({
          title: carouselItem ? 'Carousel Item Updated' : 'Carousel Item Created',
          description: result.message,
        });
        router.push('/admin/carousel');
        router.refresh();
      } else {
        toast({
          title: 'Error',
          description: result.error || 'An unknown error occurred.',
          variant: 'destructive',
        });
        if (result.errors) {
          Object.entries(result.errors).forEach(([field, messages]) => {
            form.setError(field as keyof CarouselItemFormValues, {
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Summer Collection" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <FormControl>
                <Input placeholder="e.g., New Arrivals" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image URL / Video Poster URL</FormLabel>
              <FormControl>
                <Input 
                  placeholder="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&h=800&fit=crop&q=60" 
                  {...field} 
                />
              </FormControl>
              <FormDescription>Required. Direct URL to an image (or poster for video). Uses Unsplash for default.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="videoSrc"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Video Source URL/Path (Optional)</FormLabel>
              <FormControl>
                <Input 
                  placeholder="/videos/my-video.mp4 or https://example.com/video.mp4" 
                  {...field} 
                  value={field.value ?? ''} // Handle null for input value
                />
              </FormControl>
              <FormDescription>
                Provide a direct URL to a video or a path to a video in your `/public` folder (e.g., `/videos/main-promo.mp4`). 
                If provided, the Image URL above will be used as its poster.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content</FormLabel>
              <FormControl>
                <Textarea placeholder="Short description or content for the card..." {...field} rows={4} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="dataAiHint"
          render={({ field }) => (
            <FormItem>
              <FormLabel>AI Hint (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="e.g., fashion shopping" {...field} />
              </FormControl>
              <FormDescription>Keywords for AI image search if the image/poster needs replacing (max 2 words).</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" disabled={isPending} className="bg-primary hover:bg-primary/90 text-primary-foreground">
            {isPending ? (carouselItem ? 'Saving...' : 'Creating...') : (carouselItem ? 'Save Changes' : 'Create Item')}
          </Button>
        </div>
      </form>
    </Form>
  );
}
