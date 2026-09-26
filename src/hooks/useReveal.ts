import type { RefObject } from 'react';
import { gsap, useGSAP } from '@/animations/gsap';
import { MOTION_DESKTOP, MOTION_OK } from '@/animations/motion';
import {
  fadeIn,
  fadeUp,
  lineDraw,
  parallax,
  scaleReveal,
  slideEnd,
  slideStart,
  staggerChildren,
  textReveal,
  type RevealOptions,
} from '@/animations/presets';

const PRESETS = {
  'fade-up': fadeUp,
  'fade-in': fadeIn,
  'slide-start': slideStart,
  'slide-end': slideEnd,
  scale: scaleReveal,
} as const;

type PresetName = keyof typeof PRESETS;

function isPreset(value: string | undefined): value is PresetName {
  return !!value && value in PRESETS;
}

function delayOf(el: HTMLElement): number {
  return Number(el.dataset.delay ?? 0);
}

/**
 * Declarative scroll animations for a section. Inside `scope`:
 * - `data-reveal="fade-up|fade-in|slide-start|slide-end|scale"` (+ `data-delay`)
 * - `data-stagger` — children fade up one after another
 * - `data-split` — masked word reveal for headings (`data-split="chars"` for Latin characters)
 * - `data-parallax="8"` — scrubbed drift in percent (desktop only)
 * - `data-line` / `data-line="y"` — scrubbed line draw
 * Everything is skipped under prefers-reduced-motion, leaving content static.
 */
export function useReveal(scope: RefObject<HTMLElement>): void {
  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(MOTION_OK, () => {
        const root = scope.current;
        if (!root) return;
        const reverts: Array<() => void> = [];

        root.querySelectorAll<HTMLElement>('[data-split]').forEach((el) => {
          const options: RevealOptions & { chars?: boolean } = {
            trigger: el,
            delay: delayOf(el),
            chars: el.dataset.split === 'chars',
          };
          reverts.push(textReveal(el, options).revert);
        });

        root.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el) => {
          const name = el.dataset.reveal;
          if (isPreset(name)) PRESETS[name](el, { trigger: el, delay: delayOf(el) });
        });

        root.querySelectorAll<HTMLElement>('[data-stagger]').forEach((el) => {
          staggerChildren(el, { delay: delayOf(el), stagger: Number(el.dataset.stagger) || undefined });
        });

        root.querySelectorAll<HTMLElement>('[data-line]').forEach((el) => {
          lineDraw(el, el.parentElement ?? el, el.dataset.line === 'y');
        });

        return () => reverts.forEach((revert) => revert());
      });

      mm.add(MOTION_DESKTOP, () => {
        const root = scope.current;
        if (!root) return;
        root.querySelectorAll<HTMLElement>('[data-parallax]').forEach((el) => {
          const amount = Number(el.dataset.parallax) || 8;
          parallax(el, el.closest('section') ?? el, amount);
        });
      });
    },
    { scope },
  );
}
