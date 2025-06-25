
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button, buttonVariants } from '@/components/ui/button';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from '@/hooks/use-toast';
import type { CarouselItem, Category } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { createCarouselItemAction, updateCarouselItemAction } from '@/lib/actions';
import { useState, useTransition, useEffect, ChangeEvent } from 'react';
import { Loader2, UploadCloud } from 'lucide-react';
import { cn } from '@/lib/utils';

// This is the schema for the form's internal state.
// It's simpler and easier to manage.
const formSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters.'),
  category: z.string().min(1, 'Category is required.'),
  content: z.string().min(10, 'Content must be at least 10 characters.'),
  mediaType: z.enum(['image', 'video'], { required_error: 'You must select a media type.' }),
  mediaSrc: z.string().optional().nullable(),
  'data-ai-hint': z.string().optional(),
});

type CarouselItemFormValues = z.infer<typeof formSchema>;

interface CarouselItemFormProps {
  carouselItem?: CarouselItem;
  allCategories: Category[];
}

export function CarouselItemForm({ carouselItem, allCategories }: CarouselItemFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isUploading, setIsUploading] = useState(false);
  const [mediaFile, setMediaFile] = useState<File | null>(null);

  const form = useForm<CarouselItemFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: carouselItem?.title || '',
      category: carouselItem?.category || (allCategories.length > 0 ? allCategories[0].name : ''),
      content: carouselItem?.content || '',
      mediaType: carouselItem?.videoSrc ? 'video' : 'image',
      mediaSrc: carouselItem?.videoSrc || carouselItem?.imageSrc || '',
      'data-ai-hint': carouselItem?.['data-ai-hint'] || '',
    },
  });

  const mediaType = form.watch('mediaType');

  useEffect(() => {
    if (carouselItem) {
      form.reset({
        title: carouselItem.title,
        category: carouselItem.category,
        content: carouselItem.content,
        mediaType: carouselItem.videoSrc ? 'video' : 'image',
        mediaSrc: carouselItem.videoSrc || carouselItem.imageSrc || '',
        'data-ai-hint': carouselItem['data-ai-hint'] || '',
      });
    } else {
        form.reset({
            title: '',
            category: allCategories.length > 0 ? allCategories[0].name : '',
            content: '',
            mediaType: 'image',
            mediaSrc: '',
            'data-ai-hint': '',
        });
    }
    setMediaFile(null);
  }, [carouselItem, form, allCategories]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setMediaFile(file);
    if (file) {
      form.setValue('mediaSrc', ''); // Clear URL input if a file is selected
      form.clearErrors('mediaSrc');
    }
  };

  const uploadFileToSufy = async (file: File): Promise<string | null> => {
    const tempFormData = new FormData();
    tempFormData.append('file', file);
    setIsUploading(true);
    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: tempFormData,
      });

      if (res.ok && res.headers.get("content-type")?.includes("application/json")) {
        const data = await res.json();
         if (data.fileUrl) {
            toast({ title: 'File Uploaded', description: `${file.name} uploaded successfully.` });
            return data.fileUrl;
         } else {
            console.error('Upload API Error: JSON response missing fileUrl or indicates error.', data);
            toast({ 
                title: 'Upload Failed', 
                description: data.error || `Upload succeeded but API returned an issue: ${JSON.stringify(data.details || data)}`, 
                variant: 'destructive' 
            });
            return null;
         }
      } else {
        const responseText = await res.text();
        console.error('Upload API Error: Non-OK or Non-JSON response. Status:', res.status, 'Response Text:', responseText);
        toast({ 
            title: 'Upload Failed', 
            description: `Server returned status ${res.status}. Response: ${responseText.substring(0, 200)}${responseText.length > 200 ? '...' : ''}`, 
            variant: 'destructive' 
        });
        return null;
      }
    } catch (error: any) {
      console.error('Upload Client-Side Fetch/JSON Parse Error:', error.message, error);
      toast({ 
        title: 'Upload Error', 
        description: `Could not communicate with the upload service or parse its response. ${error.message}`, 
        variant: 'destructive' 
      });
      return null;
    } finally {
        setIsUploading(false);
    }
  };

  async function onSubmit(values: CarouselItemFormValues) {
    if (isUploading) return;

    let finalMediaSrc = values.mediaSrc;

    if (mediaFile) {
      const uploadedUrl = await uploadFileToSufy(mediaFile);
      if (uploadedUrl) {
        finalMediaSrc = uploadedUrl;
      } else {
        return; // Stop submission on failed upload
      }
    }

    if (!finalMediaSrc) {
        form.setError('mediaSrc', { type: 'manual', message: 'A media URL or file upload is required.'});
        return;
    }

    const submissionData = {
      title: values.title,
      category: values.category,
      content: values.content,
      'data-ai-hint': values['data-ai-hint'],
      imageSrc: values.mediaType === 'image' ? finalMediaSrc : null,
      videoSrc: values.mediaType === 'video' ? finalMediaSrc : null,
    };

    startTransition(async () => {
      const actionFormData = new FormData();
      Object.entries(submissionData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          actionFormData.append(key, String(value));
        } else if ((key === 'videoSrc' || key === 'imageSrc') && (value === null)) {
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
          if (result.errors.imageSrc || result.errors.videoSrc) {
            form.setError('mediaSrc', { type: 'manual', message: (result.errors.imageSrc || result.errors.videoSrc)!.join(', ') });
          }
          Object.entries(result.errors).forEach(([field, messages]) => {
             if (field !== 'imageSrc' && field !== 'videoSrc') {
                form.setError(field as keyof CarouselItemFormValues, {
                    type: 'manual',
                    message: (messages as string[]).join(', '),
                });
            }
          });
        }
      }
    });
  }

  const isSubmitting = isPending || isUploading;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Summer Collection" {...field} disabled={isSubmitting} />
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
                <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isSubmitting}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {allCategories.length > 0 ? (
                      allCategories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.name}>
                          {cat.name}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="disabled" disabled>No categories available. Create one first.</SelectItem>
                    )}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4 p-4 border rounded-lg">
           <FormField
            control={form.control}
            name="mediaType"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Media Type</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex items-center space-x-4"
                    disabled={isSubmitting}
                  >
                    <FormItem className="flex items-center space-x-2 space-y-0">
                      <FormControl><RadioGroupItem value="image" /></FormControl>
                      <FormLabel className="font-normal">Image</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-2 space-y-0">
                      <FormControl><RadioGroupItem value="video" /></FormControl>
                      <FormLabel className="font-normal">Video</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="text-center text-muted-foreground font-semibold text-sm">Provide a URL or Upload a File</div>

          <FormField
            control={form.control}
            name="mediaSrc"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{mediaType === 'image' ? 'Image Source URL' : 'Video Source URL'}</FormLabel>
                <FormControl>
                  <Input placeholder="https://..." {...field} value={field.value ?? ''} disabled={isSubmitting || !!mediaFile} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormItem>
            <FormLabel>Or Upload File</FormLabel>
            <FormControl>
              <label 
                  htmlFor="mediaFile-input" 
                  className={cn(
                  buttonVariants({ variant: "outline" }), 
                  "cursor-pointer flex items-center justify-center gap-2 w-full",
                  isSubmitting && "cursor-not-allowed opacity-50"
                  )}
              >
                  <UploadCloud className="h-4 w-4" />
                  <span className="truncate">{mediaFile ? mediaFile.name : `Choose ${mediaType === 'image' ? 'Image' : 'Video'} File`}</span>
                  <Input id="mediaFile-input" type="file" accept={mediaType === 'image' ? 'image/*' : 'video/*'} className="sr-only" onChange={handleFileChange} disabled={isSubmitting} />
              </label>
            </FormControl>
            <FormDescription>Uploading a file will override the URL input.</FormDescription>
          </FormItem>
        </div>

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content</FormLabel>
              <FormControl>
                <Textarea placeholder="Short description or content for the card..." {...field} rows={4} disabled={isSubmitting}/>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="data-ai-hint"
          render={({ field }) => (
            <FormItem>
              <FormLabel>AI Hint (for Image)</FormLabel>
              <FormControl>
                <Input 
                  placeholder="e.g., luxury watch" 
                  {...field}
                  value={field.value ?? ''}
                  disabled={isSubmitting || mediaType !== 'image'}
                />
              </FormControl>
              <FormDescription>
                Keywords for AI to find a replacement image if the URL is broken (max 2 words).
              </FormDescription>
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
