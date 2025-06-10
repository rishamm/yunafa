
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

// Sample data, can be expanded or made dynamic
const galleryItemsData: GalleryItem[] = [
  { id: 1, type: 'box1',
    imageUrl: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mzh8fGZhc2hpb258ZW58MHx8MHx8fDA%3D',
    altText: 'Woman with hat',
    dataAiHint: 'fashion hat',
   },
  {
    id: 2,
    type: 'box2',
    imageUrl: 'https://images.unsplash.com/photo-1661264265506-9468782b35c1?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDkzfHx3b21lbiUyMGZhc2hpb24lMjBsYW5kc2NhcGUlMjBpbWFnZXxlbnwwfHwwfHx8MA%3D%3D',
    altText: 'Fashion landscape model',
    dataAiHint: 'fashion model',
  },
  { id: 3, type: 'box1',
    imageUrl: 'https://images.unsplash.com/photo-1541874074067-f03f0020984e?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTUxfHxmYXNoaW9ufGVufDB8fDB8fHww',
    altText: 'Model in stylish outfit',
    dataAiHint: 'stylish outfit',
   },
  {
    id: 4,
    type: 'box2',
    imageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8ZmFzaGlvbnxlbnwwfHwwfHx8MA%3D%3D',
    altText: 'Street style fashion',
    dataAiHint: 'street style',
  },
  { id: 5, type: 'box1',
    imageUrl: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZmFzaGlvbnxlbnwwfHwwfHx8MA%3D%3D',
    altText: 'Shopping bags',
    dataAiHint: 'fashion shopping',
   },
  {
    id: 6,
    type: 'box2',
    imageUrl: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGZhc2hpb258ZW58MHx8MHx8fDA%3D%3D',
    altText: 'Model posing',
    dataAiHint: 'fashion model',
  },
   { id: 7, type: 'box1',
    imageUrl: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzN8fGZhc2hpb258ZW58MHx8MHx8fDA%3D',
    altText: 'Casual fashion',
    dataAiHint: 'casual fashion',
   },
    {
    id: 8,
    type: 'box2',
    imageUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDJ8fGZhc2hpb258ZW58MHx8MHx8fDA%3D',
    altText: 'Elegant model',
    dataAiHint: 'elegant model',
  },
];

export function ThreeDGallary() {
  return (
    <div
      className={cn(
        'w-full h-[70vh] bg-[linear-gradient(to_right,black_25%,#1d1515_50%,black_75%)] overflow-hidden',
      )}
    >
      <div
        className="h-full w-full overflow-y-auto overflow-x-hidden"
        style={{
          perspective: '1200px',
          perspectiveOrigin: 'center center',
        }}
      >
        {galleryItemsData.map((item) => (
          <div
            key={item.id}
            className={cn(
              'w-full h-[100px]', 
              'transform-preserve-3d', 
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
    </div>
  );
}
