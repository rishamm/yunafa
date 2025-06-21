
export function Footer() {
  return (
    <footer className="bg-muted/50 border-t mt-auto overflow-hidden">
      <div className="container mx-auto h-full px-4 flex flex-col gap-[6rem] justify-center  pt-2 pb-1 text-sm text-muted-foreground">
        {/* This div will align its content (the p tag) to the left */}
        <div className="text-left"> 
          <p className="mb-2">&copy; {new Date().getFullYear()} Yunafa. All rights reserved.</p>
        </div>
        <div className="text-center h-full"> {/* This div will center the large YUNAFA text */}
          <span className="font-['Cormorant_SC',_serif] uppercase text-white text-7xl tracking-[-0.02em] leading-[0.7em] md:text-[282.96px]">YUNAFA</span>
        </div>
      </div>
    </footer>
  );
}
