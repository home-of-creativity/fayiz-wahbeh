import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { ServiceItem } from '@/components/items/ServiceItem';
import { Button } from '@/components/ui/Button';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { services } from '@/data/services';
import { useReveal } from '@/hooks/useReveal';

export function Services() {
  const { t } = useTranslation();
  const root = useRef<HTMLElement>(null);
  useReveal(root);

  return (
    <section id="services" ref={root} tabIndex={-1} aria-labelledby="services-title" className="section-y relative bg-sand">
      <div className="container-x grid gap-14 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-32">
            <SectionHeading id="services-title" eyebrow={t('services.eyebrow')} title={t('services.title')} size="display" intro={t('services.text')} />
            <div data-reveal="fade-up" data-delay="0.2" className="mt-10">
              <Button href="#contact" variant="secondary">
                {t('services.cta')}
              </Button>
            </div>
          </div>
        </div>

        <ul className="border-t border-charcoal/15 lg:col-span-7">
          {services.map((service, index) => (
            <ServiceItem key={service.id} service={service} index={index} />
          ))}
        </ul>
      </div>
    </section>
  );
}
