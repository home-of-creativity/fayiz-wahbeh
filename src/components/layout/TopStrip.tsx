import { forwardRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Mail, Phone } from 'lucide-react';
import { EMAIL, people } from '@/data/content';
import { formatPhone, telHref } from '@/utils/format';

/** Minimal desktop contact strip above the navigation. */
export const TopStrip = forwardRef<HTMLDivElement>(function TopStrip(_props, ref) {
  const { t } = useTranslation();

  return (
    <div ref={ref} className="hidden overflow-hidden border-b border-charcoal/10 bg-cream lg:block">
      <div className="container-x flex h-9 items-center justify-between text-[0.75rem] text-charcoal-soft">
        <p className="font-semibold tracking-wide">
          {t('brand.tagline')} <span className="mx-2 text-terracotta">·</span> {t('brand.since')}
        </p>
        <ul className="flex items-center gap-6">
          {people.map((person) => (
            <li key={person.id}>
              <a href={telHref(person.phone)} className="group inline-flex items-center gap-2 transition-colors hover:text-terracotta">
                <Phone aria-hidden className="size-3.5 text-terracotta" />
                <span>{t(`people.${person.id}`)}</span>
                <span className="ltr-nums font-semibold text-charcoal group-hover:text-terracotta">{formatPhone(person.phone)}</span>
              </a>
            </li>
          ))}
          <li>
            <a href={`mailto:${EMAIL}`} className="inline-flex items-center gap-2 font-semibold text-charcoal transition-colors hover:text-terracotta">
              <Mail aria-hidden className="size-3.5 text-terracotta" />
              <span className="ltr-nums">{EMAIL}</span>
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
});
