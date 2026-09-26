import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { gsap, ScrollTrigger, useGSAP } from '@/animations/gsap';
import { prefersReducedMotion } from '@/animations/motion';
import { ApplicationItem } from '@/components/items/ApplicationItem';
import { Picture } from '@/components/ui/Picture';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { applications } from '@/data/applications';
import { useReveal } from '@/hooks/useReveal';
import { cn } from '@/utils/cn';

export function Applications() {
  const { t } = useTranslation();
  const root = useRef<HTMLElement>(null);
  const desktop = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  useReveal(root);

  // Desktop: the sticky frame crossfades to the application currently in the middle of the viewport.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add('(min-width: 1024px)', () => {
        const el = desktop.current;
        if (!el) return;
        const steps = gsap.utils.toArray<HTMLElement>('[data-app-step]', el);
        const frames = gsap.utils.toArray<HTMLElement>('[data-app-image]', el);
        const duration = prefersReducedMotion() ? 0 : 1.1;
        let current = 0;

        gsap.set(frames, { autoAlpha: 0 });
        gsap.set(frames[0], { autoAlpha: 1 });
        steps[0]?.classList.add('is-active');

        const show = (index: number) => {
          if (index === current) return;
          gsap.to(frames[current], { autoAlpha: 0, scale: 1.04, duration, ease: 'power2.out' });
          gsap.fromTo(frames[index], { autoAlpha: 0, scale: 1.1 }, { autoAlpha: 1, scale: 1, duration: duration * 1.2, ease: 'power3.out' });
          steps.forEach((step, i) => step.classList.toggle('is-active', i === index));
          current = index;
          setActive(index);
        };

        steps.forEach((step, index) => {
          ScrollTrigger.create({
            trigger: step,
            start: 'top 55%',
            end: 'bottom 55%',
            onToggle: (self) => {
              if (self.isActive) show(index);
            },
          });
        });
      });
    },
    { scope: root },
  );

  return (
    <section id="applications" ref={root} tabIndex={-1} aria-labelledby="applications-title" className="section-y bg-cream">
      <div className="container-x">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <SectionHeading
            id="applications-title"
            eyebrow={t('applications.eyebrow')}
            title={t('applications.title')}
            size="display"
            className="lg:col-span-7"
          />
          <p data-reveal="fade-up" className="text-lead text-charcoal-soft lg:col-span-4 lg:col-start-9">
            {t('applications.intro')}
          </p>
        </div>

        {/* Desktop: scrolling titles + sticky image */}
        <div ref={desktop} className="mt-16 hidden lg:grid lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-5">
            {applications.map((application, index) => (
              <ApplicationItem key={application.id} application={application} index={index} variant="step" />
            ))}
          </div>
          <div className="lg:col-span-7">
            <div
              className="sticky top-[14vh] h-[72vh] overflow-hidden bg-stone/40"
              data-cursor="view"
              role="button"
              tabIndex={0}
              aria-label={`${t('a11y.viewImage')}: ${t(`applications.items.${applications[active]?.id}.alt`)}`}
            >
              {applications.map((application, index) => (
                <div key={application.id} data-app-image className={cn('absolute inset-0', index !== 0 && 'invisible opacity-0')}>
                  <Picture
                    image={application.image}
                    alt={t(`applications.items.${application.id}.alt`)}
                    sizes="58vw"
                    className="h-full w-full object-cover"
                  />
                </div>
              ))}
              <div aria-hidden className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-brown/60 to-transparent" />
              <p aria-hidden className="absolute bottom-6 start-6 end-6 flex items-end justify-between gap-6 text-cream">
                <span className="text-lg font-bold">{t(`applications.items.${applications[active]?.id}.title`)}</span>
                <span className="ltr-nums text-xs font-bold tracking-[0.2em]">
                  {String(active + 1).padStart(2, '0')} / {String(applications.length).padStart(2, '0')}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Mobile & tablet: stacked cards */}
        <div className="mt-14 grid gap-14 sm:grid-cols-2 sm:gap-x-8 lg:hidden">
          {applications.map((application, index) => (
            <ApplicationItem key={application.id} application={application} index={index} variant="card" />
          ))}
        </div>
      </div>
    </section>
  );
}
