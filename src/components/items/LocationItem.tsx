import { useTranslation } from 'react-i18next';
import { ArrowUpRight } from 'lucide-react';
import type { Location } from '@/types';
import { mapsHref } from '@/utils/format';
import { cn } from '@/utils/cn';

interface LocationItemProps {
  location: Location;
  index: number;
  active: boolean;
  onActivate: () => void;
}

export function LocationItem({ location, index, active, onActivate }: LocationItemProps) {
  const { t } = useTranslation();
  const key = `locations.items.${location.id}`;
  const detail = t(`${key}.detail`);

  return (
    <li>
      <a
        href={mapsHref(location.query)}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={onActivate}
        onFocus={onActivate}
        className={cn(
          'group flex items-start gap-5 border-b border-charcoal/15 py-6 transition-colors duration-500',
          active ? 'text-charcoal' : 'text-charcoal/70',
        )}
      >
        <span
          className={cn(
            'ltr-nums mt-1 text-xs font-bold tracking-[0.2em] transition-colors',
            active ? 'text-terracotta-600' : 'text-charcoal/40',
          )}
        >
          {String(index + 1).padStart(2, '0')}
        </span>
        <span className="flex-1">
          <span className="block text-xl font-bold text-charcoal">
            {t(`${key}.name`)}
            {detail && <span className="font-semibold text-charcoal-soft"> — {detail}</span>}
          </span>
          <span className="mt-1 block text-sm text-charcoal-soft">{t(`${key}.region`)}</span>
          <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-bold text-terracotta-600">
            {t('locations.open')}
            <ArrowUpRight
              aria-hidden
              className="size-4 transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5"
            />
            <span className="sr-only">({t('a11y.opensNewTab')})</span>
          </span>
        </span>
      </a>
    </li>
  );
}
