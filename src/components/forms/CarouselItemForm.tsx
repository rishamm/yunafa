
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
import { useToast } from '@/hooks/use-toast';
import type { CarouselItem, Category } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { createCarouselItemAction, updateCarouselItemAction } from '@/lib/actions';
import { useState, useTransition, useEffect, ChangeEvent } from 'react';
import { Loader2, UploadCloud, Image as ImageIcon, Video } from 'lucide-react';
import { cn } from '@/lib/utils';

const rawSufyUrlPrefix = process.env.NEXT_PUBLIC_SUFY_PUBLIC_URL_PREFIX || 'https://your-bucket-name.mos.sufycloud.com/';
const sufyUrlPrefixValidated = rawSufyUrlPrefix.endsWith('/') ? rawSufyUrlPrefix : `${rawSufyUrlPrefix}/`;

const formSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters.'),
  category: z.string().min(1, 'Category is required.'),
  content: z.string().min(10, 'Content must be at least 10 characters.'),
  videoSrc: z
    .string()
    .url('Video Source must be a valid URL.')
    .or(z.string().startsWith('/'))
    .or(z.string().startsWith(sufyUrlPrefixValidated))
    .or(z.literal('')) // Allow empty string if a file is selected
    .optional()
    .nullable(),
  imageSrc: z
    .string()
    .url('Image Source must be a valid URL.')
    .or(z.string().startsWith('/'))
    .or(z.string().startsWith(sufyUrlPrefixValidated))
    .or(z.literal('')) // Allow empty string if a file is selected
    .optional()
    .nullable(),
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

  // Media state
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoFileName, setVideoFileName] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageFileName, setImageFileName] = useState<string | null>(null);
  
  const form = useForm<CarouselItemFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: carouselItem?.title || '',
      category: carouselItem?.category || (allCategories.length > 0 ? allCategories[0].name : ''),
      content: carouselItem?.content || '',
      videoSrc: carouselItem?.videoSrc || '',
      imageSrc: carouselItem?.imageSrc || '',
      'data-ai-hint': carouselItem?.['data-ai-hint'] || '',
    },
  });

  useEffect(() => {
    if (carouselItem) {
      form.reset({
        title: carouselItem.title,
        category: carouselItem.category,
        content: carouselItem.content,
        videoSrc: carouselItem.videoSrc || '',
        imageSrc: carouselItem.imageSrc || '',
        'data-ai-hint': carouselItem['data-ai-hint'] || '',
      });
      // Video
      if (carouselItem.videoSrc) {
        setVideoFileName(carouselItem.videoSrc.startsWith('http') || carouselItem.videoSrc.startsWith('/') ? 'Remote/Linked Video' : carouselItem.videoSrc.split('/').pop() || 'Uploaded Video');
      } else {
        setVideoFileName(null);
      }
      setVideoFile(null); 
      // Image
      if (carouselItem.imageSrc) {
        setImageFileName(carouselItem.imageSrc.startsWith('http') ? 'Remote/Linked Image' : carouselItem.imageSrc.split('/').pop() || 'Uploaded Image');
      } else {
        setImageFileName(null);
      }
      setImageFile(null);
    } else {
      form.reset({ 
        title: '',
        category: allCategories.length > 0 ? allCategories[0].name : '', 
        content: '',
        videoSrc: '',
        imageSrc: '',
        'data-ai-hint': '',
      });
      setVideoFileName(null);
      setVideoFile(null); 
      setImageFileName(null);
      setImageFile(null); 
    }
  }, [carouselItem, form, allCategories]);

  const handleVideoFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setVideoFile(file);
    setVideoFileName(file ? file.name : null);
    if (file) {
        form.setValue('videoSrc', ''); 
        form.clearErrors('videoSrc');
    } else if (form.getValues('videoSrc')) {
        setVideoFileName(form.getValues('videoSrc'));
    }
  };
  
  const handleImageFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImageFile(file);
    setImageFileName(file ? file.name : null);
    if (file) {
        form.setValue('imageSrc', ''); 
        form.clearErrors('imageSrc');
    } else if (form.getValues('imageSrc')) {
        setImageFileName(form.getValues('imageSrc'));
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
            toast({ title: 'File Uploaded', description: `${file.name} uploaded successfully to Sufy.` });
            return data.fileUrl;
         } else {
            console.error('Sufy Upload API Error: JSON response missing fileUrl or indicates error.', data);
            toast({ 
                title: 'Upload Failed', 
                description: data.error || `Upload succeeded but API returned an issue: ${JSON.stringify(data.details || data)}`, 
                variant: 'destructive' 
            });
            return null;
         }
      } else {
        const responseText = await res.text();
        console.error('Sufy Upload API Error: Non-OK or Non-JSON response. Status:', res.status, 'Response Text:', responseText);
        toast({ 
            title: 'Upload Failed', 
            description: `Server returned status ${res.status}. Response: ${responseText.substring(0, 200)}${responseText.length > 200 ? '...' : ''}`, 
            variant: 'destructive' 
        });
        return null;
      }
    } catch (error: any) {
      console.error('Sufy Upload Client-Side Fetch/JSON Parse Error:', error.message, error);
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
    
    let finalVideoSrc: string | null | undefined = undefined;
    let finalImageSrc: string | null | undefined = undefined;
    
    if (imageFile) {
      const uploadedImageUrl = await uploadFileToSufy(imageFile);
      if (uploadedImageUrl) {
        finalImageSrc = uploadedImageUrl;
      } else {
        return; // Stop submission on failed image upload
      }
    } else {
      finalImageSrc = values.imageSrc?.trim() || null;
    }

    if (videoFile) {
      const uploadedVideoUrl = await uploadFileToSufy(videoFile);
      if (uploadedVideoUrl) {
        finalVideoSrc = uploadedVideoUrl;
      } else {
        return; // Stop submission on failed video upload
      }
    } else {
      finalVideoSrc = values.videoSrc?.trim() || null;
    }
    
    const submissionData = {
      ...values,
      videoSrc: finalVideoSrc,
      imageSrc: finalImageSrc,
    };

    startTransition(async () => {
      const actionFormData = new FormData();
      Object.entries(submissionData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          actionFormData.append(key, String(value));
        } else if ((key === 'videoSrc' || key === 'imageSrc') && (value === null || value === '')) {
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
          
          <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            {/* Image Upload Area */}
            <div className="space-y-4 p-4 border rounded-lg">
                <FormLabel className="flex items-center gap-2 text-lg font-semibold"><ImageIcon className="h-5 w-5"/> Image Media</FormLabel>
                <FormItem>
                    <FormLabel>Upload Image File</FormLabel>
                     <FormControl>
                        <label 
                            htmlFor="imageFile-input" 
                            className={cn(
                            buttonVariants({ variant: "outline" }), 
                            "cursor-pointer flex items-center justify-center gap-2 w-full",
                            isSubmitting && "cursor-not-allowed opacity-50"
                            )}
                        >
                            <UploadCloud className="h-4 w-4" />
                            <span className="truncate">{imageFile ? imageFile.name : (imageFileName || "Choose Image File")}</span>
                        </label>
                        <Input id="imageFile-input" type="file" accept="image/*" className="sr-only" onChange={handleImageFileChange} disabled={isSubmitting} />
                    </FormControl>
                     <FormMessage>{form.formState.errors.imageSrc?.message && !imageFile ? form.formState.errors.imageSrc.message : ''}</FormMessage> 
                </FormItem>
                <div className="text-center text-muted-foreground font-semibold text-sm">OR</div>
                 <FormField
                    control={form.control}
                    name="imageSrc"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Image Source URL</FormLabel>
                            <FormControl>
                                <Input placeholder="https://..." {...field} value={field.value ?? ''} disabled={isSubmitting || !!imageFile} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
            
            {/* Video Upload Area */}
            <div className="space-y-4 p-4 border rounded-lg">
                 <FormLabel className="flex items-center gap-2 text-lg font-semibold"><Video className="h-5 w-5"/> Video Media (Optional)</FormLabel>
                 <FormItem>
                    <FormLabel>Upload Video File</FormLabel>
                     <FormControl>
                        <label 
                            htmlFor="videoFile-input" 
                            className={cn(
                            buttonVariants({ variant: "outline" }), 
                            "cursor-pointer flex items-center justify-center gap-2 w-full",
                            isSubmitting && "cursor-not-allowed opacity-50"
                            )}
                        >
                            <UploadCloud className="h-4 w-4" />
                            <span className="truncate">{videoFile ? videoFile.name : (videoFileName || "Choose Video File")}</span>
                        </label>
                        <Input id="videoFile-input" type="file" accept="video/*" className="sr-only" onChange={handleVideoFileChange} disabled={isSubmitting} />
                    </FormControl>
                    <FormDescription>Video will override the image if both are provided.</FormDescription>
                     <FormMessage>{form.formState.errors.videoSrc?.message && !videoFile ? form.formState.errors.videoSrc.message : ''}</FormMessage> 
                </FormItem>
                <div className="text-center text-muted-foreground font-semibold text-sm">OR</div>
                <FormField
                    control={form.control}
                    name="videoSrc"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Video Source URL</FormLabel>
                            <FormControl>
                                <Input placeholder="https://..." {...field} value={field.value ?? ''} disabled={isSubmitting || !!videoFile} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
          </div>

          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
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
              <FormItem className="md:col-span-2">
                <FormLabel>AI Hint (for Image)</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="e.g., luxury watch" 
                    {...field}
                    value={field.value ?? ''}
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormDescription>
                  Keywords for AI to find a replacement image if the URL is broken (max 2 words).
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
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
