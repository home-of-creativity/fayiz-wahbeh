import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { currentLanguage } from '@/i18n';

/** Placeholder production origin — replace when the domain is final. */
export const SITE_URL = 'https://fwbrick.com';

export function Seo() {
  const { t } = useTranslation();
  const lang = currentLanguage();
  const title = t('meta.title');
  const description = t('meta.description');
  const image = `${SITE_URL}/og-image.jpg`;

  return (
    <Helmet htmlAttributes={{ lang, dir: lang === 'ar' ? 'rtl' : 'ltr' }}>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="robots" content="index, follow, max-image-preview:large" />
      <link rel="canonical" href={`${SITE_URL}/`} />
      <link rel="alternate" hrefLang="en" href={`${SITE_URL}/?lang=en`} />
      <link rel="alternate" hrefLang="ar" href={`${SITE_URL}/?lang=ar`} />
      <link rel="alternate" hrefLang="x-default" href={`${SITE_URL}/`} />

      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={t('brand.name')} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={`${SITE_URL}/`} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={t('meta.ogAlt')} />
      <meta property="og:locale" content={lang === 'ar' ? 'ar_SY' : 'en_US'} />
      <meta property="og:locale:alternate" content={lang === 'ar' ? 'en_US' : 'ar_SY'} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:image:alt" content={t('meta.ogAlt')} />
    </Helmet>
  );
}
