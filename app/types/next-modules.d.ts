declare module "next" {
  export interface Metadata {
    title?: string;
    description?: string;
    [key: string]: any;
  }
}

declare module "next/font/google" {
  export function Inter(options: { subsets: string[] }): {
    className: string;
    style: { fontFamily: string };
  };
} 