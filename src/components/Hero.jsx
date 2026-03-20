import React from 'react';
import { Code2, Github, Linkedin, Mail } from 'lucide-react';

const Hero = () => (
  <section className="max-w-6xl mx-auto px-6 mb-24" aria-labelledby="hero-heading">
    <div className="flex flex-col md:flex-row items-center gap-12">
      <div className="relative">
        <div className="w-48 h-48 rounded-2xl overflow-hidden shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500">
          <img
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=256&h=256&auto=format&fit=crop"
            alt="Adrián Busquets Bravo"
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
        <div className="absolute -bottom-4 -right-4 bg-white p-3 rounded-xl shadow-lg">
          <Code2 className="text-blue-600" size={24} />
        </div>
      </div>

      <div className="text-center md:text-left flex-1">
        <h1 id="hero-heading" className="text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
          Adrián Busquets Bravo
        </h1>
        <p className="text-xl text-blue-600 font-medium mb-6">
          Desarrollador Web Full-Stack — Frontend / Backend
        </p>
        <p className="text-lg text-slate-600 max-w-2xl mb-8 leading-relaxed">
          Especializado en <span className="text-slate-900 font-semibold underline decoration-blue-500/30">PHP (Laravel) y React</span>.
          Apasionado por las buenas prácticas, el código limpio y los procesos de automatización.
        </p>

        <div className="flex flex-wrap justify-center md:justify-start gap-4">
          <a href="https://github.com/AdrianBusquets" className="flex items-center gap-2 px-5 py-3 bg-white border border-slate-200 rounded-xl hover:border-blue-300 hover:shadow-sm transition-all text-slate-600">
            <Github size={20} /> GitHub
          </a>
          <a href="https://es.linkedin.com/in/adrián-busquets-bravo-897670222" className="flex items-center gap-2 px-5 py-3 bg-white border border-slate-200 rounded-xl hover:border-blue-300 hover:shadow-sm transition-all text-slate-600">
            <Linkedin size={20} /> LinkedIn
          </a>
          <a href="mailto:adrian.busquets@hotmail.com" className="flex items-center gap-2 px-5 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all">
            <Mail size={20} /> Contactar
          </a>
        </div>
      </div>
    </div>
  </section>
);

export default Hero;
