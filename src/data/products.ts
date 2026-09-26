import type { Product } from '@/types';
import { images } from './images';

export const products: Product[] = [
  { id: 'fireBricks', image: images.hollowBricks },
  { id: 'clayTiles', image: images.productTiles },
  { id: 'architecturalBricks', image: images.bricksOutdoor },
  { id: 'ovenSolutions', image: images.outdoorKitchen },
];
