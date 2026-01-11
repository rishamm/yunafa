
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { FullScreenVideo } from '@/components/sections/FullScreenVideo';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='relative'>

      <div className="absolute top-0 left-0 w-full ">
        {/* <Header /> */}
      </div>
      <main className="flex-grow relative z-10">
        {children}
      </main>

    </div>
  );
}
