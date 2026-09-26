import { useTranslation } from 'react-i18next';
import type { RevealDirection } from '@/animations/presets';
import { AnimatedImage } from '@/components/ui/AnimatedImage';
import type { GalleryImage } from '@/types';
import { cn } from '@/utils/cn';

interface GalleryFigureProps {
  item: GalleryImage;
  className?: string;
  frameClassName: string;
  reveal?: RevealDirection | false;
  parallax?: number;
  sizes: string;
}

export function GalleryFigure({ item, className, frameClassName, reveal = 'up', parallax = 0, sizes }: GalleryFigureProps) {
  const { t } = useTranslation();
  const key = `gallery.items.${item.id}`;

  return (
    <figure className={cn('group', className)}>
      <AnimatedImage
        image={item.image}
        alt={t(`${key}.alt`)}
        sizes={sizes}
        className={frameClassName}
        hoverClassName="group-hover:scale-[1.04]"
        reveal={reveal}
        parallax={parallax}
        drift
        cursor="view"
      />
      <figcaption className="mt-4 flex items-baseline justify-between gap-4 border-t border-charcoal/15 pt-3">
        <span className="font-semibold text-charcoal">{t(`${key}.caption`)}</span>
        <span className="text-eyebrow shrink-0 text-terracotta-600">{t(`${key}.category`)}</span>
      </figcaption>
    </figure>
  );
}
