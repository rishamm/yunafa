
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
      <FullScreenVideo 
        videoSrc="/land_scape.mp4" 
        posterSrc="https://images.unsplash.com/photo-1422493757033-1e0821297b43?w=1920&h=1080&fit=crop" 
        videoHint="abstract landscape" 
      />
      <div className="absolute top-0 left-0 w-full ">
        <Header />
      </div>
      <main className="flex-grow relative z-10">
        {children}
      </main>
      <Footer />
    </div>
  );
}
