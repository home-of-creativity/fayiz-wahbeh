import { useTranslation } from 'react-i18next';
import { ArrowRight } from 'lucide-react';
import { AnimatedImage } from '@/components/ui/AnimatedImage';
import { tList } from '@/i18n';
import type { Product } from '@/types';
import { cn } from '@/utils/cn';

interface ProductItemProps {
  product: Product;
  index: number;
  total: number;
}

const pad = (n: number) => String(n).padStart(2, '0');

export function ProductItem({ product, index, total }: ProductItemProps) {
  const { t } = useTranslation();
  const key = `products.items.${product.id}`;
  const highlights = tList(`${key}.highlights`);
  const reverse = index % 2 === 1;
  const titleId = `product-${product.id}`;

  return (
    <article aria-labelledby={titleId} className="group/product relative grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
      {/* Subtle tone shift behind the whole panel on hover */}
      <span
        aria-hidden
        className="pointer-events-none absolute -inset-x-4 -inset-y-6 -z-10 bg-sand/0 transition-colors duration-700 ease-premium group-hover/product:bg-sand/70 lg:-inset-x-8 lg:-inset-y-10"
      />

      <div className={cn('relative lg:col-span-7', reverse && 'lg:order-2')}>
        <AnimatedImage
          image={product.image}
          alt={t(`${key}.alt`)}
          sizes="(min-width: 1024px) 56vw, 100vw"
          className="aspect-[4/3] lg:aspect-[16/11]"
          hoverClassName="group-hover/product:scale-[1.06]"
          reveal={reverse ? 'end' : 'start'}
          parallax={4}
          cursor="explore"
        />
        <span className="ltr-nums absolute start-0 top-0 bg-cream px-4 py-3 text-xs font-bold tracking-[0.2em] text-charcoal">
          {pad(index + 1)} <span className="text-charcoal/40">/ {pad(total)}</span>
        </span>
      </div>

      <div className={cn('relative lg:col-span-5', reverse && 'lg:order-1')}>
        <h3 id={titleId} data-split className="text-display text-charcoal">
          {t(`${key}.name`)}
        </h3>
        <p data-reveal="fade-up" className="text-lead mt-6 text-charcoal-soft">
          {t(`${key}.text`)}
        </p>

        <div data-reveal="fade-up" data-delay="0.1" className="mt-8">
          <p className="text-eyebrow text-charcoal/50">{t('products.highlightsLabel')}</p>
          <ul className="mt-4 grid grid-cols-2 gap-x-6 border-t border-charcoal/15">
            {highlights.map((highlight) => (
              <li key={highlight} className="flex items-center gap-3 border-b border-charcoal/10 py-3 text-sm font-semibold text-charcoal">
                <span aria-hidden className="shape-bar h-[6px] w-3.5 shrink-0 bg-terracotta" />
                {highlight}
              </li>
            ))}
          </ul>
        </div>

        {/* Extra detail: always visible on touch, revealed on hover/focus for fine pointers */}
        <p className="mt-6 overflow-hidden text-sm italic text-charcoal-soft transition-all duration-700 ease-premium [@media(hover:hover)_and_(min-width:1024px)]:max-h-0 [@media(hover:hover)_and_(min-width:1024px)]:opacity-0 group-focus-within/product:max-h-20 group-focus-within/product:opacity-100 group-hover/product:max-h-20 group-hover/product:opacity-100 rtl:not-italic">
          {t(`${key}.ideal`)}
        </p>

        <a
          href="#contact"
          data-reveal="fade-up"
          data-delay="0.2"
          className="mt-8 inline-flex items-center gap-4 text-sm font-bold text-charcoal transition-colors hover:text-terracotta"
        >
          {t('products.cta')}
          <span className="grid size-12 place-items-center rounded-full border border-charcoal/20 transition-all duration-500 ease-premium group-hover/product:border-terracotta group-hover/product:bg-terracotta group-hover/product:text-white">
            <ArrowRight
              aria-hidden
              className="size-4 transition-transform duration-500 ease-premium group-hover/product:translate-x-1 rtl:-scale-x-100 rtl:group-hover/product:-translate-x-1"
            />
          </span>
        </a>
      </div>
    </article>
  );
}
