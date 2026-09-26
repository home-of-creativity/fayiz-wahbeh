import type { SVGProps } from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/utils/cn';

type PieceColor = 'brown' | 'terracotta' | 'charcoal';
export type LogoTone = 'color' | 'onDark';

interface Piece {
  id: 'topBar' | 'topBlock' | 'fStroke' | 'fBody' | 'wBlock' | 'wBody' | 'trowel';
  color: PieceColor;
  points?: string;
  d?: string;
}

/** Shapes of the FW mark, extracted from the brand SVG (viewBox 40 40 448 218). */
export const LOGO_PIECES: Piece[] = [
  { id: 'topBar', color: 'brown', points: '105.9,47.5 267.3,47.5 273,78 95.1,78' },
  { id: 'topBlock', color: 'brown', points: '238.9,126.1 232.8,93.3 277.8,93.3 282.8,126.1' },
  { id: 'fStroke', color: 'terracotta', points: '79.1,136.9 91.7,95.3 133.3,95.3 117.8,160.4 73.9,157.7' },
  {
    id: 'fBody',
    color: 'terracotta',
    points: '177,136.9 171.6,160.4 117.8,160.4 92.5,249.1 49.6,249.1 79.1,136.9 99.5,136.9',
  },
  { id: 'wBlock', color: 'terracotta', points: '254.5,206.8 240.7,137.1 284,137.1 296.9,206.8' },
  {
    id: 'wBody',
    color: 'terracotta',
    points:
      '433.6,47.9 410.4,204.7 409.5,204.7 384.9,47.9 328.1,47.9 301,216.9 256.3,216.9 262.3,249.7 331.4,249.7 332.8,242.5 333.1,242.6 334.8,232.1 337.7,216.9 337.2,216.9 341.9,188 341.7,188 355.6,119.8 356.5,119.8 380.2,249 445,249 478.5,47.9',
  },
  {
    id: 'trowel',
    color: 'charcoal',
    d: 'M112.4,242.5c5.1-5.7,10.1-11.5,15.2-17.2c12-13.6,24-27.1,36-40.7c3-3.4,5-3.9,8.2-2.1c2.4,1.3,4.7,2.7,7.1,4c2.3,1.3,4,0.1,4.1-3.1c0.2-4.5,0.3-9,0.2-13.5c-0.1-2.6,0.6-4.3,3-5.4c2-0.9,3.3-2.4,3.9-4.9c0.5-2.2,2.1-3.8,4.1-4.9c9.5-4.9,18.9-9.9,28.4-14.9c4-2.1,5.1-1.7,6.7,2.2c0.2,0.5,0.4,1.1,0.6,1.6c1.3,3.4,0.4,5.6-3,7.4c-6.2,3.3-12.5,6.6-18.7,9.8c-2.9,1.5-5.9,3-8.8,4.6c-2.5,1.3-4.8,2.6-7.4,1.6c-1.9-0.7-4,1.7-4,4.1c0,3.9-0.1,7.8,0.1,11.6c0.1,3.1-0.9,5.4-3.5,7.5c-11.1,9-22.1,18.1-33.1,27.1c-0.9,0.7-1.7,1.5-2.4,2.5c6.8-4.5,13.6-9.1,20.3-13.6c6.2-4.2,12.4-8.3,18.6-12.5c1.4-0.9,2.3-0.9,3.5-0.2c3.7,2.2,7.5,4.3,11.2,6.4c1.4,0.8,3.5,1.6,2.5,4c-0.7,1.6-2.6,3.2-4.1,3.8c-9.9,4.1-19.8,7.9-29.6,11.8c-18.9,7.5-37.8,15-56.7,22.4c-0.8,0.3-1.6,0.6-2.3,0.9C112.5,242.8,112.5,242.6,112.4,242.5z',
  },
];

const PALETTE: Record<LogoTone, Record<PieceColor, string>> = {
  color: { brown: '#462715', terracotta: '#C04A2C', charcoal: '#3F3F3F' },
  onDark: { brown: '#E6D3C3', terracotta: '#D2583A', charcoal: '#F7F3ED' },
};

interface LogoMarkProps extends SVGProps<SVGSVGElement> {
  tone?: LogoTone;
  /** When set the mark is announced as an image; otherwise it is decorative. */
  title?: string;
}

export function LogoMark({ tone = 'color', title, className, ...rest }: LogoMarkProps) {
  const colors = PALETTE[tone];
  return (
    <svg
      viewBox="40 40 448 218"
      xmlns="http://www.w3.org/2000/svg"
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
      className={cn('block h-auto', className)}
      {...rest}
    >
      {title && <title>{title}</title>}
      {LOGO_PIECES.map((piece) =>
        piece.points ? (
          <polygon key={piece.id} data-piece={piece.id} points={piece.points} fill={colors[piece.color]} />
        ) : (
          <path key={piece.id} data-piece={piece.id} d={piece.d} fill={colors[piece.color]} />
        ),
      )}
    </svg>
  );
}

interface BrandLockupProps {
  tone?: LogoTone;
  className?: string;
  compact?: boolean;
}

/** Mark + live wordmark. The wordmark is real text so it can be translated. */
export function BrandLockup({ tone = 'color', className, compact = false }: BrandLockupProps) {
  const { t } = useTranslation();
  return (
    <span className={cn('inline-flex items-center gap-3', className)}>
      <LogoMark tone={tone} className={compact ? 'w-12' : 'w-14 sm:w-16'} />
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            'text-[0.95rem] font-extrabold uppercase tracking-[0.16em] rtl:tracking-normal rtl:text-[1.05rem]',
            tone === 'onDark' ? 'text-cream' : 'text-charcoal',
          )}
        >
          {t('brand.name')}
        </span>
        <span
          className={cn(
            'mt-1.5 text-[0.62rem] font-bold uppercase tracking-[0.34em] rtl:tracking-normal rtl:text-[0.72rem]',
            tone === 'onDark' ? 'text-terracotta-300' : 'text-terracotta-600',
          )}
        >
          {t('brand.since')}
        </span>
      </span>
    </span>
  );
}
