import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="flex-grow py-8 px-4">
        {children}
      </main>
      <Footer />
    </>
  );
}
