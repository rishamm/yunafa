import { AdminHeader } from '@/components/layout/AdminHeader';
import { AdminSidebar } from '@/components/layout/AdminSidebar';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'; // Import from shadcn/ui

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // This layout assumes that authentication has been handled.
  // In a real application, you would protect these routes.
  return (
    <SidebarProvider defaultOpen>
      <AdminSidebar />
      <SidebarInset className="flex flex-col">
        <AdminHeader />
        <main className="flex-1 overflow-y-auto p-6 bg-muted/30">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
