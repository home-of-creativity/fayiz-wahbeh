import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Hourglass, Leaf, Recycle } from 'lucide-react';
import { AnimatedImage } from '@/components/ui/AnimatedImage';
import { Eyebrow } from '@/components/ui/SectionHeading';
import { images } from '@/data/images';
import { useReveal } from '@/hooks/useReveal';
import { tList } from '@/i18n';

const POINT_ICONS = [Leaf, Recycle, Hourglass];

export function Sustainability() {
  const { t } = useTranslation();
  const root = useRef<HTMLElement>(null);
  const points = tList('sustainability.points');
  useReveal(root);

  return (
    <section
      id="sustainability"
      ref={root}
      tabIndex={-1}
      aria-labelledby="sustainability-title"
      className="section-y relative overflow-hidden bg-sand"
    >
      <div className="container-x grid items-center gap-16 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-6 xl:col-span-5">
          <div data-reveal="fade-in">
            <Eyebrow>{t('sustainability.eyebrow')}</Eyebrow>
          </div>
          <h2 id="sustainability-title" className="text-display mt-7 text-charcoal">
            <span data-split className="block">
              {t('sustainability.titleLine1')}
            </span>
            <span data-split data-delay="0.2" className="block text-terracotta">
              {t('sustainability.titleLine2')}
            </span>
          </h2>
          <p data-reveal="fade-up" className="text-lead mt-8 max-w-lg text-charcoal-soft">
            {t('sustainability.text')}
          </p>
          <ul data-stagger className="mt-10 flex flex-col border-t border-charcoal/15">
            {points.map((point, index) => {
              const Icon = POINT_ICONS[index % POINT_ICONS.length];
              return (
                <li key={point} className="flex items-center gap-4 border-b border-charcoal/15 py-4 font-semibold text-charcoal">
                  <Icon aria-hidden className="size-5 text-terracotta" strokeWidth={1.6} />
                  {point}
                </li>
              );
            })}
          </ul>
        </div>

        <div className="relative lg:col-span-6 lg:col-start-7 xl:col-span-6 xl:col-start-7">
          <span aria-hidden className="mask-arch absolute -inset-3 border border-terracotta/25" />
          <AnimatedImage
            image={images.villaRoof}
            alt={t('sustainability.imageAlt')}
            sizes="(min-width: 1024px) 48vw, 100vw"
            className="mask-arch aspect-[4/5] lg:aspect-[5/6]"
            reveal="up"
            parallax={7}
            drift
            cursor="view"
          />
        </div>
      </div>
    </section>
  );
}
