import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/utils/cn';

export type ButtonVariant = 'primary' | 'secondary' | 'light' | 'outline-light';
type ButtonSize = 'sm' | 'md' | 'lg';

interface BaseProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Trailing arrow (default) or a custom icon; `null` hides it. */
  icon?: ReactNode | null;
  className?: string;
  children: ReactNode;
}

type AnchorProps = BaseProps & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof BaseProps> & { href: string };
type NativeButtonProps = BaseProps & Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof BaseProps> & { href?: undefined };
export type ButtonProps = AnchorProps | NativeButtonProps;

const VARIANTS: Record<ButtonVariant, { base: string; fill: string; hoverText: string }> = {
  primary: { base: 'bg-terracotta text-white', fill: 'bg-brown', hoverText: '' },
  secondary: {
    base: 'border border-charcoal/30 text-charcoal',
    fill: 'bg-charcoal',
    hoverText: 'group-hover:text-cream',
  },
  light: { base: 'bg-cream text-brown', fill: 'bg-white', hoverText: '' },
  'outline-light': {
    base: 'border border-cream/40 text-cream',
    fill: 'bg-cream',
    hoverText: 'group-hover:text-brown',
  },
};

const SIZES: Record<ButtonSize, string> = {
  sm: 'h-10 px-4 text-[0.8rem] gap-2.5',
  md: 'h-12 px-6 text-sm gap-3',
  lg: 'h-14 px-7 text-[0.95rem] gap-3.5',
};

export function Button(props: ButtonProps) {
  const { variant = 'primary', size = 'md', icon, className, children, ...rest } = props;
  const style = VARIANTS[variant];

  const content = (
    <>
      <span
        aria-hidden
        className={cn(
          'absolute inset-0 translate-y-[101%] transition-transform duration-500 ease-premium group-hover:translate-y-0',
          style.fill,
        )}
      />
      <span className={cn('relative z-10 transition-colors duration-500', style.hoverText)}>{children}</span>
      {icon !== null && (
        <span className={cn('relative z-10 transition-colors duration-500', style.hoverText)}>
          {icon ?? (
            <ArrowRight
              aria-hidden
              className="size-4 transition-transform duration-500 ease-premium group-hover:translate-x-1 rtl:-scale-x-100 rtl:group-hover:-translate-x-1"
            />
          )}
        </span>
      )}
    </>
  );

  const classes = cn(
    'group relative inline-flex shrink-0 items-center justify-center overflow-hidden whitespace-nowrap font-bold tracking-wide',
    'transition-transform duration-500 ease-premium hover:scale-[1.015] active:scale-[0.985] disabled:pointer-events-none disabled:opacity-60',
    style.base,
    SIZES[size],
    className,
  );

  if (typeof rest.href === 'string') {
    const anchorProps = rest as Omit<AnchorProps, keyof BaseProps>;
    return (
      <a className={classes} {...anchorProps}>
        {content}
      </a>
    );
  }

  const buttonProps = rest as Omit<NativeButtonProps, keyof BaseProps>;
  return (
    <button type="button" className={classes} {...buttonProps}>
      {content}
    </button>
  );
}
