import React from 'react';
import { Helmet } from 'react-helmet-async';
import Nav from './components/Nav.tsx';
import Hero from './components/Hero.tsx';
import Experience from './components/Experience';
import Skills from './components/Skills';
import Education from './components/Education';
import Footer from './components/Footer';
import { skills, experience, education } from './data/siteData';

const App = () => (
  <div className="min-h-screen bg-[#f8fafc] text-slate-800 font-sans selection:bg-blue-100 selection:text-blue-900">
    <Helmet>
      <script type="application/ld+json">{JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Person",
        "name": "Adrián Busquets",
        "jobTitle": "Full Stack Developer",
        "url": "https://tuweb.com"
      })}</script>
    </Helmet>
    <Nav />

    <main className="pt-24 pb-20">
      <Hero />
      <Experience data={experience} />
      <Skills data={skills} />
      <Education data={education} />
    </main>

    <Footer />
  </div>
);

export default App;
