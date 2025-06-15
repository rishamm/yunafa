
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
import Image from 'next/image';
import React from 'react'; // Added for useState

// Schema for form values, expects URLs/paths now
const formSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters.'),
  category: z.string().min(3, 'Category must be at least 3 characters.'),
  imageUrl: z.string().url('Image URL must be a valid URL (e.g., https://example.com/image.png or /images/poster.jpg).').or(z.string().startsWith('/')),
  videoSrc: z.string().url('Video Source must be a valid URL or path (e.g., https://example.com/video.mp4 or /videos/promo.mp4).').or(z.string().startsWith('/')).optional().nullable(),
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
  // Preview state is only for display if an imageUrl is already present
  const [imagePreview, setImagePreview] = React.useState<string | null>(carouselItem?.imageUrl || null);


  const form = useForm<CarouselItemFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: carouselItem?.title || '',
      category: carouselItem?.category || '',
      content: carouselItem?.content || '',
      imageUrl: carouselItem?.imageUrl || 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&h=400&fit=crop&q=60', // default placeholder
      videoSrc: carouselItem?.videoSrc || '',
      dataAiHint: carouselItem?.dataAiHint || 'fashion shopping',
    },
  });

  // Update image preview if imageUrl field changes
  const watchedImageUrl = form.watch('imageUrl');
  React.useEffect(() => {
    if (watchedImageUrl && (watchedImageUrl.startsWith('http') || watchedImageUrl.startsWith('/'))) {
      setImagePreview(watchedImageUrl);
    } else {
      setImagePreview(null); // Clear preview if URL is invalid or empty
    }
  }, [watchedImageUrl]);


  async function onSubmit(values: CarouselItemFormValues) {
    startTransition(async () => {
      const formData = new FormData();
      // Append all values from the form. Zod schema ensures they are strings.
      Object.entries(values).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, String(value));
        } else if (key === 'videoSrc' && (value === null || value === '')) {
          // Ensure empty videoSrc is handled explicitly if schema allows nullable
          // For FormData, it might be better to not append if value is truly null/empty
          // However, our action schema handles optional/nullable string
           formData.append(key, ''); // Send as empty string, action will handle it
        }
      });
      
      const action = carouselItem
        ? updateCarouselItemAction(carouselItem.id, formData)
        : createCarouselItemAction(formData);
      const result = await action;

      if (result.success) {
        toast({
          title: carouselItem ? 'Carousel Item Updated' : 'Carousel Item Created',
          description: result.message || "Action successful.",
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
                  type="text"
                  placeholder="https://example.com/image.png or /images/poster.jpg"
                  {...field}
                />
              </FormControl>
              <FormDescription>Required. Publicly accessible URL or path to an image in your /public folder.</FormDescription>
              {imagePreview && (
                <div className="mt-2">
                  <Image src={imagePreview} alt="Poster preview" width={100} height={100} className="rounded object-cover" />
                </div>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="videoSrc"
          render={({ field }) => ( // field is not directly used for file input control
            <FormItem>
              <FormLabel>Video Source URL/Path (Optional)</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="https://example.com/video.mp4 or /videos/promo.mp4"
                  {...field}
                  // Ensure value is '' if null/undefined for controlled input
                  value={field.value ?? ''}
                />
              </FormControl>
              <FormDescription>
                Optional. Publicly accessible URL or path to a video in your /public folder.
                The image above will be used as its poster.
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
              <FormLabel>AI Hint for Poster (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="e.g., fashion shopping" {...field} />
              </FormControl>
              <FormDescription>Keywords for AI image search if the poster needs replacing (max 2 words).</FormDescription>
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
