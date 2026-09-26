import type Lenis from 'lenis';

let lenisInstance: Lenis | null = null;

export function setLenis(instance: Lenis | null): void {
  lenisInstance = instance;
}

export function getLenis(): Lenis | null {
  return lenisInstance;
}

const easeOutExpo = (t: number): number => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

function headerOffset(): number {
  // The compact header is ~72px tall; keep a little air below it.
  return window.innerWidth >= 1024 ? 80 : 68;
}

export function scrollToTarget(target: string | HTMLElement): void {
  const el = typeof target === 'string' ? document.querySelector<HTMLElement>(target) : target;
  if (!el) return;
  const offset = el.id === 'home' ? 0 : -headerOffset();

  if (lenisInstance) {
    lenisInstance.scrollTo(el, { offset, duration: 1.6, easing: easeOutExpo, force: true });
  } else {
    const top = el.getBoundingClientRect().top + window.scrollY + offset;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top, behavior: reduce ? 'auto' : 'smooth' });
  }
}

export function lockScroll(locked: boolean): void {
  if (lenisInstance) {
    if (locked) lenisInstance.stop();
    else lenisInstance.start();
  }
  document.documentElement.classList.toggle('scroll-locked', locked);
}
