import type { RefObject } from 'react';
import { gsap, useGSAP } from '@/animations/gsap';
import { POINTER_FINE } from '@/animations/motion';

/** Moves `target` a few pixels toward the pointer while hovering `area`. Desktop pointers only. */
export function usePointerDrift(
  area: RefObject<HTMLElement>,
  target: RefObject<HTMLElement>,
  strength = 8,
  enabled = true,
): void {
  useGSAP(
    () => {
      if (!enabled) return;
      const mm = gsap.matchMedia();
      mm.add(POINTER_FINE, () => {
        const el = area.current;
        const moving = target.current;
        if (!el || !moving) return;
        const xTo = gsap.quickTo(moving, 'x', { duration: 0.9, ease: 'power3.out' });
        const yTo = gsap.quickTo(moving, 'y', { duration: 0.9, ease: 'power3.out' });

        const onMove = (event: PointerEvent) => {
          const rect = el.getBoundingClientRect();
          xTo(((event.clientX - rect.left) / rect.width - 0.5) * strength * 2);
          yTo(((event.clientY - rect.top) / rect.height - 0.5) * strength * 2);
        };
        const onLeave = () => {
          xTo(0);
          yTo(0);
        };
        el.addEventListener('pointermove', onMove);
        el.addEventListener('pointerleave', onLeave);
        return () => {
          el.removeEventListener('pointermove', onMove);
          el.removeEventListener('pointerleave', onLeave);
        };
      });
    },
    { dependencies: [enabled] },
  );
}
