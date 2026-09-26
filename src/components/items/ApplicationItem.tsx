import { useTranslation } from 'react-i18next';
import { AnimatedImage } from '@/components/ui/AnimatedImage';
import type { Application } from '@/types';

interface ApplicationItemProps {
  application: Application;
  index: number;
  /** `step` = text block driving the sticky desktop image, `card` = stacked mobile card. */
  variant: 'step' | 'card';
}

const pad = (n: number) => String(n).padStart(2, '0');

export function ApplicationItem({ application, index, variant }: ApplicationItemProps) {
  const { t } = useTranslation();
  const key = `applications.items.${application.id}`;

  if (variant === 'card') {
    return (
      <article data-reveal="fade-up">
        <AnimatedImage
          image={application.image}
          alt={t(`${key}.alt`)}
          sizes="(min-width: 640px) 80vw, 100vw"
          className="aspect-[4/3]"
          reveal={false}
          cursor="view"
        />
        <p className="ltr-nums mt-5 text-xs font-bold tracking-[0.2em] text-terracotta-600">{pad(index + 1)}</p>
        <h3 className="text-h3 mt-2 text-charcoal">{t(`${key}.title`)}</h3>
        <p className="mt-3 leading-relaxed text-charcoal-soft">{t(`${key}.text`)}</p>
      </article>
    );
  }

  return (
    <article
      data-app-step
      className="group flex min-h-[64vh] flex-col justify-center border-t border-charcoal/15 py-12 opacity-40 transition-opacity duration-700 ease-premium [&.is-active]:opacity-100"
    >
      <p className="ltr-nums text-xs font-bold tracking-[0.2em] text-terracotta-600">{pad(index + 1)}</p>
      <h3 className="text-h2 mt-4 text-charcoal transition-colors duration-700 group-[.is-active]:text-terracotta">
        {t(`${key}.title`)}
      </h3>
      <p className="text-lead mt-5 max-w-md text-charcoal-soft">{t(`${key}.text`)}</p>
    </article>
  );
}
