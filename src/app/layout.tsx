
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { SmoothScrollProvider } from '@/components/common/SmoothScrollProvider';
import { Inter, Montserrat } from 'next/font/google';

const brandFont = Montserrat({
  subsets: ['latin'],
  weight: ['900'], // or your specific weight
  display: 'swap', // This ensures text is visible during font download
  variable: '--font-brand',
});
export const metadata: Metadata = {
  title: 'Yunafa - Luxurious Finds',
  description: 'Discover unique and luxurious products at Yunafa.',
  icons: '/logo.ico',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // FIX 1: Added h-full to html
    <html lang="en" className="h-full">
      <head>
        <link href="https://fonts.cdnfonts.com/css/batusa" rel="stylesheet" />
        {/* ... other links ... */}
      </head>
      {/* FIX 2: Replaced min-h-screen with h-full and removed flex-col which causes Safari layout bugs */}
      <body className="font-body antialiased h-full m-0 p-0">
        <SmoothScrollProvider>
          {/* FIX 3: Ensure children can expand */}
          <main className="relative h-full w-full">
            {children}
          </main>
        </SmoothScrollProvider>
        <Toaster />
      </body>
    </html>
  );
}