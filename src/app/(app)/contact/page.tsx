import { ContactForm } from '@/components/forms/ContactForm';
import { Suspense } from 'react';

export const metadata = {
  title: 'Contact Us - Yunafa',
  description: 'Submit an inquiry or get in touch with Yunafa.',
};

// Wrapper component to allow ContactForm to use useSearchParams
function ContactFormWrapper() {
  return <ContactForm />;
}


export default function ContactPage() {
  return (
    <div className="py-8">
      <h1 className="text-4xl font-bold text-center mb-4 font-headline">Contact Us</h1>
      <p className="text-lg text-muted-foreground text-center mb-10">
        Have a question about a product or need assistance? Fill out the form below.
      </p>
      <Suspense fallback={<div>Loading form...</div>}>
        <ContactFormWrapper />
      </Suspense>
    </div>
  );
}
