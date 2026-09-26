import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { gsap, useGSAP } from '@/animations/gsap';
import { MOTION_OK } from '@/animations/motion';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { useReveal } from '@/hooks/useReveal';
import { tItems } from '@/i18n';
import tileTexture from '@/assets/images/contact/roof-tiles-closeup.png?texture';

export function WhyChooseUs() {
  const { t } = useTranslation();
  const root = useRef<HTMLElement>(null);
  const year = useRef<HTMLParagraphElement>(null);
  const reasons = tItems('why.items');
  useReveal(root);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.fromTo(
          year.current,
          { clipPath: 'inset(100% 0% 0% 0%)', y: 60, backgroundPosition: '100% 0%' },
          {
            clipPath: 'inset(0% 0% 0% 0%)',
            y: 0,
            backgroundPosition: '100% 35%',
            duration: 1.6,
            ease: 'power4.out',
            scrollTrigger: { trigger: year.current, start: 'top 85%', toggleActions: 'play none none none' },
          },
        );
      });
    },
    { scope: root },
  );

  return (
    <section
      id="why-us"
      data-cursor-theme="dark"
      ref={root}
      tabIndex={-1}
      aria-labelledby="why-title"
      className="section-y relative isolate overflow-hidden bg-brown-700 text-cream"
    >
      <div aria-hidden className="brick-pattern absolute inset-0 -z-10 text-cream opacity-[0.035]" />

      <div className="container-x">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <SectionHeading id="why-title" tone="light" eyebrow={t('why.eyebrow')} title={t('why.title')} size="display" className="lg:col-span-7" />
          <p data-reveal="fade-up" className="text-lead text-cream/70 lg:col-span-4 lg:col-start-9">
            {t('why.intro')}
          </p>
        </div>

        <div className="mt-16 grid gap-14 lg:mt-24 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <p data-reveal="fade-in" className="text-eyebrow text-terracotta-300">
              {t('why.yearLabel')}
            </p>
            <p
              ref={year}
              className="year-fill ltr-nums mt-4 text-[clamp(6.5rem,19vw,16rem)] font-extrabold leading-[0.82] tracking-[-0.06em]"
              style={{ backgroundImage: `url(${tileTexture})` }}
            >
              1970
            </p>
            <p data-reveal="fade-up" className="mt-8 max-w-sm leading-relaxed text-cream/70">
              {t('why.yearText')}
            </p>
          </div>

          <ul data-stagger className="grid border-t border-cream/15 sm:grid-cols-2 lg:col-span-7">
            {reasons.map((reason, index) => (
              <li key={reason.title} className="border-b border-cream/15 py-8 sm:px-7 sm:odd:border-e sm:odd:ps-0">
                <span className="ltr-nums text-xs font-bold tracking-[0.2em] text-terracotta-300">
                  {String(index + 2).padStart(2, '0')}
                </span>
                <h3 className="mt-3 text-xl font-bold">{reason.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-cream/65">{reason.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
