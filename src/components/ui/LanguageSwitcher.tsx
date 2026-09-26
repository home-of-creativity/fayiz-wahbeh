import { useTranslation } from 'react-i18next';
import { currentLanguage, LANGUAGES } from '@/i18n';
import type { Language } from '@/types';
import { cn } from '@/utils/cn';

const LABELS: Record<Language, string> = { en: 'EN', ar: 'عربي' };

interface LanguageSwitcherProps {
  tone?: 'glass' | 'dark' | 'light';
  className?: string;
}

const TONES = {
  glass: {
    wrap: 'border-charcoal/10 bg-cream/95',
    active: 'bg-charcoal text-cream',
    idle: 'text-charcoal hover:text-terracotta',
  },
  dark: { wrap: 'border-charcoal/20', active: 'bg-charcoal text-cream', idle: 'text-charcoal hover:text-terracotta' },
  light: { wrap: 'border-cream/25', active: 'bg-cream text-brown', idle: 'text-cream hover:text-terracotta-200' },
};

export function LanguageSwitcher({ tone = 'dark', className }: LanguageSwitcherProps) {
  const { t, i18n } = useTranslation();
  const active = currentLanguage();
  const style = TONES[tone];

  return (
    <div
      role="group"
      aria-label={t('a11y.language')}
      className={cn('inline-flex items-center gap-0.5 rounded-full border p-1', style.wrap, className)}
    >
      {LANGUAGES.map((lang) => (
        <button
          key={lang}
          type="button"
          lang={lang}
          aria-pressed={active === lang}
          onClick={() => {
            if (active !== lang) void i18n.changeLanguage(lang);
          }}
          className={cn(
            'min-w-[2.75rem] rounded-full px-3 py-1.5 text-[0.75rem] font-bold transition-colors duration-300',
            active === lang ? style.active : style.idle,
          )}
        >
          {LABELS[lang]}
        </button>
      ))}
    </div>
  );
}
