
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { AnnouncementBar } from '@/components/layout/AnnouncementBar';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='relative'>
      <AnnouncementBar />
      <Header />
      <main className="flex-grow ">
        {children}
      </main>
      <Footer />
    </div>
  );
}
