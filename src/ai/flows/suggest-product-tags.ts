// This file is machine-generated - edit at your own risk.

'use server';

/**
 * @fileOverview AI-powered product tag and category suggestion flow.
 *
 * - suggestProductTags - A function that suggests relevant tags and categories for a product.
 * - SuggestProductTagsInput - The input type for the suggestProductTags function.
 * - SuggestProductTagsOutput - The return type for the suggestProductTags function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestProductTagsInputSchema = z.object({
  productName: z.string().describe('The name of the product.'),
  productDescription: z.string().describe('A detailed description of the product.'),
});
export type SuggestProductTagsInput = z.infer<typeof SuggestProductTagsInputSchema>;

const SuggestProductTagsOutputSchema = z.object({
  suggestedTags: z.array(z.string()).describe('An array of suggested tags for the product.'),
  suggestedCategories: z
    .array(z.string())
    .describe('An array of suggested categories for the product.'),
});
export type SuggestProductTagsOutput = z.infer<typeof SuggestProductTagsOutputSchema>;

export async function suggestProductTags(input: SuggestProductTagsInput): Promise<SuggestProductTagsOutput> {
  return suggestProductTagsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestProductTagsPrompt',
  input: {schema: SuggestProductTagsInputSchema},
  output: {schema: SuggestProductTagsOutputSchema},
  prompt: `You are an expert in product categorization and tagging.

  Based on the product name and description provided, suggest relevant tags and categories to help users easily find the product.

  Product Name: {{{productName}}}
  Product Description: {{{productDescription}}}

  Your suggestions should be tailored to improve product discoverability and should reflect common search terms that customers might use.

  Return the suggested tags and categories in array format.
  `,
});

const suggestProductTagsFlow = ai.defineFlow(
  {
    name: 'suggestProductTagsFlow',
    inputSchema: SuggestProductTagsInputSchema,
    outputSchema: SuggestProductTagsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
