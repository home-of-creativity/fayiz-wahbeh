import { clsx, type ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

/** Teach tailwind-merge about the custom type scale so `text-h2` is not mistaken for a colour. */
const twMerge = extendTailwindMerge<'text-stroke'>({
  extend: {
    classGroups: {
      'font-size': [{ text: ['display-xl', 'display', 'h2', 'h3', 'lead', 'eyebrow'] }],
      'text-stroke': ['text-outline'],
    },
  },
});

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
