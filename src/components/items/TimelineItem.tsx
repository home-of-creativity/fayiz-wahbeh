import { useTranslation } from 'react-i18next';
import type { Milestone } from '@/types';

interface TimelineItemProps {
  milestone: Milestone;
}

export function TimelineItem({ milestone }: TimelineItemProps) {
  const { t } = useTranslation();
  const year = milestone.year ?? t('legacy.today');

  return (
    <li data-milestone className="group relative ps-10 lg:ps-0 lg:pe-4 lg:pt-14">
      <span
        aria-hidden
        className="absolute start-0 top-2 size-[0.9rem] rounded-full border-2 border-cream/35 bg-brown transition-colors duration-500 group-[.is-active]:border-terracotta group-[.is-active]:bg-terracotta lg:top-0"
      />
      <p className="ltr-nums text-[clamp(2.25rem,3.6vw,3.5rem)] font-extrabold leading-none tracking-[-0.03em] text-cream/35 transition-colors duration-500 group-[.is-active]:text-cream rtl:tracking-normal">
        {year}
      </p>
      <h3 className="mt-4 text-lg font-bold text-cream">{t(`legacy.items.${milestone.id}.title`)}</h3>
      <p className="mt-2 max-w-xs text-sm leading-relaxed text-cream/65">{t(`legacy.items.${milestone.id}.text`)}</p>
    </li>
  );
}
