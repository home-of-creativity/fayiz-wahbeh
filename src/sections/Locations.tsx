import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LocationItem } from '@/components/items/LocationItem';
import { LocationMap } from '@/components/LocationMap';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { locations } from '@/data/content';
import { useReveal } from '@/hooks/useReveal';
import type { Location } from '@/types';

export function Locations() {
  const { t } = useTranslation();
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState<Location['id']>(locations[0].id);
  useReveal(root);

  return (
    <section id="locations" ref={root} tabIndex={-1} aria-labelledby="locations-title" className="section-y bg-cream">
      <div className="container-x grid gap-14 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-5">
          <SectionHeading id="locations-title" eyebrow={t('locations.eyebrow')} title={t('locations.title')} intro={t('locations.intro')} />
          <ul data-stagger className="mt-10 border-t border-charcoal/15">
            {locations.map((location, index) => (
              <LocationItem
                key={location.id}
                location={location}
                index={index}
                active={active === location.id}
                onActivate={() => setActive(location.id)}
              />
            ))}
          </ul>
        </div>
        <div data-reveal="fade-up" className="lg:col-span-7 lg:pt-6">
          <div className="lg:sticky lg:top-32">
            <LocationMap active={active} onSelect={setActive} />
          </div>
        </div>
      </div>
    </section>
  );
}
