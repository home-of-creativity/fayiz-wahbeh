import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { gsap, useGSAP } from '@/animations/gsap';
import { dirSign, MOTION_DESKTOP, MOTION_OK } from '@/animations/motion';
import { splitForReveal } from '@/animations/text';
import { HeroEmblem } from '@/components/HeroEmblem';
import { Button } from '@/components/ui/Button';
import { GridLines } from '@/components/ui/GridLines';
import { MagneticButton } from '@/components/ui/MagneticButton';
import { Picture } from '@/components/ui/Picture';
import { TapHint } from '@/components/ui/TapHint';
import { Eyebrow } from '@/components/ui/SectionHeading';
import { images } from '@/data/images';
import { useIntroReady } from '@/hooks/useIntro';
import { tList } from '@/i18n';

export function Hero() {
  const { t } = useTranslation();
  const ready = useIntroReady();
  const root = useRef<HTMLElement>(null);
  const trust = tList('hero.trust');

  useGSAP(
    () => {
      if (!ready) return;
      const el = root.current;
      if (!el) return;
      const q = gsap.utils.selector(el);
      const mm = gsap.matchMedia();

      mm.add(MOTION_OK, () => {
        const lines = q('[data-hero-line]').map((line) => splitForReveal(line as HTMLElement, true));
        const openFrom = dirSign() === 1 ? 'inset(0% 0% 0% 100%)' : 'inset(0% 100% 0% 0%)';

        const tl = gsap.timeline({ defaults: { ease: 'power4.out' }, delay: 0.05 });
        tl.fromTo(q('[data-hero-media]'), { clipPath: openFrom }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.6, ease: 'power4.inOut' }, 0)
          .fromTo(q('[data-hero-img]'), { scale: 1.25 }, { scale: 1, duration: 2.2, ease: 'power3.out' }, 0)
          .from(q('[data-gridline]'), { scaleY: 0, transformOrigin: '50% 0%', duration: 1.4, stagger: 0.08, ease: 'power3.inOut' }, 0)
          .from(q('[data-hero-deco]'), { autoAlpha: 0, scale: 0.85, duration: 1.6, stagger: 0.12, ease: 'power3.out' }, 0.2)
          .from(q('[data-hero-eyebrow]'), { autoAlpha: 0, y: 16, duration: 0.8 }, 0.3);

        lines.forEach((line, i) => {
          tl.from(line.targets, { yPercent: 115, duration: 1.1, stagger: line.targets.length > 8 ? 0.022 : 0.08 }, 0.4 + i * 0.22);
        });

        tl.from(q('[data-hero-text]'), { autoAlpha: 0, y: 24, duration: 1 }, 0.95)
          .from(q('[data-hero-cta] > *'), { autoAlpha: 0, y: 20, stagger: 0.1, duration: 0.9 }, 1.05)
          .from(q('[data-hero-trust] li'), { autoAlpha: 0, y: 14, stagger: 0.07, duration: 0.8 }, 1.2)
          .from(q('[data-hero-detail]'), { autoAlpha: 0, y: 70, duration: 1.3, ease: 'power3.out' }, 0.95);

        return () => lines.forEach((line) => line.revert());
      });

      mm.add(MOTION_DESKTOP, () => {
        const scrollTrigger = { trigger: el, start: 'top top', end: 'bottom top', scrub: true };
        gsap.to(q('[data-hero-parallax]'), { yPercent: -10, ease: 'none', scrollTrigger });
        gsap.to(q('[data-hero-detail-inner]'), { y: -110, ease: 'none', scrollTrigger });
        gsap.to(q('[data-hero-copy]'), { yPercent: -8, ease: 'none', scrollTrigger });
        gsap.to(q('[data-hero-ring]'), { rotation: 40 * dirSign(), ease: 'none', scrollTrigger });
      });
    },
    { scope: root, dependencies: [ready], revertOnUpdate: true },
  );

  return (
    <section
      id="home"
      ref={root}
      tabIndex={-1}
      aria-labelledby="hero-title"
      className="relative isolate flex flex-col overflow-hidden bg-cream pb-10 pt-[76px] text-charcoal lg:h-[max(100svh,720px)] lg:max-h-[1040px] lg:flex-row lg:pb-0 lg:pt-[124px]"
    >
      <GridLines className="text-charcoal" />

      {/* Construction circles */}
      <div
        data-hero-deco
        aria-hidden
        className="pointer-events-none absolute -start-[18vw] top-[18%] -z-10 aspect-square w-[62vw] max-w-[760px] rounded-full border border-terracotta/15 lg:-start-[8vw] lg:w-[46vw]"
      >
        <span data-hero-ring className="absolute inset-[12%] rounded-full border border-dashed border-charcoal/10" />
      </div>

      {/* Main architectural visual */}
      <div className="mask-slant relative mx-[var(--gutter)] mt-10 aspect-[4/3] sm:aspect-[16/10] lg:absolute lg:inset-y-0 lg:end-0 lg:m-0 lg:aspect-auto lg:w-[56%]">
        <div
          data-hero-media
          data-cursor="view"
          role="button"
          tabIndex={0}
          aria-label={`${t('a11y.viewImage')}: ${t('hero.imageAlt')}`}
          className="absolute inset-0 overflow-hidden bg-stone"
        >
        <div data-hero-parallax className="absolute inset-x-0 -bottom-[12%] top-0 will-change-transform">
          <Picture
            image={images.heroColonnade}
            alt={t('hero.imageAlt')}
            priority
            sizes="(min-width: 1024px) 56vw, 100vw"
            data-hero-img
            className="h-full w-full object-cover object-[100%_50%] lg:object-[72%_50%]"
          />
        </div>
        <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-brown/35 via-transparent to-transparent" />
        <p className="text-eyebrow absolute bottom-6 end-6 hidden text-cream/90 lg:block [@media(hover:none)]:!hidden">{t('hero.caption')}</p>
        <TapHint kind="view" />
        </div>
        <HeroEmblem ready={ready} className="start-[11%] top-[9%] lg:start-[13%] lg:top-[19%]" />
      </div>

      {/* Copy */}
      {/* The full-width container overlaps the photo on desktop, so only the copy itself takes the pointer. */}
      <div className="container-x relative z-10 order-first flex lg:pointer-events-none lg:items-center">
        <div data-hero-copy className="w-full py-10 lg:pointer-events-auto lg:w-[44%] lg:py-16 xl:w-[42%]">
          <div data-hero-eyebrow>
            <Eyebrow>{t('hero.eyebrow')}</Eyebrow>
          </div>
          <h1 id="hero-title" className="text-display-xl mt-7 text-charcoal">
            <span data-hero-line className="block">
              {t('hero.titleLine1')}
            </span>
            <span data-hero-line className="block text-terracotta">
              {t('hero.titleLine2')}
            </span>
          </h1>
          <p data-hero-text className="text-lead mt-7 max-w-[34rem] text-charcoal-soft">
            {t('hero.text')}
          </p>
          <div data-hero-cta className="mt-9 flex flex-wrap items-center gap-3 sm:gap-4">
            <MagneticButton href="#products" size="lg">
              {t('hero.primary')}
            </MagneticButton>
            {/* Wrapped so the entrance tween never fights the button's own hover transition */}
            <span className="inline-flex">
              <Button href="#about" variant="secondary" size="lg">
                {t('hero.secondary')}
              </Button>
            </span>
          </div>
          <ul
            data-hero-trust
            aria-label={t('hero.trustLabel')}
            className="mt-10 grid grid-cols-2 gap-x-6 gap-y-3 border-t border-charcoal/15 pt-6 text-[0.8rem] font-semibold text-charcoal sm:max-w-md sm:gap-x-8"
          >
            {trust.map((item) => (
              <li key={item} className="flex items-center gap-2.5">
                <span aria-hidden className="shape-bar h-[6px] w-3 bg-terracotta" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Floating product detail crossing the image edge */}
      <div
        data-hero-detail
        className="absolute bottom-[7%] start-[39%] z-20 hidden w-[13vw] max-w-[220px] lg:block xl:start-[41%]"
        aria-hidden
      >
        <div data-hero-detail-inner className="border-[8px] border-cream bg-cream shadow-[0_30px_60px_-30px_rgba(70,39,21,0.55)]">
          <div className="aspect-[3/4] overflow-hidden">
            <Picture image={images.productTiles} alt="" sizes="220px" className="h-full w-full object-cover" />
          </div>
        </div>
      </div>

    </section>
  );
}
