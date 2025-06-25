
export function AnnouncementBar() {
  const message = "Welcome to Yunafa. View our new collections!";
  const MarqueeContent = () => (
    <>
      <span className="mx-8">{message}</span>
      <span className="mx-8">{message}</span>
      <span className="mx-8">{message}</span>
      <span className="mx-8">{message}</span>
    </>
  );

  return (
    <div className="bg-card text-announcement relative flex overflow-hidden whitespace-nowrap py-3 text-sm font-medium">
      <div className="animate-marquee-left flex min-w-full shrink-0 items-center">
        <MarqueeContent />
      </div>
      <div aria-hidden="true" className="animate-marquee-left flex min-w-full shrink-0 items-center">
        <MarqueeContent />
      </div>
    </div>
  );
}
