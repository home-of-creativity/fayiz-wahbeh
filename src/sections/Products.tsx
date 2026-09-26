import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { ProductItem } from '@/components/items/ProductItem';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { products } from '@/data/products';
import { useReveal } from '@/hooks/useReveal';

export function Products() {
  const { t } = useTranslation();
  const root = useRef<HTMLElement>(null);
  useReveal(root);

  return (
    <section id="products" ref={root} tabIndex={-1} aria-labelledby="products-title" className="section-y relative isolate bg-cream">
      <div className="container-x">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
          <SectionHeading
            id="products-title"
            eyebrow={t('products.eyebrow')}
            title={t('products.title')}
            size="display"
            className="lg:col-span-7"
          />
          <div data-reveal="fade-up" className="flex items-end gap-6 lg:col-span-4 lg:col-start-9">
            <span className="ltr-nums text-outline text-[5.5rem] font-extrabold leading-[0.8] text-terracotta">
              {String(products.length).padStart(2, '0')}
            </span>
            <div>
              <p className="text-eyebrow text-charcoal/50">{t('products.count')}</p>
              <p className="mt-3 leading-relaxed text-charcoal-soft">{t('products.intro')}</p>
            </div>
          </div>
        </div>

        <div className="mt-20 flex flex-col gap-28 lg:mt-28 lg:gap-40">
          {products.map((product, index) => (
            <ProductItem key={product.id} product={product} index={index} total={products.length} />
          ))}
        </div>
      </div>
    </section>
  );
}
