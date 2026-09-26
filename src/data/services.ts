import { Boxes, Compass, Factory, PencilRuler, Truck, Warehouse } from 'lucide-react';
import type { Service } from '@/types';

export const services: Service[] = [
  { id: 'manufacturing', icon: Factory },
  { id: 'custom', icon: PencilRuler },
  { id: 'supply', icon: Warehouse },
  { id: 'guidance', icon: Compass },
  { id: 'delivery', icon: Truck },
  { id: 'bulk', icon: Boxes },
];
