import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { gsap, useGSAP } from '@/animations/gsap';
import { MOTION_DESKTOP, MOTION_OK } from '@/animations/motion';
import { Button } from '@/components/ui/Button';
import { LogoMark } from '@/components/ui/LogoMark';
import { MagneticButton } from '@/components/ui/MagneticButton';
import { Picture } from '@/components/ui/Picture';
import { images } from '@/data/images';
import { useReveal } from '@/hooks/useReveal';

export function FinalCTA() {
  const { t } = useTranslation();
  const root = useRef<HTMLElement>(null);
  useReveal(root);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.fromTo(
          '[data-cta-img]',
          { scale: 1.2 },
          { scale: 1, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom bottom', scrub: true } },
        );
      });
      // The frame opens from an inset card to full-bleed as it arrives.
      mm.add(MOTION_DESKTOP, () => {
        gsap.fromTo(
          '[data-cta-frame]',
          { clipPath: 'inset(7% 5% 7% 5%)' },
          {
            clipPath: 'inset(0% 0% 0% 0%)',
            ease: 'none',
            scrollTrigger: { trigger: root.current, start: 'top 90%', end: 'top 15%', scrub: true },
          },
        );
      });
    },
    { scope: root },
  );

  return (
    <section id="cta" ref={root} aria-labelledby="cta-title" className="relative bg-cream">
      <div data-cta-frame data-cursor-theme="dark" className="relative isolate flex min-h-[86svh] items-center overflow-hidden bg-brown-800 text-cream">
        <div className="absolute inset-0 -z-10">
          <Picture image={images.modernColonnade} alt={t('cta.imageAlt')} sizes="100vw" data-cta-img className="h-full w-full object-cover" />
          <div aria-hidden className="absolute inset-0 bg-brown-800/60" />
          <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-brown-800/80 via-transparent to-brown-800/40" />
        </div>

        <div className="container-x py-32 text-center">
          <div data-reveal="fade-in" className="flex justify-center">
            <LogoMark tone="onDark" className="w-16" />
          </div>
          <h2 id="cta-title" data-split className="text-display-xl mx-auto mt-10 max-w-4xl">
            {t('cta.title')}
          </h2>
          <p data-reveal="fade-up" data-delay="0.2" className="text-lead mx-auto mt-6 max-w-xl text-cream/80">
            {t('cta.text')}
          </p>
          <div data-reveal="fade-up" data-delay="0.35" className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <MagneticButton href="#contact" size="lg">
              {t('cta.primary')}
            </MagneticButton>
            <Button href="#leadership" variant="outline-light" size="lg">
              {t('cta.secondary')}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
