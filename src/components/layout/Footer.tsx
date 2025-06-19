
export function Footer() {
  return (
    <footer className="bg-muted/50 border-t mt-auto">
      <div className="container mx-auto px-4 py-8 text-center text-sm text-muted-foreground">
        <div className="mb-2">
          <span className="text-lg font-bold font-headline text-foreground">YUNAFA</span>
        </div>
        <p>&copy; {new Date().getFullYear()} Yunafa. All rights reserved.</p>
      </div>
    </footer>
  );
}
