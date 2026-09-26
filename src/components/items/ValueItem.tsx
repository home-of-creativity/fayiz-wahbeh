import { useTranslation } from 'react-i18next';
import { Picture } from '@/components/ui/Picture';
import type { Value } from '@/types';
import { cn } from '@/utils/cn';

interface ValueItemProps {
  value: Value;
  index: number;
}

export function ValueItem({ value, index }: ValueItemProps) {
  const { t } = useTranslation();
  // Alternate image position to give the row an editorial rhythm.
  const imageFirst = index % 2 === 0;

  return (
    <article
      className={cn(
        'group flex gap-8 border-b border-charcoal/15 py-10 sm:px-6 lg:border-b-0 lg:border-e lg:px-7 lg:py-12 lg:last:border-e-0 xl:px-9',
        'sm:odd:border-e lg:odd:border-e',
        imageFirst ? 'flex-col' : 'flex-col lg:flex-col-reverse lg:justify-end',
      )}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-stone/40">
        <Picture
          image={value.image}
          alt={t(`values.items.${value.id}.alt`)}
          sizes="(min-width: 1024px) 22vw, (min-width: 640px) 45vw, 90vw"
          className="h-full w-full object-cover grayscale-[35%] transition duration-[1.2s] ease-premium group-hover:scale-105 group-hover:grayscale-0"
        />
      </div>
      <div>
        <span className="ltr-nums text-outline block text-[3.25rem] font-extrabold leading-none text-terracotta">
          {String(index + 1).padStart(2, '0')}
        </span>
        <span aria-hidden className="mt-6 block h-px w-12 bg-terracotta transition-all duration-700 ease-premium group-hover:w-20" />
        <h3 className="text-h3 mt-6 text-charcoal">{t(`values.items.${value.id}.title`)}</h3>
        <p className="mt-3 leading-relaxed text-charcoal-soft">{t(`values.items.${value.id}.text`)}</p>
      </div>
    </article>
  );
}
