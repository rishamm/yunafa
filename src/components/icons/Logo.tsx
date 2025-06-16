
import Image from 'next/image';

interface LogoProps {
  height?: number; 
  className?: string; 
}


export function Logo({ height = 60, className }: LogoProps) {
  const aspectRatio = 2.25; 
  const width = Math.round(height * aspectRatio);

  return (
    <div className='flex flex-col items-center '>
    <Image
      src="/logo.png" 
      alt="Yunafa Logo"
      width={width}
      height={height}
      className={className}
      priority 
      aria-label="Yunafa Logo" 
    />
    <span>
      YUNAFA
    </span>
    </div>
  );
}

