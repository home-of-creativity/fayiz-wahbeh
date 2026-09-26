import { cn } from '@/utils/cn';

interface GridLinesProps {
  className?: string;
  columns?: number;
}

/** Faint construction-grid columns aligned to the page container. */
export function GridLines({ className, columns = 4 }: GridLinesProps) {
  return (
    <div aria-hidden className={cn('pointer-events-none absolute inset-0', className)}>
      <div className="container-x flex h-full">
        {Array.from({ length: columns }, (_, i) => (
          <span
            key={i}
            data-gridline
            className={cn('h-full flex-1 border-s border-current opacity-[0.07]', i === columns - 1 && 'border-e')}
          />
        ))}
      </div>
    </div>
  );
}
