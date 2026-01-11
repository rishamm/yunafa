
import Image from 'next/image';

interface LogoProps {
  height?: number;
  className?: string;
}


export function Logo({ height = 300, className }: LogoProps) {

  const width = 300

  return (
    <div className='flex flex-col  items-center '>
      <Image
        src="/logo.png"
        alt="Yunafa Logo Image"
        width={width}
        height={height}
        className={className}
        priority
        aria-label="Yunafa Logo Image"
      />
    </div>
  );
}
