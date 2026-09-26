import { useTranslation } from 'react-i18next';
import { ArrowUpRight } from 'lucide-react';
import type { Service } from '@/types';

interface ServiceItemProps {
  service: Service;
  index: number;
}

export function ServiceItem({ service, index }: ServiceItemProps) {
  const { t } = useTranslation();
  const Icon = service.icon;

  return (
    <li data-reveal="fade-up" className="group relative border-b border-charcoal/15">
      <span
        aria-hidden
        className="absolute inset-0 -z-0 origin-bottom scale-y-0 bg-cream/80 transition-transform duration-500 ease-premium group-hover:scale-y-100"
      />
      <div className="relative grid grid-cols-[auto_1fr] items-start gap-5 py-8 sm:grid-cols-[auto_auto_1fr_auto] sm:gap-7 sm:px-4 sm:py-10">
        <span className="ltr-nums hidden pt-3 text-xs font-bold tracking-[0.2em] text-charcoal/40 sm:block">
          {String(index + 1).padStart(2, '0')}
        </span>
        <span className="grid size-12 place-items-center border border-charcoal/15 text-terracotta transition-colors duration-500 group-hover:border-terracotta group-hover:bg-terracotta group-hover:text-cream">
          <Icon aria-hidden className="size-5" strokeWidth={1.6} />
        </span>
        <div>
          <h3 className="text-[1.35rem] font-bold leading-snug text-charcoal sm:text-2xl">{t(`services.items.${service.id}.name`)}</h3>
          <p className="mt-2 max-w-md leading-relaxed text-charcoal-soft">{t(`services.items.${service.id}.text`)}</p>
        </div>
        <ArrowUpRight
          aria-hidden
          className="hidden size-6 text-charcoal/30 transition-all duration-500 ease-premium group-hover:rotate-45 group-hover:text-terracotta rtl:-scale-x-100 rtl:group-hover:-rotate-45 sm:block"
        />
      </div>
    </li>
  );
}
