import Link from 'next/link';
import { Logo } from '@/components/icons/Logo';
import { Menu, X } from 'lucide-react';
import HeaderWrapper from '@/components/HeaderWrapper';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { getCategories } from '@/lib/data';

export async function Header() {
  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/#home-carousel', label: 'Collections' },
    { href: '/our-story', label: 'Our Story' },
    { href: '/lookbook', label: 'Lookbook' },
    { href: '/contact', label: 'Contact' }
  ];

  return (
    <HeaderWrapper>
      <header className="w-full bg-[#0000000a] backdrop-blur-[3px] border-b border-[#ffffff1a]">
        <div className="container mx-auto px-4 py-2 flex flex-col items-center">

          {/* Top Row: Logo & Mobile Menu */}
          <div className="w-full relative flex items-center justify-center mb-1">

            {/* Logo - Stays Centered */}
            <Link href="/" className="inline-block transition-opacity duration-300 hover:opacity-70">
              <Logo height={24} />
            </Link>

            {/* Mobile Menu Trigger - Positioned right but stays in the same line height */}
            <div className="md:hidden absolute right-0">
              <Sheet>
                <SheetTrigger className="p-2">
                  <Menu width={24} />
                </SheetTrigger>
                <SheetContent side="right" className="w-full bg-white">
                  <SheetHeader className="sr-only">
                    <SheetTitle>Navigation Menu</SheetTitle>
                  </SheetHeader>

                  <nav className="flex flex-col p-10 gap-8 mt-12">
                    {navLinks.map((link) => (
                      <SheetClose asChild key={link.href}>
                        <Link href={link.href} className="text-3xl font-light tracking-tighter text-black">
                          {link.label}
                        </Link>
                      </SheetClose>
                    ))}
                  </nav>
                </SheetContent>
              </Sheet>
            </div>
          </div>

          {/* Bottom Row: Desktop Navigation (Centered) */}
          <nav className="hidden md:flex items-center justify-center space-x-12">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="group relative py-0 text-[14px] font-medium tracking-[0.25em] text-black uppercase transition-colors duration-300 hover:text-[#2a3531]"
              >
                {link.label}
                <span className="absolute inset-x-0 -bottom-1 h-[1px] bg-black scale-x-0 transition-transform duration-500 ease-out group-hover:scale-x-100" />
              </Link>
            ))}
          </nav>

        </div>
      </header>
    </HeaderWrapper>
  );
}