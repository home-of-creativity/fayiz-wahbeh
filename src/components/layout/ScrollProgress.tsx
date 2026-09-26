import { useRef } from 'react';
import { gsap, useGSAP } from '@/animations/gsap';

/** Thin clay-coloured progress line: vertical on desktop, along the top edge on mobile. */
export function ScrollProgress() {
  const vertical = useRef<HTMLSpanElement>(null);
  const horizontal = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    const scrollTrigger = { start: 0, end: 'max', scrub: 0.3 };
    gsap.fromTo(vertical.current, { scaleY: 0 }, { scaleY: 1, ease: 'none', scrollTrigger });
    gsap.fromTo(horizontal.current, { scaleX: 0 }, { scaleX: 1, ease: 'none', scrollTrigger: { ...scrollTrigger } });
  });

  return (
    <div aria-hidden>
      <div className="fixed end-5 top-1/2 z-40 hidden h-40 w-[2px] -translate-y-1/2 bg-charcoal/10 lg:block">
        <span ref={vertical} className="block h-full w-full origin-top bg-terracotta" />
      </div>
      <div className="fixed inset-x-0 top-0 z-[55] h-[2px] lg:hidden">
        <span ref={horizontal} className="origin-start block h-full w-full bg-terracotta" />
      </div>
    </div>
  );
}
