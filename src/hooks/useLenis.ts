import { useEffect } from 'react';
import Lenis from 'lenis';
import { gsap, ScrollTrigger } from '@/animations/gsap';
import { prefersReducedMotion } from '@/animations/motion';
import { scrollToTarget, setLenis } from '@/utils/scroll';

/** One Lenis instance, driven by the GSAP ticker and synced with ScrollTrigger. */
export function useLenis(): void {
  useEffect(() => {
    let lenis: Lenis | null = null;
    let tick: ((time: number) => void) | null = null;

    if (!prefersReducedMotion()) {
      // Lerp-based smoothing feels continuous on wheels and trackpads; touch keeps native momentum.
      lenis = new Lenis({
        lerp: 0.085,
        smoothWheel: true,
        syncTouch: false,
        wheelMultiplier: 1,
        touchMultiplier: 1.3,
        autoRaf: false,
      });
      lenis.on('scroll', ScrollTrigger.update);
      const instance = lenis;
      tick = (time: number) => instance.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
      setLenis(lenis);
    }

    // Route every in-page anchor through the smooth scroller.
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey) return;
      const anchor = (event.target as Element | null)?.closest<HTMLAnchorElement>('a[href^="#"]');
      const hash = anchor?.getAttribute('href');
      if (!anchor || !hash || hash === '#') return;
      const target = document.querySelector<HTMLElement>(hash);
      if (!target) return;
      event.preventDefault();
      scrollToTarget(target);
      history.replaceState(null, '', hash);
      target.focus({ preventScroll: true });
    };
    document.addEventListener('click', onClick);

    return () => {
      document.removeEventListener('click', onClick);
      if (tick) gsap.ticker.remove(tick);
      lenis?.destroy();
      setLenis(null);
    };
  }, []);
}
