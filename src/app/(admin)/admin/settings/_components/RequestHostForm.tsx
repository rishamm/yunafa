
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
import { useToast } from '@/hooks/use-toast';
import { requestNewHostnameAction } from '@/lib/actions';
import { useTransition } from 'react';
import { Loader2 } from 'lucide-react';

const formSchema = z.object({
  hostname: z.string().min(3, 'Hostname must be at least 3 characters (e.g., example.com).').refine(val => !val.startsWith('http'), {
    message: 'Hostname should not include http:// or https:// (e.g., use example.com, not https://example.com)',
  }),
});

type RequestHostFormValues = z.infer<typeof formSchema>;

export function RequestHostForm() {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const form = useForm<RequestHostFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      hostname: '',
    },
  });

  async function onSubmit(values: RequestHostFormValues) {
    startTransition(async () => {
      const result = await requestNewHostnameAction(values.hostname);
      if (result.success) {
        toast({
          title: 'Hostname Request Submitted',
          description: result.message,
        });
        form.reset();
      } else {
        toast({
          title: 'Error',
          description: result.error || 'Failed to submit request.',
          variant: 'destructive',
        });
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-md">
        <FormField
          control={form.control}
          name="hostname"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Hostname</FormLabel>
              <FormControl>
                <Input placeholder="e.g., new-images.example.com" {...field} />
              </FormControl>
              <FormDescription>
                Enter the hostname you want to allow (e.g., `images.example.com`). Do not include `http://` or `https://`.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isPending} className="bg-primary hover:bg-primary/90 text-primary-foreground">
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Submit Request
        </Button>
      </form>
    </Form>
  );
}
