import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { gsap, useGSAP } from '@/animations/gsap';
import { isRTL, prefersReducedMotion } from '@/animations/motion';
import { LogoMark } from '@/components/ui/LogoMark';
import { lockScroll } from '@/utils/scroll';

/**
 * The intro plays on every page load (skipped under reduced motion).
 * Its logo lands in the hero, so the page always opens at the top.
 */
export function prepareIntro(): boolean {
  if (prefersReducedMotion()) return false;
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  return true;
}

/** Fixed positions for the clay dust specks, in percent around the mark. */
const DUST = Array.from({ length: 16 }, (_, i) => ({
  left: 18 + ((i * 37) % 64),
  top: 38 + ((i * 23) % 36),
  size: 2 + (i % 3),
}));

interface PreloaderProps {
  /** Called as the curtain starts to lift, so the hero can animate underneath. */
  onReveal: () => void;
  /** Called once the logo has landed and the overlay is gone. */
  onComplete: () => void;
}

export function Preloader({ onReveal, onComplete }: PreloaderProps) {
  const { t } = useTranslation();
  const root = useRef<HTMLDivElement>(null);
  const name = t('brand.name');
  // Arabic letters must stay joined, so Arabic animates word by word.
  const nameParts = isRTL() ? name.split(' ') : Array.from(name);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const q = gsap.utils.selector(el);
      const piece = (id: string) => q(`[data-piece="${id}"]`);
      const markBox = el.querySelector<HTMLElement>('[data-preloader-mark]');
      const trowel = el.querySelector<SVGPathElement>('[data-piece="trowel"]');
      const length = trowel?.getTotalLength() ?? 600;
      let landing: SVGSVGElement | null = null;

      lockScroll(true);
      if (trowel) {
        gsap.set(trowel, { strokeDasharray: length, strokeDashoffset: length, fillOpacity: 0, stroke: '#3F3F3F', strokeWidth: 2.5 });
      }

      /** Flies the assembled mark onto the hero emblem (FLIP), or fades it if the emblem is off screen. */
      const flyToHero = () => {
        if (!markBox) return;
        const target = document.querySelector<SVGSVGElement>('[data-hero-emblem-mark]');
        const from = markBox.getBoundingClientRect();
        const to = target?.getBoundingClientRect();
        const onScreen = !!to && to.width > 0 && to.top < window.innerHeight && to.bottom > 0;

        if (!target || !to || !onScreen) {
          gsap.to(markBox, { autoAlpha: 0, y: -24, duration: 0.5, ease: 'power2.in' });
          return;
        }
        landing = target;
        gsap.set(target, { visibility: 'hidden' });
        gsap.set(markBox, { transformOrigin: '0% 0%' });
        gsap.to(markBox, {
          x: to.left - from.left,
          y: to.top - from.top,
          scale: to.width / from.width,
          duration: 1.1,
          ease: 'power3.inOut',
        });
      };

      const tl = gsap.timeline({
        defaults: { ease: 'power3.out' },
        onComplete: () => {
          if (landing) gsap.set(landing, { visibility: 'visible' });
          lockScroll(false);
          onComplete();
        },
      });

      tl
        // Terracotta F and W slide in from opposite sides.
        .from(piece('fBody'), { x: -110, autoAlpha: 0, duration: 0.75 }, 0.05)
        .from(piece('fStroke'), { x: -70, y: -50, rotation: -14, autoAlpha: 0, transformOrigin: '50% 50%', duration: 0.75 }, 0.15)
        .from(piece('wBody'), { x: 130, autoAlpha: 0, duration: 0.8 }, 0.1)
        .from(piece('wBlock'), { y: 80, autoAlpha: 0, duration: 0.65 }, 0.3)
        // Dark brown top elements drop onto the letters.
        .from(piece('topBar'), { y: -70, scaleX: 0.35, autoAlpha: 0, transformOrigin: '0% 50%', duration: 0.65, ease: 'power4.out' }, 0.45)
        .from(piece('topBlock'), { y: -55, autoAlpha: 0, duration: 0.55, ease: 'power4.out' }, 0.58)
        // The trowel is drawn, swings into place and fills.
        .to(trowel, { strokeDashoffset: 0, duration: 0.7, ease: 'power2.inOut' }, 0.5)
        .from(trowel, { rotation: -32, transformOrigin: '0% 100%', duration: 0.85, ease: 'back.out(1.5)' }, 0.5)
        .to(trowel, { fillOpacity: 1, strokeWidth: 0, duration: 0.3 }, 1.05)
        // The mark locks into position.
        .fromTo(markBox, { scale: 1.05 }, { scale: 1, duration: 0.45, ease: 'back.out(3)' }, 1.2)
        .fromTo(q('[data-preloader-rule]'), { scaleX: 0 }, { scaleX: 1, duration: 0.6, ease: 'power3.inOut' }, 1.1)
        .from(q('[data-name-part]'), { yPercent: 115, duration: 0.7, stagger: 0.03, ease: 'power4.out' }, 1.2)
        .from(q('[data-preloader-since]'), { autoAlpha: 0, y: 10, duration: 0.55 }, 1.55)
        // Faint clay dust drifting off the mark.
        .fromTo(
          q('[data-dust]'),
          { autoAlpha: 0, y: 0, x: 0 },
          {
            autoAlpha: (i: number) => 0.2 + (i % 3) * 0.12,
            y: (i: number) => -24 - (i % 5) * 12,
            x: (i: number) => ((i % 7) - 3) * 10,
            duration: 1.5,
            stagger: 0.025,
            ease: 'power1.out',
          },
          0.35,
        )
        .to(q('[data-dust]'), { autoAlpha: 0, duration: 0.4 }, 1.75)
        // Exit: the wordmark clears, the curtain lifts and the mark travels into the hero.
        .to(q('[data-preloader-rule], [data-preloader-name], [data-preloader-since]'), { autoAlpha: 0, y: -12, duration: 0.4, stagger: 0.04, ease: 'power2.in' }, 1.95)
        .add(onReveal, 2.05)
        .add(flyToHero, 2.1)
        .to(q('[data-preloader-bg]'), { clipPath: 'inset(0% 0% 100% 0%)', duration: 0.9, ease: 'power4.inOut' }, 2.1)
        // Hold until the mark has landed.
        .to({}, { duration: 1.15 }, 2.1);

      return () => lockScroll(false);
    },
    { scope: root },
  );

  return (
    <div
      ref={root}
      data-preloader
      role="status"
      aria-live="polite"
      className="fixed inset-0 z-[100] grid place-items-center overflow-hidden"
    >
      <div data-preloader-bg aria-hidden className="grain absolute inset-0 bg-cream" style={{ clipPath: 'inset(0% 0% 0% 0%)' }} />
      <span className="sr-only">{t('a11y.loading')}</span>

      {DUST.map((dust, i) => (
        <span
          key={i}
          data-dust
          aria-hidden
          className="invisible absolute rounded-full bg-terracotta"
          style={{ left: `${dust.left}%`, top: `${dust.top}%`, width: dust.size, height: dust.size }}
        />
      ))}

      <div className="relative flex flex-col items-center" aria-hidden>
        <div data-preloader-mark className="will-change-transform">
          <LogoMark className="w-[min(58vw,15rem)] overflow-visible" />
        </div>
        <span data-preloader-rule className="mt-7 block h-px w-40 bg-charcoal/20" />
        <p
          data-preloader-name
          className="mt-5 flex overflow-hidden text-[clamp(1.1rem,3vw,1.5rem)] font-extrabold uppercase tracking-[0.28em] text-charcoal rtl:tracking-normal"
        >
          {nameParts.map((part, i) => (
            <span key={i} data-name-part className="inline-block whitespace-pre">
              {isRTL() && i < nameParts.length - 1 ? `${part} ` : part}
            </span>
          ))}
        </p>
        <p
          data-preloader-since
          className="mt-3 text-[0.7rem] font-bold uppercase tracking-[0.5em] text-terracotta-600 rtl:text-sm rtl:tracking-normal"
        >
          {t('brand.since')}
        </p>
      </div>
    </div>
  );
}
