declare module 'next/navigation' {
  export function useRouter(): {
    push: (url: string) => void;
    replace: (url: string) => void;
    refresh: () => void;
    back: () => void;
    forward: () => void;
  };
  
  export function usePathname(): string;
  export function useSearchParams(): URLSearchParams;
}

declare module 'next/link' {
  import { ComponentType, ReactNode } from 'react';
  
  interface LinkProps {
    href: string;
    as?: string;
    replace?: boolean;
    scroll?: boolean;
    shallow?: boolean;
    passHref?: boolean;
    prefetch?: boolean;
    locale?: string | false;
    className?: string;
    children: ReactNode;
    [key: string]: any;
  }
  
  const Link: ComponentType<LinkProps>;
  export default Link;
}

declare module 'next/server' {
  export class NextRequest extends Request {
    nextUrl: URL;
    geo?: {
      city?: string;
      country?: string;
      region?: string;
    };
    ip?: string;
    cookies: {
      get: (name: string) => { name: string; value: string } | undefined;
      getAll: () => Array<{ name: string; value: string }>;
      set: (name: string, value: string) => void;
      delete: (name: string) => void;
      has: (name: string) => boolean;
      clear: () => void;
    };
  }
  
  export class NextResponse extends Response {
    cookies: {
      get: (name: string) => { name: string; value: string } | undefined;
      getAll: () => Array<{ name: string; value: string }>;
      set: (name: string, value: string) => void;
      delete: (name: string) => void;
    };
    
    static json(body: any, init?: ResponseInit): NextResponse;
    static redirect(url: string, init?: ResponseInit): NextResponse;
    static rewrite(destination: string, init?: ResponseInit): NextResponse;
    static next(init?: ResponseInit): NextResponse;
  }
}

// Декларация типов для модулей Next.js
declare module 'next/image' {
  import { DetailedHTMLProps, ImgHTMLAttributes } from 'react'
  
  export interface ImageProps extends DetailedHTMLProps<ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement> {
    src: string
    alt: string
    width?: number
    height?: number
    fill?: boolean
    loader?: any
    quality?: number
    priority?: boolean
    loading?: 'lazy' | 'eager'
    unoptimized?: boolean
    placeholder?: 'blur' | 'empty'
    blurDataURL?: string
    className?: string
    style?: React.CSSProperties
  }
  
  export default function Image(props: ImageProps): JSX.Element
} 