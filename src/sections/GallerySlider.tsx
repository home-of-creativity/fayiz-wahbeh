import { useTranslation } from 'react-i18next';
import { A11y } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { Picture } from '@/components/ui/Picture';
import { TapHint } from '@/components/ui/TapHint';
import { gallery } from '@/data/content';
import { currentLanguage } from '@/i18n';

/** Touch-friendly gallery for small screens (loaded only below 1024px). */
export default function GallerySlider() {
  const { t } = useTranslation();

  return (
    <Swiper
      modules={[A11y]}
      dir={currentLanguage() === 'ar' ? 'rtl' : 'ltr'}
      slidesPerView={1.15}
      spaceBetween={14}
      breakpoints={{ 640: { slidesPerView: 1.6, spaceBetween: 20 } }}
      className="!overflow-visible"
    >
      {gallery.map((item) => {
        const key = `gallery.items.${item.id}`;
        return (
          <SwiperSlide key={item.id}>
            <figure>
              <div
                data-cursor="view"
                role="button"
                tabIndex={0}
                aria-label={`${t('a11y.viewImage')}: ${t(`${key}.alt`)}`}
                className="relative aspect-[4/5] overflow-hidden bg-stone/40 transition-transform duration-300 ease-premium active:scale-[0.985]"
              >
                <Picture image={item.image} alt={t(`${key}.alt`)} sizes="(min-width: 640px) 60vw, 86vw" className="h-full w-full object-cover" />
                <TapHint kind="view" />
              </div>
              <figcaption className="mt-3 flex flex-col gap-1.5 border-t border-charcoal/15 pt-3">
                <span className="font-semibold text-charcoal">{t(`${key}.caption`)}</span>
                <span className="text-eyebrow text-terracotta-600">{t(`${key}.category`)}</span>
              </figcaption>
            </figure>
          </SwiperSlide>
        );
      })}
    </Swiper>
  );
}
