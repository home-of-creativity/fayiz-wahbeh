import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';

interface EyebrowProps {
  children: ReactNode;
  tone?: 'dark' | 'light';
  className?: string;
}

/** Small uppercase label led by the trapezoid bar from the logo. */
export function Eyebrow({ children, tone = 'dark', className }: EyebrowProps) {
  return (
    <p
      className={cn(
        'text-eyebrow flex items-center gap-3',
        tone === 'dark' ? 'text-terracotta-600' : 'text-terracotta-300',
        className,
      )}
    >
      <span aria-hidden className="shape-bar h-[7px] w-7 shrink-0 bg-current" />
      {children}
    </p>
  );
}

const TITLE_SIZES = {
  h2: 'text-h2',
  display: 'text-display',
  'display-xl': 'text-display-xl',
} as const;

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  intro?: string;
  id?: string;
  tone?: 'dark' | 'light';
  size?: keyof typeof TITLE_SIZES;
  className?: string;
  titleClassName?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  intro,
  id,
  tone = 'dark',
  size = 'h2',
  className,
  titleClassName,
}: SectionHeadingProps) {
  return (
    <div className={className}>
      <div data-reveal="fade-in">
        <Eyebrow tone={tone}>{eyebrow}</Eyebrow>
      </div>
      <h2
        id={id}
        data-split
        className={cn(
          TITLE_SIZES[size],
          'mt-6 text-balance',
          tone === 'dark' ? 'text-charcoal' : 'text-cream',
          titleClassName,
        )}
      >
        {title}
      </h2>
      {intro && (
        <p
          data-reveal="fade-up"
          data-delay="0.15"
          className={cn('text-lead mt-6 max-w-xl', tone === 'dark' ? 'text-charcoal-soft' : 'text-cream/70')}
        >
          {intro}
        </p>
      )}
    </div>
  );
}
