import React from 'react';
import { Helmet } from 'react-helmet-async';
import Nav from './components/Nav.tsx';
import Hero from './components/Hero.tsx';
import LottieHero from './components/LottieHero';
import InteractiveHeroBackground from './components/InteractiveHeroBackground';
import BackgroundToggle from './components/BackgroundToggle';
import { useEffect, useState } from 'react';
import Experience from './components/Experience';
import Skills from './components/Skills';
import Education from './components/Education';
import Footer from './components/Footer';
import { skills, experience, education } from './data/siteData';

const App = () => (
  <div className="min-h-screen text-slate-800 font-sans selection:bg-blue-100 selection:text-blue-900">
    <Helmet>
      <script type="application/ld+json">{JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Person",
        "name": "Adrián Busquets",
        "jobTitle": "Full Stack Developer",
        "url": "https://tuweb.com"
      })}</script>
    </Helmet>
    {/* Background chooser: interactive canvas or Lottie animation */}
    <BackgroundRoot />
    <BackgroundToggle />

    <Nav />

    <main className="pt-8 md:pt-24 pb-20">
      <Hero />
      <Experience data={experience} />
      <Skills data={skills} />
      <Education data={education} />
    </main>

    <Footer />
  </div>
);

function BackgroundRoot() {
  const STORAGE_KEY = 'site:background_mode';
  const [mode, setMode] = useState('interactive');

  useEffect(() => {
    try {
      const v = localStorage.getItem(STORAGE_KEY);
      if (v === 'lottie' || v === 'interactive') setMode(v);
    } catch (e) { /* ignore */ }
    function onBgChange(e) {
      try {
        const val = (e && e.detail) || localStorage.getItem(STORAGE_KEY);
        if (val === 'lottie' || val === 'interactive') setMode(val);
      } catch (err) { /* ignore */ }
    }
    window.addEventListener('background:change', onBgChange);
    return () => window.removeEventListener('background:change', onBgChange);
  }, []);

  if (mode === 'lottie') return <LottieHero />;
  return <InteractiveHeroBackground />;
}

export default App;
