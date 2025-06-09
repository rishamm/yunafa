import { Logo } from '@/components/icons/Logo';

export function Footer() {
  return (
    <footer className="bg-muted/50 border-t mt-auto">
      <div className="container mx-auto px-4 py-8 text-center text-sm text-muted-foreground">
        <div className="flex justify-center mb-4">
          <Logo className="h-6" />
        </div>
        <p>&copy; {new Date().getFullYear()} Yunafa. All rights reserved.</p>
        <p className="mt-1">Discover unique and luxurious products.</p>
      </div>
    </footer>
  );
}
