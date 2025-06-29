'use client';

import { ContainerScroll } from '@/components/ui/container-scroll-animation';

export function HeroScrollSection() {
  return (
    <div className="flex flex-col overflow-hidden">
      <ContainerScroll
        titleComponent={
          <>
            <h1 className="text-4xl font-semibold text-black dark:text-white">
              Unveil The Unseen <br />
              <span className="text-4xl md:text-[6rem] font-bold mt-1 leading-none">
                Beauty & Elegance
              </span>
            </h1>
          </>
        }
      >
        <video
          src="/hero.mp4"
          autoPlay
          muted
          loop
          playsInline
          className="mx-auto rounded-2xl object-cover h-full w-full object-left-top"
          draggable={false}
        />
      </ContainerScroll>
    </div>
  );
}
