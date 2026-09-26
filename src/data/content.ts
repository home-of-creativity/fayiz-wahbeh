import type { ContactPerson, GalleryImage, Location, Milestone, NavItem, Value } from '@/types';
import { images } from './images';

export const EMAIL = 'sales@fwbrick.com';

export const people: ContactPerson[] = [
  { id: 'mohammed', phone: '+963944265817' },
  { id: 'omar', phone: '+963944898403' },
];

export const navItems: NavItem[] = [
  { id: 'home', key: 'nav.home' },
  { id: 'about', key: 'nav.about' },
  { id: 'products', key: 'nav.products' },
  { id: 'applications', key: 'nav.applications' },
  { id: 'why-us', key: 'nav.whyUs' },
  { id: 'legacy', key: 'nav.legacy' },
  { id: 'contact', key: 'nav.contact' },
];

/** Broad development themes; `year: null` renders as "Today". */
export const milestones: Milestone[] = [
  { id: 'foundation', year: '1970' },
  { id: 'expansion', year: '1980' },
  { id: 'presence', year: '1990' },
  { id: 'development', year: '2000' },
  { id: 'sustainability', year: '2010' },
  { id: 'today', year: null },
];

export const values: Value[] = [
  { id: 'integrity', image: images.craftsman },
  { id: 'sustainability', image: images.villaRoof },
  { id: 'quality', image: images.tilesCloseup },
  { id: 'customer', image: images.hollowBricks },
];

export const gallery: GalleryImage[] = [
  { id: 'colonnade', image: images.modernColonnade },
  { id: 'tiles', image: images.tilesCloseup },
  { id: 'commercial', image: images.commercialBuilding },
  { id: 'stack', image: images.tilesStack },
  { id: 'corridor', image: images.brickColonnade },
  { id: 'catalog', image: images.brandCatalog },
  { id: 'kitchen', image: images.outdoorKitchen },
];

/** `x` / `y` place each pin on the stylised map, in percent of the frame (LTR orientation). */
export const locations: Location[] = [
  { id: 'adra', query: 'Adra Industrial City, Damascus Countryside, Syria', x: 80, y: 20 },
  { id: 'zablatani', query: 'Zablatani, Damascus, Syria', x: 46, y: 44 },
  { id: 'ainTarma', query: 'Ain Tarma, Damascus Countryside, Syria', x: 61, y: 50 },
  { id: 'kiswah', query: 'Al-Kiswah, Damascus Countryside, Syria', x: 36, y: 84 },
];

export const projectTypes = ['residential', 'commercial', 'industrial', 'landscape', 'ovens', 'other'] as const;
