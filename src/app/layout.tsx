import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: 'Yunafa - Luxurious Finds',
  description: 'Discover unique and luxurious products at Yunafa.',
  // Removed explicit icons entry.
  // Next.js will automatically use an icon file (e.g., favicon.ico, icon.png)
  // if it's placed in the src/app/ directory.
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Next.js will inject metadata links here. */}
        <link href="https://fonts.cdnfonts.com/css/batusa" rel="stylesheet" />
      </head>
      <body className="font-body antialiased flex flex-col min-h-screen">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
