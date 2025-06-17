
import Link from 'next/link';

export function AnnouncementBar() {
  return (
    <div className="bg-card text-foreground py-2 px-4 text-center text-sm font-medium overflow-hidden">
      <div className="inline-flex whitespace-nowrap animate-marquee-left">
        <p className="mx-10 md:mx-20 text-md flex-shrink-0">
          Special Announcement: Yunafa&apos;s New Collection Just Dropped!{" "}
          <Link href="/#home-carousel" className="font-semibold underline text-primary hover:text-primary/80 transition-colors">
            Explore Now
          </Link>
        </p>
        <p className="mx-10 md:mx-20 text-md flex-shrink-0">
          Special Announcement: Yunafa&apos;s New Collection Just Dropped!{" "}
          <Link href="/#home-carousel" className="font-semibold underline text-primary hover:text-primary/80 transition-colors">
            Explore Now
          </Link>
        </p>
        <p className="mx-10 md:mx-20 text-md flex-shrink-0">
          Special Announcement: Yunafa&apos;s New Collection Just Dropped!{" "}
          <Link href="/#home-carousel" className="font-semibold underline text-primary hover:text-primary/80 transition-colors">
            Explore Now
          </Link>
        </p>
        <p className="mx-10 md:mx-20 text-md flex-shrink-0">
          Special Announcement: Yunafa&apos;s New Collection Just Dropped!{" "}
          <Link href="/#home-carousel" className="font-semibold underline text-primary hover:text-primary/80 transition-colors">
            Explore Now
          </Link>
        </p>
      </div>
    </div>
  );
}

