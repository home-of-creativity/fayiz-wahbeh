import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { gsap, useGSAP } from '@/animations/gsap';
import { MOTION_OK } from '@/animations/motion';
import { TimelineItem } from '@/components/items/TimelineItem';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { milestones } from '@/data/content';
import { useReveal } from '@/hooks/useReveal';

export function Legacy() {
  const { t } = useTranslation();
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  useReveal(root);

  useGSAP(
    () => {
      const list = track.current;
      if (!list) return;
      const items = gsap.utils.toArray<HTMLElement>('[data-milestone]', list);
      const setActive = (progress: number) =>
        items.forEach((item, i) => item.classList.toggle('is-active', progress >= i / (items.length - 1) - 0.02));

      const mm = gsap.matchMedia();
      mm.add(
        { motion: MOTION_OK, desktop: '(min-width: 1024px)' },
        (context) => {
          const { motion, desktop } = context.conditions ?? {};
          if (!motion) {
            setActive(1);
            return;
          }
          const fill = list.querySelector<HTMLElement>(desktop ? '[data-progress-x]' : '[data-progress-y]');
          gsap.fromTo(
            fill,
            desktop ? { scaleX: 0 } : { scaleY: 0 },
            {
              ...(desktop ? { scaleX: 1 } : { scaleY: 1 }),
              ease: 'none',
              scrollTrigger: {
                trigger: list,
                start: desktop ? 'top 78%' : 'top 70%',
                end: desktop ? 'bottom 45%' : 'bottom 60%',
                scrub: 0.6,
                onUpdate: (self) => setActive(self.progress),
                onLeaveBack: () => setActive(-1),
              },
            },
          );
          gsap.from(items, {
            y: 40,
            autoAlpha: 0,
            duration: 0.9,
            stagger: 0.1,
            ease: 'power3.out',
            scrollTrigger: { trigger: list, start: 'top 85%', toggleActions: 'play none none none' },
          });
        },
      );
    },
    { scope: root },
  );

  return (
    <section
      id="legacy"
      data-cursor-theme="dark"
      ref={root}
      tabIndex={-1}
      aria-labelledby="legacy-title"
      className="section-y grain relative isolate overflow-hidden bg-brown text-cream"
    >
      <p
        aria-hidden
        data-parallax="12"
        className="ltr-nums text-outline pointer-events-none absolute -end-[4vw] top-10 -z-10 select-none text-[30vw] font-extrabold leading-none tracking-[-0.05em] text-cream/[0.07]"
      >
        1970
      </p>

      <div className="container-x">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <SectionHeading
            id="legacy-title"
            tone="light"
            eyebrow={t('legacy.eyebrow')}
            title={t('legacy.title')}
            size="display"
            className="lg:col-span-7"
          />
          <p data-reveal="fade-up" className="text-lead text-cream/70 lg:col-span-4 lg:col-start-9">
            {t('legacy.intro')}
          </p>
        </div>

        <div ref={track} className="relative mt-20 lg:mt-28">
          <div aria-hidden className="absolute inset-x-0 top-[0.4rem] hidden h-px bg-cream/15 lg:block">
            <span data-progress-x className="origin-start block h-full w-full bg-terracotta" />
          </div>
          <div aria-hidden className="absolute bottom-0 start-[0.4rem] top-2 w-px bg-cream/15 lg:hidden">
            <span data-progress-y className="block h-full w-full origin-top bg-terracotta" />
          </div>
          <ol className="relative grid gap-12 lg:grid-cols-6 lg:gap-0">
            {milestones.map((milestone) => (
              <TimelineItem key={milestone.id} milestone={milestone} />
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
