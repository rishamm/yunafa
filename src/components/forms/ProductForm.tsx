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
import type { Product, Category } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { createProductAction, updateProductAction } from '@/lib/actions';
import { suggestProductTags } from '@/ai/flows/suggest-product-tags';
import { useState, useTransition } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from "@/components/ui/checkbox";

const formSchema = z.object({
  name: z.string().min(3, 'Product name must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.coerce.number().positive('Price must be a positive number'),
  imageUrl: z.string().url('Must be a valid URL').or(z.string().startsWith('https://placehold.co')),
  categoryIds: z.array(z.string()).min(1, 'At least one category is required'),
  tags: z.string().optional(), // Comma-separated string
});

type ProductFormValues = z.infer<typeof formSchema>;

interface ProductFormProps {
  product?: Product;
  allCategories: Category[];
}

export function ProductForm({ product, allCategories }: ProductFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [suggestedTags, setSuggestedTags] = useState<string[]>([]);
  const [suggestedCategories, setSuggestedCategories] = useState<string[]>([]);


  const form = useForm<ProductFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: product?.name || '',
      description: product?.description || '',
      price: product?.price || 0,
      imageUrl: product?.imageUrl || 'https://placehold.co/600x400.png',
      categoryIds: product?.categoryIds || [],
      tags: product?.tags?.join(', ') || '',
    },
  });

  const handleSuggestTags = async () => {
    const productName = form.getValues('name');
    const productDescription = form.getValues('description');

    if (!productName || !productDescription) {
      toast({
        title: 'Missing Information',
        description: 'Please enter product name and description to get suggestions.',
        variant: 'destructive',
      });
      return;
    }

    setIsAiLoading(true);
    try {
      const result = await suggestProductTags({ productName, productDescription });
      setSuggestedTags(result.suggestedTags);
      
      // Match suggested categories with existing ones by name (case-insensitive)
      const matchedCategoryIds = result.suggestedCategories
        .map(sc => {
          const found = allCategories.find(ac => ac.name.toLowerCase() === sc.toLowerCase());
          return found ? found.id : null;
        })
        .filter(id => id !== null) as string[];
      setSuggestedCategories(matchedCategoryIds);

      toast({
        title: 'Suggestions Ready!',
        description: 'AI has generated tags and category suggestions.',
      });
    } catch (error) {
      console.error('AI suggestion error:', error);
      toast({
        title: 'AI Error',
        description: 'Could not fetch suggestions. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsAiLoading(false);
    }
  };

  const addSuggestionToForm = (type: 'tag' | 'category', value: string) => {
    if (type === 'tag') {
      const currentTags = form.getValues('tags') || '';
      const tagsArray = currentTags.split(',').map(t => t.trim()).filter(t => t);
      if (!tagsArray.includes(value)) {
        form.setValue('tags', [...tagsArray, value].join(', '));
      }
    } else if (type === 'category') {
        const currentCategoryIds = form.getValues('categoryIds') || [];
        if(!currentCategoryIds.includes(value)){
             form.setValue('categoryIds', [...currentCategoryIds, value]);
        }
    }
  };


  async function onSubmit(values: ProductFormValues) {
    startTransition(async () => {
      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        if (key === 'categoryIds' && Array.isArray(value)) {
          value.forEach(catId => formData.append('categoryIds[]', catId));
        } else if (value !== undefined && value !== null) {
          formData.append(key, String(value));
        }
      });
      
      const action = product ? updateProductAction(product.id, formData) : createProductAction(formData);
      const result = await action;

      if (result.success) {
        toast({
          title: product ? 'Product Updated' : 'Product Created',
          description: result.message,
        });
        router.push('/admin/products');
        router.refresh(); // To ensure fresh data is loaded on the product list page
      } else {
        toast({
          title: 'Error',
          description: result.error || 'An unknown error occurred.',
          variant: 'destructive',
        });
        if (result.errors) {
          Object.entries(result.errors).forEach(([field, messages]) => {
            form.setError(field as keyof ProductFormValues, {
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Luxury Silk Scarf" {...field} />
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
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Detailed product description..." {...field} rows={6} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <Button type="button" onClick={handleSuggestTags} disabled={isAiLoading} variant="outline">
              {isAiLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="mr-2 h-4 w-4" />
              )}
              Suggest Tags & Categories with AI
            </Button>

            { (suggestedTags.length > 0 || suggestedCategories.length > 0) && (
              <div className="space-y-4 p-4 border rounded-md bg-muted/50">
                {suggestedTags.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium mb-2">Suggested Tags:</h4>
                    <div className="flex flex-wrap gap-2">
                      {suggestedTags.map(tag => (
                        <Badge key={tag} variant="secondary" className="cursor-pointer hover:bg-primary/20" onClick={() => addSuggestionToForm('tag', tag)}>
                          {tag} <span className="ml-1 text-xs">(click to add)</span>
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                {suggestedCategories.length > 0 && (
                <div>
                    <h4 className="text-sm font-medium mb-2">Suggested Categories (match existing):</h4>
                    <div className="flex flex-wrap gap-2">
                    {allCategories.filter(ac => suggestedCategories.includes(ac.id)).map(category => (
                        <Badge key={category.id} variant="secondary" className="cursor-pointer hover:bg-primary/20" onClick={() => addSuggestionToForm('category', category.id)}>
                        {category.name} <span className="ml-1 text-xs">(click to add)</span>
                        </Badge>
                    ))}
                    </div>
                </div>
                )}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" placeholder="0.00" {...field} />
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
                  <FormLabel>Image URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://placehold.co/600x400.png" {...field} />
                  </FormControl>
                   <FormDescription>Use placeholder e.g., https://placehold.co/600x400.png</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
                control={form.control}
                name="categoryIds"
                render={() => (
                <FormItem>
                    <div className="mb-4">
                    <FormLabel className="text-base">Categories</FormLabel>
                    <FormDescription>
                        Select one or more categories for this product.
                    </FormDescription>
                    </div>
                    {allCategories.map((category) => (
                    <FormField
                        key={category.id}
                        control={form.control}
                        name="categoryIds"
                        render={({ field }) => {
                        return (
                            <FormItem
                            key={category.id}
                            className="flex flex-row items-start space-x-3 space-y-0 mb-2"
                            >
                            <FormControl>
                                <Checkbox
                                checked={field.value?.includes(category.id)}
                                onCheckedChange={(checked) => {
                                    return checked
                                    ? field.onChange([...(field.value || []), category.id])
                                    : field.onChange(
                                        (field.value || []).filter(
                                        (value) => value !== category.id
                                        )
                                    )
                                }}
                                />
                            </FormControl>
                            <FormLabel className="font-normal">
                                {category.name}
                            </FormLabel>
                            </FormItem>
                        )
                        }}
                    />
                    ))}
                    <FormMessage />
                </FormItem>
                )}
            />
            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., luxury, handmade, gift" {...field} />
                  </FormControl>
                  <FormDescription>Comma-separated values.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" disabled={isPending} className="bg-primary hover:bg-primary/90 text-primary-foreground">
            {isPending ? (product ? 'Saving...' : 'Creating...') : (product ? 'Save Changes' : 'Create Product')}
          </Button>
        </div>
      </form>
    </Form>
  );
}
