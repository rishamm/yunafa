
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

  const [posterPreview, setPosterPreview] = useState<string | null>(carouselItem?.imageUrl || null);
  const [videoFileName, setVideoFileName] = useState<string | null>(
    carouselItem?.videoSrc ? (carouselItem.videoSrc.startsWith('http') ? 'Remote Video' : carouselItem.videoSrc.split('/').pop() || 'Uploaded Video') : null
  );
  
  const defaultSufyUrlPrefix = process.env.NEXT_PUBLIC_SUFY_PUBLIC_URL_PREFIX || "https://your-bucket-name.mos.sufycloud.com/";


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
    }
  }, [carouselItem, form, defaultSufyUrlPrefix]);


  const handleFileChange = (e: ChangeEvent<HTMLInputElement>, setFile: (file: File | null) => void, setPreview?: (preview: string | null) => void) => {
    const file = e.target.files?.[0] || null;
    setFile(file);
    if (setPreview && file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else if (setPreview) {
      setPreview(null); // Clear preview if no file
    }
    if (e.target.name === "videoFile" && !setPreview && setVideoFileName) { // for video file name
        setVideoFileName(file ? file.name : null);
    }
  };

  const uploadFile = async (file: File): Promise<string | null> => {
    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Upload failed');
      }
      toast({ title: 'File Uploaded', description: `${file.name} uploaded successfully.` });
      return data.fileUrl;
    } catch (error: any) {
      toast({ title: 'Upload Error', description: error.message, variant: 'destructive' });
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  async function onSubmit(values: CarouselItemFormValues) {
    setIsUploading(true); // General uploading state for the whole process
    
    let finalImageUrl = values.imageUrl;
    if (posterFile) {
      const uploadedPosterUrl = await uploadFile(posterFile);
      if (uploadedPosterUrl) {
        finalImageUrl = uploadedPosterUrl;
      } else {
        setIsUploading(false);
        return; // Stop submission if poster upload fails
      }
    }

    let finalVideoSrc = values.videoSrc;
    if (videoFile) {
      const uploadedVideoUrl = await uploadFile(videoFile);
      if (uploadedVideoUrl) {
        finalVideoSrc = uploadedVideoUrl;
      } else {
        // If poster uploaded but video fails, decide if you want to proceed or rollback
        // For now, we'll stop.
        setIsUploading(false);
        return; 
      }
    } else if (values.videoSrc === '' && !videoFile) { // If videoSrc was cleared and no new file
        finalVideoSrc = null;
    }


    const submissionData = {
      ...values,
      imageUrl: finalImageUrl,
      videoSrc: finalVideoSrc,
    };
    
    setIsUploading(false); // Done with file uploads if any

    startTransition(async () => {
      const actionFormData = new FormData();
      Object.entries(submissionData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          actionFormData.append(key, String(value));
        } else if (key === 'videoSrc' && (value === null || value === '')) {
           actionFormData.append(key, ''); 
        }
      });
      
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
          <FormDescription>Upload a new poster image. If not provided, the existing or default URL will be used.</FormDescription>
          {(posterPreview || form.getValues('imageUrl')) && (
            <div className="mt-2">
              <Image 
                src={posterPreview || form.getValues('imageUrl')} 
                alt="Poster preview" 
                width={100} 
                height={100} 
                className="rounded object-cover" 
                onError={() => {
                  if (posterPreview) setPosterPreview(`${defaultSufyUrlPrefix}placeholder-poster.jpg`); // fallback for bad preview
                  form.setValue('imageUrl', `${defaultSufyUrlPrefix}placeholder-poster.jpg`); // fallback for bad initial URL
                }}
              />
            </div>
          )}
          <FormMessage>{form.formState.errors.imageUrl?.message}</FormMessage>
        </FormItem>
        
        {/* Hidden input to carry the imageUrl if no new file is uploaded */}
        <input type="hidden" {...form.register('imageUrl')} />


        <FormItem>
          <FormLabel>Video File (Optional)</FormLabel>
          <FormControl>
            <Input
              type="file"
              accept="video/*"
              name="videoFile" // added name for specific handling
              onChange={(e) => handleFileChange(e, setVideoFile, undefined /* no direct preview for video file */)}
            />
          </FormControl>
          <FormDescription>
            Upload a new video file. The poster image above will be used. 
            If not provided, the existing or default video source URL will be used. 
            To remove an existing video, clear the "Video Source URL" field below and ensure no new video file is selected.
          </FormDescription>
          {videoFileName && <p className="text-sm text-muted-foreground mt-1">Selected video: {videoFileName}</p>}
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
                  value={field.value ?? ''}
                  onChange={(e) => {
                    field.onChange(e);
                    if (!videoFile) { // Only update text filename if no file is actively selected
                        setVideoFileName(e.target.value ? (e.target.value.startsWith('http') ? "Remote Video" : e.target.value.split('/').pop() || "Video from URL") : null);
                    }
                  }}
                />
              </FormControl>
              <FormDescription>
                Current video URL. If you upload a new video file, this will be overwritten. 
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
