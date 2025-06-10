
'use client';

import Image from 'next/image';
import type React from 'react';
import { cn } from '@/lib/utils';

interface GalleryItem {
  id: string | number;
  type: 'box1' | 'box2'; 
  imageUrl?: string;
  altText?: string;
  dataAiHint?: string;
}

const galleryItemsData: GalleryItem[] = [
  { id: 1, type: 'box1' },
  {
    id: 2,
    type: 'box2',
    imageUrl: 'https://images.unsplash.com/photo-1661264265506-9468782b35c1?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDkzfHx3b21lbiUyMGZhc2hpb24lMjBsYW5kc2NhcGUlMjBpbWFnZXxlbnwwfHwwfHx8MA%3D%3D',
    altText: 'Fashion landscape model',
    dataAiHint: 'fashion model',
  },
  { id: 3, type: 'box1' },
  { id: 4, type: 'box2' },
  { id: 5, type: 'box1' },
  { id: 6, type: 'box2' },
  { id: 7, type: 'box1' },
  { id: 8, type: 'box2' },
  { id: 9, type: 'box1' },
  { id: 10, type: 'box2' },
  { id: 11, type: 'box1' },
  { id: 12, type: 'box2' },
  { id: 13, type: 'box1' },
  { id: 14, type: 'box2' },
];

export function ThreeDGallary() {
  return (
    <div
      className="grid justify-items-center min-h-screen w-full overflow-y-auto overflow-x-hidden bg-[linear-gradient(to_right,black_25%,#1d1515_50%,black_75%)]"
      style={{
        perspective: '600px',
        perspectiveOrigin: 'center center',
      }}
    >
      {/* Removed intermediate w-full div, boxes are direct children */}
      {galleryItemsData.map((item) => (
        <div
          key={item.id}
          className={cn(
            'w-full h-[300px]', // Using w-full for robustness within layouts
            'transform-preserve-3d', // Standard Tailwind class for transform-style: preserve-3d
            item.type === 'box1' ? 
              'bg-gradient-to-r from-white from-70% to-[#b9b0b0] [transform:translateX(-50%)_rotateY(65deg)] origin-[right_center]' :
              'bg-gradient-to-l from-white from-70% to-[#b9b0b0] [transform:translateX(50%)_rotateY(-65deg)] origin-[left_center]'
          )}
        >
          {item.imageUrl && (
            <div className="relative w-full h-full">
              <Image
                src={item.imageUrl}
                alt={item.altText || 'Gallery image'}
                fill
                className="object-contain" 
                data-ai-hint={item.dataAiHint || 'gallery image'}
                sizes="(max-width: 768px) 100vw, 50vw" 
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
