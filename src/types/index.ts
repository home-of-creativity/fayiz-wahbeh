import type { ComponentType, SVGProps } from 'react';

/** Shape produced by vite-imagetools with `as=picture`. */
export interface ResponsiveImage {
  sources: Record<string, string>;
  img: { src: string; w: number; h: number };
}

export type Language = 'en' | 'ar';

export type IconComponent = ComponentType<SVGProps<SVGSVGElement> & { size?: number | string; strokeWidth?: number | string }>;

export interface NavItem {
  id: string;
  key: string;
}

export interface Product {
  id: 'fireBricks' | 'clayTiles' | 'architecturalBricks' | 'ovenSolutions';
  image: ResponsiveImage;
}

export interface Service {
  id: 'manufacturing' | 'custom' | 'supply' | 'guidance' | 'delivery' | 'bulk';
  icon: IconComponent;
}

export interface Application {
  id: 'residential' | 'commercial' | 'landscape' | 'industrial' | 'ovens';
  image: ResponsiveImage;
}

export interface Value {
  id: 'integrity' | 'sustainability' | 'quality' | 'customer';
  image: ResponsiveImage;
}

export interface Milestone {
  id: 'foundation' | 'expansion' | 'presence' | 'development' | 'sustainability' | 'today';
  year: string | null;
}

export interface GalleryImage {
  id: string;
  image: ResponsiveImage;
}

export interface Location {
  id: 'adra' | 'zablatani' | 'ainTarma' | 'kiswah';
  query: string;
  /** Position on the stylised map, in percent. */
  x: number;
  y: number;
}

export interface ContactPerson {
  id: 'mohammed' | 'omar';
  phone: string;
}
