import React from 'react';
import { Download } from 'lucide-react';

const Nav = () => (
  <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-slate-200 z-50" aria-label="Main Navigation">
    <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
      <a href="/" className="font-bold text-xl tracking-tight text-blue-600">AB.</a>
      <div className="hidden md:flex gap-8 text-sm font-medium text-slate-600">
        <a href="#experiencia" className="hover:text-blue-600 transition-colors">Experiencia</a>
        <a href="#habilidades" className="hover:text-blue-600 transition-colors">Habilidades</a>
        <a href="#educacion" className="hover:text-blue-600 transition-colors">Educación</a>
      </div>
      <a href="/cv.pdf" className="bg-slate-900 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-slate-800 transition-all flex items-center gap-2" aria-label="Descargar CV en PDF">
        <Download size={16} /> CV PDF
      </a>
    </div>
  </nav>
);

export default Nav;
