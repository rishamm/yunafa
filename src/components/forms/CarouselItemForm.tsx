
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
import { Loader2 } from 'lucide-react';

// Schema for form values, now without imageUrl and dataAiHint
const formSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters.'),
  category: z.string().min(3, 'Category must be at least 3 characters.'),
  content: z.string().min(10, 'Content must be at least 10 characters.'),
  videoSrc: z.string().url('Video Source must be a valid URL.').or(z.string().startsWith('/')).optional().nullable(),
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
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoFileName, setVideoFileName] = useState<string | null>(null);
  
  const form = useForm<CarouselItemFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: carouselItem?.title || '',
      category: carouselItem?.category || '',
      content: carouselItem?.content || '',
      videoSrc: carouselItem?.videoSrc || '',
    },
  });

  useEffect(() => {
    if (carouselItem) {
      form.reset({
        title: carouselItem.title,
        category: carouselItem.category,
        content: carouselItem.content,
        videoSrc: carouselItem.videoSrc || '',
      });
      setVideoFileName(carouselItem.videoSrc ? (carouselItem.videoSrc.startsWith('http') ? 'Remote Video' : carouselItem.videoSrc.split('/').pop() || 'Uploaded Video') : null);
    } else {
      form.reset({ 
        title: '',
        category: '',
        content: '',
        videoSrc: '',
      });
      setVideoFileName(null);
    }
  }, [carouselItem, form]);


  const handleFileChange = (e: ChangeEvent<HTMLInputElement>, setFile: (file: File | null) => void, setFileNameVisual?: (name: string | null) => void) => {
    const file = e.target.files?.[0] || null;
    setFile(file);
    if (setFileNameVisual) {
        setFileNameVisual(file ? file.name : null);
    }
  };

  const uploadFileToSufy = async (file: File): Promise<string | null> => {
    const tempFormData = new FormData();
    tempFormData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
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
    setIsUploading(true);
    
    let finalVideoSrc: string | null | undefined = values.videoSrc; // Use undefined to distinguish from null if not set
    if (videoFile) { 
      const uploadedVideoUrl = await uploadFileToSufy(videoFile);
      if (uploadedVideoUrl) {
        finalVideoSrc = uploadedVideoUrl;
      } else {
        setIsUploading(false); 
        return; 
      }
    } else if (values.videoSrc === '' && !videoFile && carouselItem?.videoSrc) { 
      finalVideoSrc = null; // Explicitly clearing the video
    }


    const submissionData = {
      ...values,
      videoSrc: finalVideoSrc,
    };
    
    setIsUploading(false);

    startTransition(async () => {
      const actionFormData = new FormData();
      Object.entries(submissionData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          actionFormData.append(key, String(value));
        } else if (key === 'videoSrc' && (value === null || value === '')) {
           actionFormData.append(key, ''); 
        }
      });
      
      if (carouselItem?.id && carouselItem.videoSrc) {
         actionFormData.append('originalVideoSrc', carouselItem.videoSrc);
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
          <FormLabel>Video File (Optional)</FormLabel>
          <FormControl>
            <Input
              type="file"
              accept="video/*"
              name="videoFile" 
              onChange={(e) => handleFileChange(e, setVideoFile, setVideoFileName)}
            />
          </FormControl>
          <FormDescription>
            Upload a new video file. 
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
                    if (!videoFile) { 
                        setVideoFileName(e.target.value ? (e.target.value.startsWith('http') ? "Remote Video" : e.target.value.split('/').pop() || "Video from URL") : null);
                    }
                    if(e.target.value === '' && videoFile) { 
                        setVideoFile(null);
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
