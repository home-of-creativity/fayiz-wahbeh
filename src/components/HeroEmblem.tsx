import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { gsap, useGSAP } from '@/animations/gsap';
import { MOTION_DESKTOP, MOTION_OK, POINTER_FINE } from '@/animations/motion';
import { LogoMark } from '@/components/ui/LogoMark';
import { cn } from '@/utils/cn';

/** How far each piece of the mark opens up while the pointer rests on the emblem. */
const SPREAD: Record<string, gsap.TweenVars> = {
  topBar: { y: -7 },
  topBlock: { x: 3, y: -5 },
  fStroke: { x: -6, y: -3 },
  fBody: { x: -8, y: 2 },
  wBlock: { y: 6 },
  wBody: { x: 8 },
};

interface HeroEmblemProps {
  /** Starts the entrance once the intro hands over to the page. */
  ready: boolean;
  className?: string;
}

/** The FW mark set on a cream plate over the hero photograph, receiving the preloader's logo. */
export function HeroEmblem({ ready, className }: HeroEmblemProps) {
  const { t } = useTranslation();
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!ready) return;
      const el = root.current;
      if (!el) return;
      const q = gsap.utils.selector(el);
      const piece = (id: string) => q(`[data-piece="${id}"]`);
      // While the preloader is still on screen its mark flies into this spot, so the pieces stay put.
      const handoff = document.querySelector('[data-preloader]') !== null;
      const mm = gsap.matchMedia();

      mm.add(MOTION_OK, () => {
        const tl = gsap.timeline({ delay: 0.35 });
        tl.fromTo(
          q('[data-emblem-plate]'),
          { scaleY: 0 },
          { scaleY: 1, transformOrigin: '50% 100%', duration: 0.9, ease: 'power4.inOut' },
          0,
        )
          .from(q('[data-emblem-bar]'), { scaleX: 0, transformOrigin: '0% 50%', duration: 0.6, ease: 'power3.out' }, 0.6)
          .from(q('[data-emblem-since]'), { autoAlpha: 0, y: 8, duration: 0.6, ease: 'power3.out' }, 1.1);

        if (!handoff) {
          tl.from(piece('fBody'), { x: -40, autoAlpha: 0, duration: 0.7, ease: 'power3.out' }, 0.5)
            .from(piece('fStroke'), { x: -30, y: -20, autoAlpha: 0, duration: 0.7, ease: 'power3.out' }, 0.55)
            .from(piece('wBody'), { x: 50, autoAlpha: 0, duration: 0.75, ease: 'power3.out' }, 0.5)
            .from(piece('wBlock'), { y: 30, autoAlpha: 0, duration: 0.6, ease: 'power3.out' }, 0.65)
            .from([...piece('topBar'), ...piece('topBlock')], { y: -30, autoAlpha: 0, duration: 0.6, stagger: 0.08, ease: 'power4.out' }, 0.75)
            .from(piece('trowel'), { rotation: -30, autoAlpha: 0, transformOrigin: '0% 100%', duration: 0.8, ease: 'back.out(1.6)' }, 0.85);
        }

        // Idle: every few seconds the trowel taps, like a mason setting a brick.
        gsap
          .timeline({ repeat: -1, repeatDelay: 3.4, delay: 2.8 })
          .to(piece('trowel'), { rotation: -12, transformOrigin: '0% 100%', duration: 0.4, ease: 'power2.out' })
          .to(piece('trowel'), { rotation: 0, duration: 1, ease: 'elastic.out(1, 0.4)' });
      });

      mm.add(POINTER_FINE, () => {
        const onEnter = () => {
          Object.entries(SPREAD).forEach(([id, vars]) => {
            gsap.to(piece(id), { ...vars, duration: 0.5, ease: 'power3.out', overwrite: 'auto' });
          });
        };
        const onLeave = () => {
          gsap.to(q('[data-piece]:not([data-piece="trowel"])'), {
            x: 0,
            y: 0,
            duration: 0.9,
            ease: 'elastic.out(1, 0.5)',
            overwrite: 'auto',
          });
        };
        el.addEventListener('pointerenter', onEnter);
        el.addEventListener('pointerleave', onLeave);
        return () => {
          el.removeEventListener('pointerenter', onEnter);
          el.removeEventListener('pointerleave', onLeave);
        };
      });

      mm.add(MOTION_DESKTOP, () => {
        gsap.to(el, {
          y: -70,
          ease: 'none',
          scrollTrigger: { trigger: el.closest('section'), start: 'top top', end: 'bottom top', scrub: true },
        });
      });
    },
    { scope: root, dependencies: [ready], revertOnUpdate: true },
  );

  return (
    <div ref={root} aria-hidden className={cn('absolute z-10 will-change-transform', className)}>
      <div className="relative px-5 pb-4 pt-5 sm:px-7 sm:pb-5 sm:pt-6">
        <span data-emblem-plate className="absolute inset-0 bg-cream/95 shadow-[0_30px_60px_-30px_rgba(70,39,21,0.6)]" />
        <span data-emblem-bar className="shape-bar absolute -top-[5px] start-6 h-2.5 w-14 bg-terracotta" />
        <LogoMark data-hero-emblem-mark className="relative w-24 overflow-visible sm:w-32 lg:w-[clamp(7rem,10vw,10rem)]" />
        <p
          data-emblem-since
          className="relative mt-3 text-center text-[0.58rem] font-bold uppercase tracking-[0.42em] text-terracotta-600 rtl:text-xs rtl:tracking-normal"
        >
          {t('brand.since')}
        </p>
      </div>
    </div>
  );
}
