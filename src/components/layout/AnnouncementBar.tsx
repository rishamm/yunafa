
import Link from 'next/link';

export function AnnouncementBar() {
  return (
    <div className="bg-primary text-primary-foreground py-2 px-4 text-center text-sm font-medium overflow-hidden">
      <div className="inline-flex whitespace-nowrap animate-marquee-left">
        <p className="mx-4 flex-shrink-0">
          Special Announcement: Yunafa&apos;s New Collection Just Dropped!{" "}
          <Link href="/#home-carousel" className="font-semibold underline hover:text-primary-foreground/80 transition-colors">
            Explore Now
          </Link>
        </p>
        <p className="mx-4 flex-shrink-0">
          Special Announcement: Yunafa&apos;s New Collection Just Dropped!{" "}
          <Link href="/#home-carousel" className="font-semibold underline hover:text-primary-foreground/80 transition-colors">
            Explore Now
          </Link>
        </p>
      </div>
    </div>
  );
}

