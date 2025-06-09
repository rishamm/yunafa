import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Package, Tags, Users, BarChart3, ExternalLink } from "lucide-react";
import { getProducts, getCategories } from "@/lib/data";

export const metadata = {
  title: 'Admin Dashboard - Yunafa',
};

export default async function AdminDashboardPage() {
  const products = await getProducts();
  const categories = await getCategories();
  // Placeholder for user count and sales data
  const userCount = 125; 
  const totalSales = 78500.50;

  const summaryCards = [
    { title: "Total Products", value: products.length, icon: Package, href: "/admin/products" },
    { title: "Total Categories", value: categories.length, icon: Tags, href: "/admin/categories" },
    { title: "Registered Users", value: userCount, icon: Users, href: "#" }, // Placeholder link
    { title: "Total Sales", value: `$${totalSales.toLocaleString()}`, icon: BarChart3, href: "#" }, // Placeholder link
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold font-headline">Dashboard</h1>
        <Button asChild variant="outline">
          <Link href="/" target="_blank" rel="noopener noreferrer">
            View Live Site <ExternalLink className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {summaryCards.map((card) => (
          <Card key={card.title} className="shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium font-headline">{card.title}</CardTitle>
              <card.icon className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              <Button variant="link" asChild className="p-0 h-auto text-xs text-muted-foreground">
                 <Link href={card.href}>View Details</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline">Recent Activity</CardTitle>
            <CardDescription>Overview of recent actions in the store.</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Placeholder for recent activity feed */}
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>New product "Elegant Gold Bracelet" added.</li>
              <li>Category "Summer Collection" updated.</li>
              <li>Admin user logged in.</li>
              <li>5 new inquiries received.</li>
            </ul>
          </CardContent>
        </Card>
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline">Quick Links</CardTitle>
            <CardDescription>Quick access to common tasks.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <Button asChild variant="outline">
              <Link href="/admin/products/new">Add New Product</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/admin/categories/new">Add New Category</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/admin/products">Manage Products</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/admin/categories">Manage Categories</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
