import { lazy, Suspense, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { gsap, useGSAP } from '@/animations/gsap';
import { dirSign, MOTION_DESKTOP } from '@/animations/motion';
import { GalleryFigure } from '@/components/items/GalleryFigure';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { gallery } from '@/data/content';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { useReveal } from '@/hooks/useReveal';

const GallerySlider = lazy(() => import('./GallerySlider'));

const [colonnade, tiles, commercial, stack, corridor, catalog, kitchen] = gallery;

/** Editorial, overlapping composition for large screens. */
function EditorialGallery() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_DESKTOP, () => {
        // The last row drifts sideways as it passes through the viewport.
        gsap.fromTo(
          '[data-drift]',
          { x: 0 },
          {
            x: () => -window.innerWidth * 0.12 * dirSign(),
            ease: 'none',
            scrollTrigger: { trigger: '[data-drift]', start: 'top bottom', end: 'bottom top', scrub: true, invalidateOnRefresh: true },
          },
        );
      });
    },
    { scope: root },
  );

  return (
    <div ref={root}>
      <div className="container-x">
        <div className="grid grid-cols-12 items-start gap-6">
          <GalleryFigure item={colonnade} className="col-span-7" frameClassName="aspect-[16/10]" sizes="56vw" parallax={5} />
          <GalleryFigure item={tiles} className="col-span-4 col-start-9 mt-28" frameClassName="aspect-[4/5]" sizes="32vw" reveal="down" />
        </div>
        <div className="-mt-10 grid grid-cols-12 items-start gap-6">
          <GalleryFigure item={commercial} className="col-span-4 col-start-2" frameClassName="aspect-[3/4]" sizes="32vw" reveal="start" parallax={6} />
          <GalleryFigure item={stack} className="col-span-5 col-start-7 mt-40" frameClassName="aspect-[4/3]" sizes="40vw" reveal="end" />
        </div>
      </div>
      <div className="mt-24 overflow-x-clip">
        <div data-drift className="flex items-end gap-6 ps-[var(--gutter)]" style={{ width: '118%' }}>
          <GalleryFigure item={corridor} className="w-[46%] shrink-0" frameClassName="aspect-[21/11]" sizes="55vw" reveal="start" />
          <GalleryFigure item={catalog} className="w-[20%] shrink-0" frameClassName="aspect-square" sizes="24vw" reveal="up" />
          <GalleryFigure item={kitchen} className="w-[28%] shrink-0" frameClassName="aspect-[4/5]" sizes="34vw" reveal="down" />
        </div>
      </div>
    </div>
  );
}

export function Gallery() {
  const { t } = useTranslation();
  const root = useRef<HTMLElement>(null);
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  useReveal(root);

  return (
    <section id="gallery" ref={root} tabIndex={-1} aria-labelledby="gallery-title" className="section-y overflow-hidden bg-cream">
      <div className="container-x">
        <div className="mb-16 grid gap-8 lg:mb-24 lg:grid-cols-12 lg:items-end">
          <SectionHeading id="gallery-title" eyebrow={t('gallery.eyebrow')} title={t('gallery.title')} size="display" className="lg:col-span-7" />
          <p data-reveal="fade-up" className="text-lead text-charcoal-soft lg:col-span-4 lg:col-start-9">
            {t('gallery.intro')}
          </p>
        </div>
      </div>

      {isDesktop ? (
        <EditorialGallery />
      ) : (
        <div className="container-x">
          <Suspense fallback={<div className="aspect-[4/5] w-[86%] bg-stone/40" />}>
            <GallerySlider />
          </Suspense>
        </div>
      )}
    </section>
  );
}
