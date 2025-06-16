
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
import { Loader2, UploadCloud } from 'lucide-react';
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
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoFileName, setVideoFileName] = useState<string | null>(null);
  
  const form = useForm<CarouselItemFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: carouselItem?.title || '',
      category: carouselItem?.category || (allCategories.length > 0 ? allCategories[0].name : ''),
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
      if (carouselItem.videoSrc) {
        setVideoFileName(carouselItem.videoSrc.startsWith('http') || carouselItem.videoSrc.startsWith('/') ? 'Remote/Linked Video' : carouselItem.videoSrc.split('/').pop() || 'Uploaded Video');
      } else {
        setVideoFileName(null);
      }
      setVideoFile(null); 
    } else {
      form.reset({ 
        title: '',
        category: allCategories.length > 0 ? allCategories[0].name : '', 
        content: '',
        videoSrc: '',
      });
      setVideoFileName(null);
      setVideoFile(null); 
    }
  }, [carouselItem, form, allCategories]);


  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setVideoFile(file);
    setVideoFileName(file ? file.name : null);
    if (file) {
        form.setValue('videoSrc', ''); 
        form.clearErrors('videoSrc');
    } else if (form.getValues('videoSrc')) { // If file is removed, re-evaluate videoSrc
        setVideoFileName(form.getValues('videoSrc'));
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
            // JSON response but missing fileUrl or other error structure
            console.error('Sufy Upload API Error: JSON response missing fileUrl or indicates error.', data);
            toast({ 
                title: 'Upload Failed', 
                description: data.error || `Upload succeeded but API returned an issue: ${JSON.stringify(data.details || data)}`, 
                variant: 'destructive' 
            });
            return null;
         }
      } else {
        // Handle non-OK or non-JSON responses
        const responseText = await res.text(); // Get raw response text
        console.error('Sufy Upload API Error: Non-OK or Non-JSON response. Status:', res.status, 'Response Text:', responseText);
        toast({ 
            title: 'Upload Failed', 
            description: `Server returned status ${res.status}. Response: ${responseText.substring(0, 200)}${responseText.length > 200 ? '...' : ''}`, 
            variant: 'destructive' 
        });
        return null;
      }
    } catch (error: any) {
      // This catch block handles network errors or errors from res.json() / res.text()
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
    let finalVideoSrc: string | null | undefined = undefined;

    if (videoFile) {
      const uploadedVideoUrl = await uploadFileToSufy(videoFile);
      if (uploadedVideoUrl) {
        finalVideoSrc = uploadedVideoUrl;
      } else {
        return; // Upload failed, stop submission
      }
    } else if (values.videoSrc && values.videoSrc.trim() !== '') {
      finalVideoSrc = values.videoSrc.trim();
    } else {
      finalVideoSrc = null; // No file and no URL, so no video source
    }
    
    const submissionData = {
      ...values,
      videoSrc: finalVideoSrc,
    };

    startTransition(async () => {
      const actionFormData = new FormData();
      Object.entries(submissionData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          actionFormData.append(key, String(value));
        } else if (key === 'videoSrc' && (value === null || value === '')) {
           // Ensure empty string is sent if videoSrc is explicitly cleared/null
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
              <FormItem className="md:col-span-1">
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
              <FormItem className="md:col-span-1">
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
          
          <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-[minmax(0,max-content)_auto_minmax(0,2fr)] items-start gap-x-6 gap-y-4 md:gap-y-0">
            <FormItem className='flex flex-col'>
              <FormLabel>Video File (Optional)</FormLabel>
              <FormControl>
                <div className="inline-block">
                  <label 
                    htmlFor="videoFile-input" 
                    className={cn(
                      buttonVariants({ variant: "outline" }), 
                      "cursor-pointer flex items-center justify-center gap-2",
                      isSubmitting && "cursor-not-allowed opacity-50"
                    )}
                  >
                    <UploadCloud className="h-4 w-4" />
                    <span>{videoFile ? videoFile.name : (videoFileName || "Choose Video File")}</span>
                  </label>
                  <Input
                    id="videoFile-input"
                    type="file"
                    accept="video/*"
                    className="sr-only"
                    onChange={handleFileChange}
                    disabled={isSubmitting}
                  />
                </div>
              </FormControl>
              <FormDescription className="mt-2">
                Upload a new video. Overrides URL if selected.
              </FormDescription>
               <FormMessage>{form.formState.errors.videoSrc?.message && !videoFile ? form.formState.errors.videoSrc.message : ''}</FormMessage> 
            </FormItem>

            <div className="text-center text-muted-foreground font-semibold self-center py-4 md:py-0 md:mt-8 ">
              OR
            </div>
            
            <FormField
              control={form.control}
              name="videoSrc"
              render={({ field }) => (
                <FormItem className='flex flex-col'>
                  <FormLabel>Video Source URL (Optional)</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g., /videos/my-video.mp4 or https://example.com/video.mp4" 
                      {...field} 
                      value={field.value ?? ''} 
                      disabled={isSubmitting || !!videoFile} 
                      onChange={(e) => {
                        field.onChange(e); 
                        if (e.target.value && !videoFile) { 
                            setVideoFileName(e.target.value.startsWith('http') || e.target.value.startsWith('/') ? "Remote/Linked Video" : e.target.value.split('/').pop() || "Video from URL");
                        } else if (!e.target.value && !videoFile) {
                            setVideoFileName(null);
                        }
                      }}
                      className='w-full md:w-[30rem]'
                    />
                  </FormControl>
                  <FormDescription className="mt-2">
                    Enter a URL if not uploading a file.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
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

