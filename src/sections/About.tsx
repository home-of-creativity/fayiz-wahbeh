import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { AnimatedImage } from '@/components/ui/AnimatedImage';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { images } from '@/data/images';
import { useReveal } from '@/hooks/useReveal';
import { tList } from '@/i18n';

export function About() {
  const { t } = useTranslation();
  const root = useRef<HTMLElement>(null);
  useReveal(root);
  const audiences = tList('about.audiences');

  return (
    <section id="about" ref={root} tabIndex={-1} aria-labelledby="about-title" className="section-y relative overflow-hidden bg-cream">
      <div className="container-x grid items-center gap-20 lg:grid-cols-12 lg:gap-10">
        {/* Visual */}
        <div className="relative pb-12 lg:col-span-6 lg:pb-16 xl:col-span-7">
          <div
            aria-hidden
            data-reveal="fade-in"
            className="absolute -start-[var(--gutter)] bottom-0 top-[22%] w-[82%] bg-sand"
          />
          <AnimatedImage
            image={images.craftsman}
            alt={t('about.imageAlt')}
            sizes="(min-width: 1024px) 50vw, 90vw"
            className="relative aspect-[4/5] w-[84%] sm:aspect-[5/6]"
            reveal="up"
            scrubScale
            drift
            cursor="view"
          />
          <AnimatedImage
            image={images.villaEntrance}
            alt={t('about.detailAlt')}
            sizes="(min-width: 1024px) 22vw, 45vw"
            className="absolute bottom-0 end-0 aspect-[4/5] w-[42%] border-[8px] border-cream shadow-[0_40px_80px_-40px_rgba(70,39,21,0.6)] sm:border-[10px]"
            reveal="end"
            delay={0.25}
          />
        </div>

        {/* Story */}
        <div className="lg:col-span-6 xl:col-span-5">
          <SectionHeading id="about-title" eyebrow={t('about.eyebrow')} title={t('about.title')} />
          <p data-reveal="slide-end" className="text-lead mt-8 font-medium text-charcoal">
            {t('about.lead')}
          </p>
          <p data-reveal="slide-end" data-delay="0.1" className="mt-5 leading-relaxed text-charcoal-soft">
            {t('about.text')}
          </p>

          <div className="mt-12 flex items-end gap-6 border-t border-charcoal/15 pt-8">
            <span data-split className="ltr-nums text-outline text-[clamp(4.5rem,9vw,7.5rem)] font-extrabold leading-[0.8] tracking-[-0.04em] text-terracotta">
              1970
            </span>
            <div data-reveal="fade-up" data-delay="0.2" className="pb-1">
              <p className="text-eyebrow text-charcoal/50">{t('about.yearLabel')}</p>
              <p className="mt-2 text-lg font-bold text-charcoal">{t('about.founded')}</p>
            </div>
          </div>

          <div className="mt-10">
            <p data-reveal="fade-in" className="text-eyebrow text-charcoal/50">
              {t('about.audiencesTitle')}
            </p>
            <ul data-stagger className="mt-4 flex flex-wrap gap-2">
              {audiences.map((audience) => (
                <li key={audience} className="border border-charcoal/15 px-3.5 py-2 text-sm font-semibold text-charcoal">
                  {audience}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Decorative rule drawn across the section */}
      <div aria-hidden className="container-x mt-20 lg:mt-28">
        <div className="relative h-px bg-charcoal/10">
          <span data-line className="origin-start absolute inset-0 bg-terracotta" />
          <span className="shape-bar absolute -top-[3px] end-0 h-[7px] w-10 bg-brown" />
        </div>
      </div>
    </section>
  );
}
