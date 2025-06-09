
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { Logo } from '@/components/icons/Logo';
import {
  LayoutDashboard,
  Package,
  Tags,
  Settings, // Changed from Users to Settings general icon
  LogOut,
  Home,
  ImageIcon,
  ShieldCheck // Added for Site Settings / Trusted Hosts
} from 'lucide-react';

const navItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/categories', label: 'Categories', icon: Tags },
  { href: '/admin/carousel', label: 'Carousel', icon: ImageIcon },
  { href: '/admin/settings', label: 'Site Settings', icon: ShieldCheck }, // New Site Settings Link
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon" side="left" variant="sidebar" className="border-r">
      <SidebarHeader className="flex items-center justify-between p-4">
        <Link href="/admin/dashboard" className="flex items-center gap-2 group-data-[collapsible=icon]:hidden">
          <Logo height={24} />
        </Link>
      </SidebarHeader>
      <SidebarContent className="p-2">
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname.startsWith(item.href)}
                tooltip={{ children: item.label }}
                className={cn(
                  "justify-start",
                  pathname.startsWith(item.href) && "bg-primary/10 text-primary hover:bg-primary/20"
                )}
              >
                <Link href={item.href}>
                  <item.icon className="h-5 w-5" />
                  <span className="group-data-[collapsible=icon]:hidden">{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-4 mt-auto border-t">
        <SidebarMenu>
           <SidebarMenuItem>
             <SidebarMenuButton asChild tooltip={{children: "Visit Site"}} className="justify-start">
                <Link href="/">
                  <Home className="h-5 w-5" />
                  <span className="group-data-[collapsible=icon]:hidden">Visit Site</span>
                </Link>
              </SidebarMenuButton>
           </SidebarMenuItem>
           <SidebarMenuItem>
             <SidebarMenuButton asChild tooltip={{children: "Logout"}} className="justify-start">
                <Link href="/admin/login">
                  <LogOut className="h-5 w-5" />
                  <span className="group-data-[collapsible=icon]:hidden">Logout</span>
                </Link>
              </SidebarMenuButton>
           </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
