import { gsap } from './gsap';
import { dirSign } from './motion';
import { splitForReveal } from './text';

export interface RevealOptions {
  trigger?: Element;
  start?: string;
  delay?: number;
  stagger?: number;
  duration?: number;
}

type Targets = gsap.TweenTarget;

function scrollTrigger(options: RevealOptions): ScrollTrigger.Vars | undefined {
  if (!options.trigger) return undefined;
  // Plays once and stays registered. `once: true` would make triggers delete themselves mid-refresh,
  // which crashes ScrollTrigger when the page is rebuilt (language switch) while scrolled past them.
  return { trigger: options.trigger, start: options.start ?? 'top 86%', toggleActions: 'play none none none' };
}

function base(options: RevealOptions): gsap.TweenVars {
  return {
    duration: options.duration ?? 1.1,
    delay: options.delay ?? 0,
    stagger: options.stagger,
    ease: 'power3.out',
    scrollTrigger: scrollTrigger(options),
  };
}

export function fadeUp(targets: Targets, options: RevealOptions = {}): gsap.core.Tween {
  return gsap.from(targets, { y: 56, autoAlpha: 0, ...base(options) });
}

export function fadeIn(targets: Targets, options: RevealOptions = {}): gsap.core.Tween {
  return gsap.from(targets, { autoAlpha: 0, ...base(options), ease: 'power2.out' });
}

/** Enters from the reading-start side (left in LTR, right in RTL). */
export function slideStart(targets: Targets, options: RevealOptions = {}): gsap.core.Tween {
  return gsap.from(targets, { x: -72 * dirSign(), autoAlpha: 0, ...base(options) });
}

/** Enters from the reading-end side. */
export function slideEnd(targets: Targets, options: RevealOptions = {}): gsap.core.Tween {
  return gsap.from(targets, { x: 72 * dirSign(), autoAlpha: 0, ...base(options) });
}

export function scaleReveal(targets: Targets, options: RevealOptions = {}): gsap.core.Tween {
  return gsap.from(targets, { scale: 0.92, autoAlpha: 0, transformOrigin: '50% 100%', ...base(options) });
}

export function staggerChildren(container: HTMLElement, options: RevealOptions = {}): gsap.core.Tween {
  return fadeUp(container.children, {
    trigger: container,
    duration: 0.9,
    ...options,
    stagger: options.stagger ?? 0.09,
  });
}

export type RevealDirection = 'up' | 'down' | 'start' | 'end';

const CLIP_FROM: Record<RevealDirection, (sign: 1 | -1) => string> = {
  up: () => 'inset(100% 0% 0% 0%)',
  down: () => 'inset(0% 0% 100% 0%)',
  start: (sign) => (sign === 1 ? 'inset(0% 100% 0% 0%)' : 'inset(0% 0% 0% 100%)'),
  end: (sign) => (sign === 1 ? 'inset(0% 0% 0% 100%)' : 'inset(0% 100% 0% 0%)'),
};

/** Masked image reveal: the frame wipes open while the image settles from 1.15 to 1. */
export function imageReveal(
  frame: HTMLElement,
  image: HTMLElement | null,
  direction: RevealDirection = 'up',
  options: RevealOptions = {},
): gsap.core.Timeline {
  const tl = gsap.timeline({ scrollTrigger: scrollTrigger(options), delay: options.delay ?? 0 });
  tl.fromTo(
    frame,
    { clipPath: CLIP_FROM[direction](dirSign()) },
    { clipPath: 'inset(0% 0% 0% 0%)', duration: options.duration ?? 1.4, ease: 'power4.inOut' },
  );
  if (image) {
    tl.fromTo(image, { scale: 1.15 }, { scale: 1, duration: (options.duration ?? 1.4) + 0.4, ease: 'power3.out' }, 0);
  }
  return tl;
}

/** Masked word (or character) reveal. Returns a cleanup that restores the original markup. */
export function textReveal(
  el: HTMLElement,
  options: RevealOptions & { chars?: boolean } = {},
): { tween: gsap.core.Tween; revert: () => void } {
  const split = splitForReveal(el, options.chars);
  const step = options.stagger ?? (options.chars ? 0.05 : 0.07);
  const tween = gsap.from(split.targets, {
    yPercent: 115,
    duration: options.duration ?? 1.1,
    ease: 'power4.out',
    delay: (i: number) => (options.delay ?? 0) + split.wordIndex[i] * step + (options.chars ? i * 0.012 : 0),
    scrollTrigger: scrollTrigger(options),
  });
  return { tween, revert: split.revert };
}

/** Scrubbed vertical drift. `amount` is in percent of the element height. */
export function parallax(el: HTMLElement, trigger: Element, amount = 10): gsap.core.Tween {
  return gsap.fromTo(
    el,
    { yPercent: -amount },
    {
      yPercent: amount,
      ease: 'none',
      scrollTrigger: { trigger, start: 'top bottom', end: 'bottom top', scrub: true },
    },
  );
}

/** Draws a line from the reading-start side, scrubbed to scroll. */
export function lineDraw(el: HTMLElement, trigger: Element, vertical = false): gsap.core.Tween {
  return gsap.fromTo(
    el,
    vertical ? { scaleY: 0 } : { scaleX: 0 },
    {
      ...(vertical ? { scaleY: 1 } : { scaleX: 1 }),
      ease: 'none',
      scrollTrigger: { trigger, start: 'top 80%', end: 'bottom 60%', scrub: 0.6 },
    },
  );
}
