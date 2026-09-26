import type { Application } from '@/types';
import { images } from './images';

export const applications: Application[] = [
  { id: 'residential', image: images.brickVilla },
  { id: 'commercial', image: images.commercialBuilding },
  { id: 'landscape', image: images.brickColonnade },
  { id: 'industrial', image: images.factoryLine },
  { id: 'ovens', image: images.outdoorKitchen },
];
