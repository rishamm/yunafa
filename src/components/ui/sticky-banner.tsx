
'use client';

import { cn } from '@/lib/utils';
import type React from 'react';

interface StickyBannerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function StickyBanner({ className, children, ...props }: StickyBannerProps) {
  return (
    <div
      className={cn(
        'sticky top-0 z-40 flex h-auto min-h-[3rem] w-full items-center justify-center py-2 px-4 text-sm font-medium shadow-sm',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
