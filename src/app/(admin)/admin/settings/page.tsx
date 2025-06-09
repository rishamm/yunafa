
import type { NextConfig } from 'next';
import path from 'path';
import { TrustedHostsSection } from './_components/TrustedHostsSection';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export const metadata = {
  title: 'Site Settings - Yunafa Admin',
};

async function getCurrentHostnames(): Promise<{ hostnames: string[]; error?: string }> {
  try {
    // Dynamically import next.config.js. This assumes it's in the project root.
    // process.cwd() should give the project root when running `next dev` or `next start`.
    const configPath = path.join(process.cwd(), 'next.config.js');
    const configModule = await import(configPath);
    const config: NextConfig = configModule.default || configModule;

    if (config.images && config.images.remotePatterns) {
      const hostnames = config.images.remotePatterns
        .map(p => p.hostname)
        .filter(Boolean) as string[];
      return { hostnames };
    }
    return { hostnames: [], error: "No remotePatterns configured in next.config.js." };
  } catch (error: any) {
    console.error("Error dynamically importing next.config.js:", error.message);
    return { hostnames: [], error: "Failed to load hostnames from next.config.js. Ensure the file exists at the project root and is a valid JS module." };
  }
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
