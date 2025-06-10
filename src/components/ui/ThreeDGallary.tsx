
'use client';

import Image from 'next/image';
import type React from 'react';

// Define a type for gallery items if you want to pass them as props later
// interface GalleryItem {
//   id: string | number;
//   imageUrl?: string;
//   altText?: string;
//   dataAiHint?: string;
// }

// For now, we'll use a hardcoded structure based on the example
const galleryItemsData = [
  { type: 'box1' },
  {
    type: 'box2',
    imageUrl: 'https://images.unsplash.com/photo-1661264265506-9468782b35c1?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDkzfHx3b21lbiUyMGZhc2hpb24lMjBsYW5kc2NhcGUlMjBpbWFnZXxlbnwwfHwwfHx8MA%3D%3D',
    altText: 'Fashion landscape model',
    dataAiHint: 'fashion model',
  },
  { type: 'box1' },
  { type: 'box2' },
  { type: 'box1' },
  { type: 'box2' },
  { type: 'box1' },
  { type: 'box2' },
  { type: 'box1' },
  { type: 'box2' },
  { type: 'box1' },
  { type: 'box2' },
  { type: 'box1' },
  { type: 'box2' },
];

export function ThreeDGallary() {
  return (
    <div
      className="grid justify-items-center min-h-screen w-full overflow-y-auto overflow-x-hidden bg-gradient-to-r from-black from-25% via-[#1d1515] to-black to-75%"
      style={{
        perspective: '600px',
        perspectiveOrigin: 'center center',
      }}
    >
      <div className="w-full"> {/* Content wrapper to allow internal scrolling if needed */}
        {galleryItemsData.map((item, index) => (
          <div
            key={index}
            className={`
              w-full h-[300px] 
              [transform-style:preserve-3d]
              ${item.type === 'box1' ? 
                'bg-gradient-to-r from-white from-70% to-[#b9b0b0] [transform:translateX(-50%)_rotateY(65deg)] origin-[right_center]' :
                'bg-gradient-to-l from-white from-70% to-[#b9b0b0] [transform:translateX(50%)_rotateY(-65deg)] origin-[left_center]'
              }
            `}
          >
            {item.imageUrl && (
              <div className="relative w-full h-full">
                <Image
                  src={item.imageUrl}
                  alt={item.altText || 'Gallery image'}
                  fill
                  className="object-contain" // Use contain to see the whole image within the skewed box
                  data-ai-hint={item.dataAiHint || 'gallery image'}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
