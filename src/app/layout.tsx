import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: 'Yunafa - Luxurious Finds',
  description: 'Discover unique and luxurious products at Yunafa.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.cdnfonts.com/css/batusa" rel="stylesheet" />
      </head>
      <body className="font-body antialiased flex flex-col min-h-screen">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
