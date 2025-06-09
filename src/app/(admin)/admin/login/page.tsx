import { LoginForm } from '@/components/forms/LoginForm';

// This page should ideally have a different layout (no sidebar/header from admin panel)
// For simplicity, we're letting it use the default RootLayout.
// In a real app, create a separate layout for the login page or use route groups.

export const metadata = {
  title: 'Admin Login - Yunafa',
};

export default function AdminLoginPage() {
  return <LoginForm />;
}
