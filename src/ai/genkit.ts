import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

export const ai = genkit({
  plugins: [googleAI()], // googleAI will use GOOGLE_API_KEY env var or Application Default Credentials
  model: 'googleai/gemini-2.0-flash',
});
