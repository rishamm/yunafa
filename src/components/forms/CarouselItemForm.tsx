
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

// Schema for form values, including File objects
const formSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters.'),
  category: z.string().min(3, 'Category must be at least 3 characters.'),
  imageUrlFile: z.custom<File>((val) => val instanceof File, {
    message: "A poster image file is required.",
  }).optional(), // Optional in form, required for create in action
  videoFile: z.custom<File>((val) => val instanceof File, {
    message: "Please upload a video file.",
  }).optional().nullable(),
  content: z.string().min(10, 'Content must be at least 10 characters.'),
  dataAiHint: z.string().optional(),
  // Store existing URLs to display and to know if a new file was uploaded
  currentImageUrl: z.string().optional(),
  currentVideoSrc: z.string().optional().nullable(),
});

type CarouselItemFormValues = z.infer<typeof formSchema>;

interface CarouselItemFormProps {
  carouselItem?: CarouselItem;
}

export function CarouselItemForm({ carouselItem }: CarouselItemFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [imagePreview, setImagePreview] = React.useState<string | null>(carouselItem?.imageUrl || null);
  const [videoFileName, setVideoFileName] = React.useState<string | null>(carouselItem?.videoSrc ? 'Existing video' : null);


  const form = useForm<CarouselItemFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: carouselItem?.title || '',
      category: carouselItem?.category || '',
      content: carouselItem?.content || '',
      dataAiHint: carouselItem?.dataAiHint || 'fashion shopping',
      imageUrlFile: undefined,
      videoFile: undefined,
      currentImageUrl: carouselItem?.imageUrl,
      currentVideoSrc: carouselItem?.videoSrc,
    },
  });

  const handleImageFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      form.setValue('imageUrlFile', file);
      setImagePreview(URL.createObjectURL(file));
    } else {
      form.setValue('imageUrlFile', undefined);
      setImagePreview(carouselItem?.imageUrl || null); // Revert to original if file removed
    }
  };

  const handleVideoFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      form.setValue('videoFile', file);
      setVideoFileName(file.name);
    } else {
      form.setValue('videoFile', undefined);
      setVideoFileName(carouselItem?.videoSrc ? 'Existing video' : null);
    }
  };

  async function onSubmit(values: CarouselItemFormValues) {
    startTransition(async () => {
      const formData = new FormData();
      formData.append('title', values.title);
      formData.append('category', values.category);
      formData.append('content', values.content);
      if (values.dataAiHint) {
        formData.append('dataAiHint', values.dataAiHint);
      }

      // Append files if they are provided
      if (values.imageUrlFile instanceof File) {
        formData.append('imageUrlFile', values.imageUrlFile);
      } else if (carouselItem?.imageUrl && !values.imageUrlFile) {
        // If editing and no new image file, pass the current URL
        // This helps the action know not to expect a new file to process for image
         formData.append('currentImageUrl', carouselItem.imageUrl);
      }


      if (values.videoFile instanceof File) {
        formData.append('videoFile', values.videoFile);
      } else if (carouselItem?.videoSrc && !values.videoFile) {
        // If editing and no new video file, pass the current URL
         formData.append('currentVideoSrc', carouselItem.videoSrc);
      }


      const action = carouselItem
        ? updateCarouselItemAction(carouselItem.id, formData)
        : createCarouselItemAction(formData);
      const result = await action;

      if (result.success) {
        toast({
          title: carouselItem ? 'Carousel Item Updated' : 'Carousel Item Created',
          description: result.message || "Action successful. Note: Firebase Storage upload logic is pending.",
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
          name="imageUrlFile"
          render={() => ( // field is not directly used for file input control
            <FormItem>
              <FormLabel>Poster Image File</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageFileChange}
                />
              </FormControl>
              <FormDescription>Required. This image will be used as the poster. (Max 2MB recommended)</FormDescription>
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
          name="videoFile"
          render={() => ( // field is not directly used for file input control
            <FormItem>
              <FormLabel>Video File (Optional)</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept="video/*"
                  onChange={handleVideoFileChange}
                />
              </FormControl>
              <FormDescription>
                Optional. If provided, this video will be used. The poster image above will be its preview. (Max 10MB recommended)
              </FormDescription>
              {videoFileName && <p className="text-sm text-muted-foreground mt-1">Selected video: {videoFileName}</p>}
              {carouselItem?.videoSrc && !videoFileName && (
                <p className="text-sm text-muted-foreground mt-1">Currently using existing video: <a href={carouselItem.videoSrc} target="_blank" rel="noopener noreferrer" className="underline">{carouselItem.videoSrc}</a></p>
              )}
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
