
import { TrustedHostsSection } from './_components/TrustedHostsSection';
// Removed dynamic import of next.config.js

export const metadata = {
  title: 'Site Settings - Yunafa Admin',
};

async function getCurrentHostnames(): Promise<{ hostnames: string[]; error?: string }> {
  // Return a static message instead of dynamically importing next.config.js
  return {
    hostnames: [],
    error: "Image hostnames are configured in next.config.js (or next.config.ts) at the project root. This list cannot be displayed dynamically. Please refer to the configuration file directly to view or modify allowed hostnames.",
  };
}

export default async function AdminSettingsPage() {
  const { hostnames: currentHostnames, error: hostnamesError } = await getCurrentHostnames();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold font-headline">Site Settings</h1>
      </div>

      <div className="bg-card p-6 rounded-lg shadow-lg">
        <TrustedHostsSection currentHostnames={currentHostnames} loadError={hostnamesError} />
      </div>

      {/* Future settings sections can be added below */}
      {/* 
      <div className="bg-card p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4 font-headline">Another Setting Section</h2>
        <p className="text-muted-foreground">Configuration for another feature...</p>
      </div>
      */}
    </div>
  );
}
