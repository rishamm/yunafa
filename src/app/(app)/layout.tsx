
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='relative'>
      <div className="absolute top-0 left-0 w-full z-50">
        <Header />
      </div>
      <main className="flex-grow ">
        {children}
      </main>
      <Footer />
    </div>
  );
}
