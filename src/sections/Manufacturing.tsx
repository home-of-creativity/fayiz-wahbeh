import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Picture } from '@/components/ui/Picture';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { images } from '@/data/images';
import { useReveal } from '@/hooks/useReveal';
import { tItems } from '@/i18n';

export function Manufacturing() {
  const { t } = useTranslation();
  const root = useRef<HTMLElement>(null);
  useReveal(root);
  const steps = tItems('manufacturing.steps');

  return (
    <section
      id="manufacturing"
      data-cursor-theme="dark"
      ref={root}
      tabIndex={-1}
      aria-labelledby="manufacturing-title"
      className="relative isolate overflow-hidden bg-brown-800 text-cream [clip-path:polygon(0_3.5vw,100%_0,100%_100%,0_100%)]"
    >
      <div className="absolute inset-0 -z-10">
        <div data-parallax="8" className="absolute inset-x-0 -bottom-[14%] -top-[14%] will-change-transform">
          <Picture image={images.factoryLine} alt={t('manufacturing.imageAlt')} sizes="100vw" className="h-full w-full object-cover" />
        </div>
        <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-brown-800 via-brown-800/60 to-brown-800/15" />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-r from-brown-800/75 via-brown-800/20 to-transparent rtl:bg-gradient-to-l" />
      </div>

      <div className="container-x flex min-h-[92svh] flex-col justify-end pb-16 pt-44 lg:pb-24">
        <SectionHeading
          id="manufacturing-title"
          tone="light"
          eyebrow={t('manufacturing.eyebrow')}
          title={t('manufacturing.title')}
          size="display-xl"
          className="max-w-4xl"
        />
        <p data-reveal="fade-up" className="text-lead mt-6 max-w-xl text-cream/80">
          {t('manufacturing.text')}
        </p>

        <ol data-stagger className="mt-14 grid border-t border-cream/20 sm:grid-cols-3">
          {steps.map((step, index) => (
            <li key={step.title} className="border-b border-cream/15 py-6 sm:border-b-0 sm:pe-8 sm:pt-7">
              <span className="ltr-nums text-xs font-bold tracking-[0.25em] text-terracotta-300">
                {String(index + 1).padStart(2, '0')}
              </span>
              <h3 className="mt-3 text-lg font-bold">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-cream/70">{step.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
