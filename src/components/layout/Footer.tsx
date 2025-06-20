
export function Footer() {
  return (
    <footer className="bg-muted/50 border-t mt-auto overflow-hidden">
      <div className="container mx-auto px-4 pt-8 text-sm text-muted-foreground">
        {/* This div will align its content (the p tag) to the left */}
        <div className="text-left"> 
          <p className="mb-2">&copy; {new Date().getFullYear()} Yunafa. All rights reserved.</p>
        </div>
        <div className="text-center"> {/* This div will center the large YUNAFA text */}
          <span className="text-7xl md:text-[15.5rem] font-bold font-headline text-white">YUNAFA</span>
        </div>
      </div>
    </footer>
  );
}

