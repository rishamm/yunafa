
export function Footer() {
  return (
    <footer className="bg-card border-t mt-auto overflow-hidden">
      <div className="px-4 h-full flex flex-col gap-0 justify-center py-8">
        {/* This div will align its content (the p tag) to the left */}
        <div className="text-left"> 
          <p className="mb-0 text-sm text-muted-foreground">&copy; {new Date().getFullYear()} Yunafa. All rights reserved.</p>
        </div>
        <div className="text-center h-full"> {/* This div will center the large YUNAFA text */}
          <span className="font-['Cormorant_SC',_serif] uppercase text-primary tracking-[-0.02em] leading-[0.7em] text-7xl md:text-[282.96px]">&nbsp;YUNAFA&nbsp;</span>
        </div>
      </div>
    </footer>
  );
}
