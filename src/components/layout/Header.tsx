
import Link from 'next/link';
import { Logo } from '@/components/icons/Logo';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getCategories } from '@/lib/data';
import type { Category } from '@/lib/types';

export async function Header() {
  const categories: Category[] = await getCategories();

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/#home-carousel', label: 'Collections' }, // Changed from Blogs to Collections
    { href: '/our-story', label: 'Our Story' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <header className="w-full py-12">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <Link href="/" aria-label="Yunafa Home" className="text-primary-foreground">
          <Logo height={21} />
        </Link>
        <nav className="hidden md:flex items-center space-x-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-primary-foreground hover:opacity-80 transition-colors duration-200 ease-in-out"
            >
              {link.label}
            </Link>
          ))}
         
        </nav>
      
      </div>
    </header>
  );
}
