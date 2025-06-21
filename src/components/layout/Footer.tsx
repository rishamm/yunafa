
export function Footer() {
  return (
    <footer className="bg-card border-t mt-auto overflow-hidden">
      <div className="h-full flex flex-col gap-0 justify-center pt-8 pb-0">
        {/* This div will align its content (the p tag) to the left */}
        <div className="text-left px-4"> 
          <p className="mb-0 text-sm text-muted-foreground">&copy; {new Date().getFullYear()} Yunafa. All rights reserved.</p>
        </div>
        <div className="text-center h-full"> {/* This div will center the large YUNAFA text */}
          <span className="font-['Cormorant_SC',_serif] uppercase text-primary tracking-[-0.02em] leading-[0.7em] whitespace-nowrap text-[24vw]">YUNAFA</span>
        </div>
      </div>
    </footer>
  );
}
