
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Info } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { RequestHostForm } from "./RequestHostForm";

interface TrustedHostsSectionProps {
  currentHostnames: string[];
  loadError?: string;
}

export function TrustedHostsSection({ currentHostnames, loadError }: TrustedHostsSectionProps) {
  return (
    <Card className="border-none shadow-none">
      <CardHeader className="px-0 pt-0">
        <CardTitle className="text-2xl font-headline">Trusted Image Hostnames</CardTitle>
        <CardDescription>
          Manage hostnames allowed for external images used with `next/image`.
        </CardDescription>
      </CardHeader>
      <CardContent className="px-0 space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">Currently Allowed Hostnames:</h3>
          {loadError && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error Loading Hostnames</AlertTitle>
              <AlertDescription>{loadError}</AlertDescription>
            </Alert>
          )}
          {currentHostnames.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {currentHostnames.map((host) => (
                <Badge key={host} variant="secondary" className="text-sm px-3 py-1">
                  {host}
                </Badge>
              ))}
            </div>
          ) : (
            !loadError && <p className="text-muted-foreground">No hostnames currently configured or readable.</p>
          )}
          <p className="text-xs text-muted-foreground mt-2">
            This list is read from your `next.config.js` file.
          </p>
        </div>

        <hr className="my-6"/>

        <div>
          <h3 className="text-lg font-semibold mb-2">Request New Hostname</h3>
          <RequestHostForm />
          <Alert className="mt-4 border-primary/50 bg-primary/5">
            <Info className="h-4 w-4 text-primary" />
            <AlertTitle className="text-primary">Important Note</AlertTitle>
            <AlertDescription className="text-primary/80">
              Adding a hostname here is a request. A developer must manually update the
              `next.config.js` file and restart the server for the new hostname to become active.
              This form does not automatically modify server configuration.
            </AlertDescription>
          </Alert>
        </div>
      </CardContent>
    </Card>
  );
}
