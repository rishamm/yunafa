
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
import { useState, useTransition, useEffect, ChangeEvent } from 'react';
import Image from 'next/image';
import { Loader2 } from 'lucide-react';

// Schema for form values expects URLs AFTER upload
const formSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters.'),
  category: z.string().min(3, 'Category must be at least 3 characters.'),
  content: z.string().min(10, 'Content must be at least 10 characters.'),
  imageUrl: z.string().url('Image URL must be a valid URL.').or(z.string().startsWith('/')),
  videoSrc: z.string().url('Video Source must be a valid URL.').or(z.string().startsWith('/')).optional().nullable(),
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
  const [isUploading, setIsUploading] = useState(false);

  const [posterFile, setPosterFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);

  const [posterPreview, setPosterPreview] = useState<string | null>(null);
  const [videoFileName, setVideoFileName] = useState<string | null>(null);
  
  const rawSufyUrlPrefixEnv = process.env.NEXT_PUBLIC_SUFY_PUBLIC_URL_PREFIX || "https://your-bucket-name.mos.sufycloud.com/";
  const defaultSufyUrlPrefix = rawSufyUrlPrefixEnv.endsWith('/') ? rawSufyUrlPrefixEnv : `${rawSufyUrlPrefixEnv}/`;


  const form = useForm<CarouselItemFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: carouselItem?.title || '',
      category: carouselItem?.category || '',
      content: carouselItem?.content || '',
      imageUrl: carouselItem?.imageUrl || `${defaultSufyUrlPrefix}placeholder-poster.jpg`,
      videoSrc: carouselItem?.videoSrc || '',
      dataAiHint: carouselItem?.dataAiHint || 'fashion shopping',
    },
  });

  useEffect(() => {
    if (carouselItem) {
      form.reset({
        title: carouselItem.title,
        category: carouselItem.category,
        content: carouselItem.content,
        imageUrl: carouselItem.imageUrl,
        videoSrc: carouselItem.videoSrc || '',
        dataAiHint: carouselItem.dataAiHint,
      });
      setPosterPreview(carouselItem.imageUrl);
      setVideoFileName(carouselItem.videoSrc ? (carouselItem.videoSrc.startsWith('http') ? 'Remote Video' : carouselItem.videoSrc.split('/').pop() || 'Uploaded Video') : null);
    } else {
      // For new items, set default imageUrl and clear previews
      form.reset({ 
        title: '',
        category: '',
        content: '',
        imageUrl: `${defaultSufyUrlPrefix}placeholder-poster.jpg`,
        videoSrc: '',
        dataAiHint: 'fashion shopping',
      });
      setPosterPreview(null); 
      setVideoFileName(null);
    }
  }, [carouselItem, form, defaultSufyUrlPrefix]);


  const handleFileChange = (e: ChangeEvent<HTMLInputElement>, setFile: (file: File | null) => void, setPreviewVisual?: (preview: string | null) => void, setFileNameVisual?: (name: string | null) => void) => {
    const file = e.target.files?.[0] || null;
    setFile(file);
    if (setPreviewVisual && file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewVisual(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else if (setPreviewVisual) {
      setPreviewVisual(null); 
    }

    if (setFileNameVisual) {
        setFileNameVisual(file ? file.name : null);
    }
  };

  const uploadFileToSufy = async (file: File): Promise<string | null> => {
    // This local setIsUploading is for individual file progress, not the main form submission.
    // Consider if you need separate indicators or one global one.
    // For now, the main form's isSubmitting will cover this.
    const tempFormData = new FormData();
    tempFormData.append('file', file);

    try {
      const res = await fetch('/api/upload', { // Ensure this API route is correctly set up
        method: 'POST',
        body: tempFormData,
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || `Upload failed for ${file.name}`);
      }
      toast({ title: 'File Uploaded', description: `${file.name} uploaded successfully to Sufy.` });
      return data.fileUrl;
    } catch (error: any) {
      toast({ title: 'Sufy Upload Error', description: error.message, variant: 'destructive' });
      return null;
    }
  };

  async function onSubmit(values: CarouselItemFormValues) {
    setIsUploading(true); // Indicates the overall submission process involving potential uploads
    
    let finalImageUrl = values.imageUrl;
    if (posterFile) { // If a new poster file was selected by the user
      const uploadedPosterUrl = await uploadFileToSufy(posterFile);
      if (uploadedPosterUrl) {
        finalImageUrl = uploadedPosterUrl;
      } else {
        setIsUploading(false); // Stop submission if poster upload fails
        return; 
      }
    }

    let finalVideoSrc: string | null = values.videoSrc || null; // Default to existing or cleared value
    if (videoFile) { // If a new video file was selected
      const uploadedVideoUrl = await uploadFileToSufy(videoFile);
      if (uploadedVideoUrl) {
        finalVideoSrc = uploadedVideoUrl;
      } else {
        setIsUploading(false); // Stop if video upload fails
        return; 
      }
    } else if (values.videoSrc === '' && !videoFile && carouselItem?.videoSrc) { 
      // If videoSrc field was explicitly cleared and no new file, it means remove existing video.
      // Actual deletion from Sufy for old videoSrc would happen in server action if needed.
      finalVideoSrc = null;
    }


    const submissionData = {
      ...values,
      imageUrl: finalImageUrl,
      videoSrc: finalVideoSrc,
    };
    
    setIsUploading(false); // Done with file uploads part, now proceed to server action

    startTransition(async () => {
      const actionFormData = new FormData();
      Object.entries(submissionData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          actionFormData.append(key, String(value));
        } else if (key === 'videoSrc' && (value === null || value === '')) {
           actionFormData.append(key, ''); // Ensure videoSrc can be explicitly emptied
        }
      });
      
      // Include original URLs if item exists, for comparison in server action if needed for cleanup
      if (carouselItem?.id) {
        actionFormData.append('originalImageUrl', carouselItem.imageUrl);
        if (carouselItem.videoSrc) {
            actionFormData.append('originalVideoSrc', carouselItem.videoSrc);
        }
      }

      const action = carouselItem
        ? updateCarouselItemAction(carouselItem.id, actionFormData)
        : createCarouselItemAction(actionFormData);
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

  const isSubmitting = isPending || isUploading;
  const currentImageUrlInForm = form.getValues('imageUrl');
  const imagePreviewSrc = posterPreview || currentImageUrlInForm;


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

        <FormItem>
          <FormLabel>Poster Image</FormLabel>
          <FormControl>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange(e, setPosterFile, setPosterPreview)}
            />
          </FormControl>
          <FormDescription>Upload a new poster image. If not provided, the existing or default image will be used.</FormDescription>
          {imagePreviewSrc && (
            <div className="mt-2">
              <Image 
                src={imagePreviewSrc} 
                alt="Poster preview" 
                width={100} 
                height={100} 
                className="rounded object-cover" 
                onError={() => {
                  // If the intended src (local preview or form URL) fails, show a generic placeholder.
                  // This only affects the visual preview, not the form's `imageUrl` value itself.
                  setPosterPreview('https://placehold.co/100x100.png');
                }}
              />
            </div>
          )}
          {/* Display error for imageUrl from Zod schema if any */}
          <FormMessage>{form.formState.errors.imageUrl?.message}</FormMessage>
        </FormItem>
        
        {/* This hidden input carries the imageUrl. Its value is updated if a new poster is uploaded. */}
        {/* No, this is not needed. `form.setValue('imageUrl', uploadedPosterUrl)` handles it if upload successful. */}
        {/* The `values.imageUrl` passed to `onSubmit` will be the original or the new one. */}


        <FormItem>
          <FormLabel>Video File (Optional)</FormLabel>
          <FormControl>
            <Input
              type="file"
              accept="video/*"
              name="videoFile" 
              onChange={(e) => handleFileChange(e, setVideoFile, undefined, setVideoFileName)}
            />
          </FormControl>
          <FormDescription>
            Upload a new video file. The poster image above will be used as its preview. 
            To remove an existing video, clear the "Video Source URL" field below and ensure no new video file is selected.
          </FormDescription>
          {videoFileName && <p className="text-sm text-muted-foreground mt-1">Selected video: {videoFileName}</p>}
           {/* Display error for videoSrc from Zod schema if any */}
           <FormMessage>{form.formState.errors.videoSrc?.message}</FormMessage>
        </FormItem>

        <FormField
          control={form.control}
          name="videoSrc"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Video Source URL (Optional - Advanced)</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Leave empty if uploading a new video or no video" 
                  {...field} 
                  value={field.value ?? ''} // Ensure value is not null for controlled input
                  onChange={(e) => {
                    field.onChange(e); // Update form state
                    if (!videoFile) { // Only update text filename display if no local file is selected
                        setVideoFileName(e.target.value ? (e.target.value.startsWith('http') ? "Remote Video" : e.target.value.split('/').pop() || "Video from URL") : null);
                    }
                    if(e.target.value === '' && videoFile) { // If URL cleared but local file exists, clear local file state too
                        setVideoFile(null);
                        // videoFileName would have been updated by handleFileChange for videoFile
                    }
                  }}
                />
              </FormControl>
              <FormDescription>
                Current video URL. If you upload a new video file, this field will be overwritten by its URL. 
                If you don't upload a new file, this URL will be used. Clear this field to remove the video if no new file is uploaded.
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
          <Button type="button" variant="outline" onClick={() => router.back()} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting} className="bg-primary hover:bg-primary/90 text-primary-foreground">
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isUploading ? 'Uploading...' : (isPending ? (carouselItem ? 'Saving...' : 'Creating...') : (carouselItem ? 'Save Changes' : 'Create Item'))}
          </Button>
        </div>
      </form>
    </Form>
  );
}
