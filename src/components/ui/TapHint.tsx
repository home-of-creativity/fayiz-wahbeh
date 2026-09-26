import { useTranslation } from 'react-i18next';
import { ArrowUpRight, Plus } from 'lucide-react';
import { cn } from '@/utils/cn';

interface TapHintProps {
  kind: 'view' | 'explore';
  className?: string;
}

/**
 * Touch-screen stand-in for the desktop cursor badge: a small pill telling people the image opens.
 * Hidden wherever a real hover cursor exists.
 */
export function TapHint({ kind, className }: TapHintProps) {
  const { t } = useTranslation();
  const Icon = kind === 'explore' ? ArrowUpRight : Plus;

  return (
    <span
      aria-hidden
      className={cn(
        'pointer-events-none absolute bottom-3 end-3 z-10 inline-flex items-center gap-1.5 rounded-full bg-terracotta/95 py-1 pe-3 ps-1 text-[0.68rem] font-bold uppercase tracking-[0.14em] text-cream shadow-[0_10px_24px_-10px_rgba(70,39,21,0.7)] rtl:text-xs rtl:tracking-normal',
        '[@media(hover:hover)_and_(pointer:fine)]:hidden',
        className,
      )}
    >
      <span className="grid size-6 place-items-center rounded-full border border-cream/40">
        <Icon className={cn('size-3.5', kind === 'explore' && 'rtl:-scale-x-100')} strokeWidth={2} />
      </span>
      {t(`common.${kind}`)}
    </span>
  );
}
