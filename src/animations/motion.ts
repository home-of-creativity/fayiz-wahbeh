/** Media queries shared by every gsap.matchMedia() block. */
export const MOTION_OK = '(prefers-reduced-motion: no-preference)';
export const MOTION_DESKTOP = '(prefers-reduced-motion: no-preference) and (min-width: 1024px)';
export const POINTER_FINE = '(prefers-reduced-motion: no-preference) and (hover: hover) and (pointer: fine) and (min-width: 1024px)';

export function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function isRTL(): boolean {
  return document.documentElement.dir === 'rtl';
}

/** +1 in LTR, -1 in RTL — multiply horizontal offsets by this. */
export function dirSign(): 1 | -1 {
  return isRTL() ? -1 : 1;
}
