
export function Footer() {
  return (
    <footer className="bg-muted/50 border-t mt-auto overflow-hidden">
      <div className="container mx-auto px-4 pt-8 text-center text-sm text-muted-foreground">
        <p className="mb-2">&copy; {new Date().getFullYear()} Yunafa. All rights reserved.</p>
        <div>
          <span className="text-[15.5rem] font-bold font-headline text-white leading-none">YUNAFA</span>
        </div>
      </div>
    </footer>
  );
}

