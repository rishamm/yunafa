import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

export const ai = genkit({
  plugins: [googleAI({apiKey: process.env.SUFY_ACCESS_KEY})],
  model: 'googleai/gemini-2.0-flash',
});
