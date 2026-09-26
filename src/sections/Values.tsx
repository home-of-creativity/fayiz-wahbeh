import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { ValueItem } from '@/components/items/ValueItem';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { values } from '@/data/content';
import { useReveal } from '@/hooks/useReveal';

export function Values() {
  const { t } = useTranslation();
  const root = useRef<HTMLElement>(null);
  useReveal(root);

  return (
    <section id="values" ref={root} tabIndex={-1} aria-labelledby="values-title" className="section-y bg-sand">
      <div className="container-x">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <SectionHeading id="values-title" eyebrow={t('values.eyebrow')} title={t('values.title')} className="lg:col-span-7" />
          <p data-reveal="fade-up" className="text-lead text-charcoal-soft lg:col-span-4 lg:col-start-9">
            {t('values.intro')}
          </p>
        </div>

        <div data-stagger="0.18" className="mt-16 grid border-t border-charcoal/15 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((value, index) => (
            <ValueItem key={value.id} value={value} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
