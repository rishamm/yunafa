
export function Footer() {
  return (
    <footer className="bg-muted/50  border-t mt-auto overflow-hidden">
      <div className="container mx-auto h-full px-4 flex flex-col gap-2 justify-center py-8 text-sm text-muted-foreground">
        {/* This div will align its content (the p tag) to the left */}
        <div className="text-left"> 
          <p className="mb-2">&copy; {new Date().getFullYear()} Yunafa. All rights reserved.</p>
        </div>
        <div className="text-center h-full"> {/* This div will center the large YUNAFA text */}
          <span className="text-7xl md:text-[15.5rem] font-bold text-white leading-[0]">YUNAFA</span>
        </div>
      </div>
    </footer>
  );
}
