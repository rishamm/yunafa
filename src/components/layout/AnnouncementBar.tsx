
export function AnnouncementBar() {
  const message = "Welcome to Yunafa. View our new collections!";
  
  // This component will render the message multiple times to ensure it's wide enough for a smooth marquee on all screens.
  const Content = () => (
    <span className="pr-16">{message}</span>
  );

  return (
    <div className="bg-card text-announcement relative h-auto overflow-x-hidden whitespace-nowrap py-3 text-sm font-semibold">
      <div className="animate-marquee">
        <Content />
        <Content />
        <Content />
        <Content />
        <Content />
      </div>

      <div className="animate-marquee2 absolute top-0 py-3">
        <Content />
        <Content />
        <Content />
        <Content />
        <Content />
      </div>
    </div>
  );
}
