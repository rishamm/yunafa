
export function AnnouncementBar() {
  const message = "Welcome to Yunafa. View our new collections!";
  
  const MarqueeContent = () => (
      <>
        <span className="mx-8">{message}</span>
        <span className="mx-8">{message}</span>
        <span className="mx-8">{message}</span>
        <span className="mx-8">{message}</span>
        <span className="mx-8">{message}</span>
        <span className="mx-8">{message}</span>
      </>
  );

  return (
    <div className="bg-card text-announcement flex h-auto w-full overflow-x-hidden whitespace-nowrap py-3 text-sm font-semibold">
      
      {/* Both divs are now flex children, so they appear side-by-side */}
      <div className="animate-marquee flex flex-shrink-0 items-center">
          <MarqueeContent />
      </div>
      <div className="animate-marquee flex flex-shrink-0 items-center" aria-hidden="true">
          <MarqueeContent />
      </div>

    </div>
  );
}
