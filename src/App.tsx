import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollTrigger } from '@/animations/gsap';
import { Cursor } from '@/components/layout/Cursor';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { Lightbox } from '@/components/Lightbox';
import { ScrollProgress } from '@/components/layout/ScrollProgress';
import { Seo } from '@/components/Seo';
import { IntroContext } from '@/hooks/useIntro';
import { useLenis } from '@/hooks/useLenis';
import { currentLanguage } from '@/i18n';
import { About } from '@/sections/About';
import { Applications } from '@/sections/Applications';
import { Contact } from '@/sections/Contact';
import { FinalCTA } from '@/sections/FinalCTA';
import { Gallery } from '@/sections/Gallery';
import { Hero } from '@/sections/Hero';
import { Leadership } from '@/sections/Leadership';
import { Legacy } from '@/sections/Legacy';
import { Locations } from '@/sections/Locations';
import { Manufacturing } from '@/sections/Manufacturing';
import { prepareIntro, Preloader } from '@/sections/Preloader';
import { Products } from '@/sections/Products';
import { Services } from '@/sections/Services';
import { Sustainability } from '@/sections/Sustainability';
import { Values } from '@/sections/Values';
import { WhyChooseUs } from '@/sections/WhyChooseUs';

export default function App() {
  const { t } = useTranslation();
  const lang = currentLanguage();
  const [showPreloader, setShowPreloader] = useState(prepareIntro);
  const [introReady, setIntroReady] = useState(!showPreloader);

  useLenis();

  // Late-loading fonts and images shift layout; re-measure scroll positions once they settle.
  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh();
    void document.fonts?.ready.then(refresh);
    window.addEventListener('load', refresh);
    return () => window.removeEventListener('load', refresh);
  }, []);

  // The page shell is keyed by language so every split, direction-aware tween and
  // ScrollTrigger is rebuilt for the new reading direction.
  useEffect(() => {
    const frame = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(frame);
  }, [lang]);

  return (
    <IntroContext.Provider value={introReady}>
      <Seo />
      <a
        href="#main"
        className="fixed start-4 top-4 z-[110] -translate-y-24 bg-charcoal px-4 py-3 text-sm font-bold text-cream transition-transform focus:translate-y-0"
      >
        {t('a11y.skip')}
      </a>

      <div key={lang}>
        <Header />
        <main id="main" tabIndex={-1}>
          <Hero />
          <About />
          <Legacy />
          <Values />
          <Products />
          <Manufacturing />
          <Services />
          <Applications />
          <WhyChooseUs />
          <Sustainability />
          <Gallery />
          <Leadership />
          <Contact />
          <Locations />
          <FinalCTA />
        </main>
        <Footer />
      </div>

      <ScrollProgress />
      <Lightbox />
      <Cursor />
      {showPreloader && <Preloader onReveal={() => setIntroReady(true)} onComplete={() => setShowPreloader(false)} />}
    </IntroContext.Provider>
  );
}
