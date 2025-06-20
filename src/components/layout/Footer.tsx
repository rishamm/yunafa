
export function Footer() {
  return (
    <footer className="bg-muted/50 border-t mt-auto overflow-hidden">
      <div className="container mx-auto px-4 pt-8 text-sm text-muted-foreground">
        {/* Removed text-center from this parent div */}
        <div className="text-right"> {/* This div will align its content (the p tag) to the right */}
          <p className="mb-2">&copy; {new Date().getFullYear()} Yunafa. All rights reserved.</p>
        </div>
        <div className="text-center"> {/* This div will center the large YUNAFA text */}
          <span className="text-7xl md:text-[15.5rem] font-bold font-headline text-white leading-none">YUNAFA</span>
        </div>
      </div>
    </footer>
  );
}

