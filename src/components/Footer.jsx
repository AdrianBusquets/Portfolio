import React from 'react';
import { Github, Linkedin, Mail } from 'lucide-react';

const Footer = () => (
  <footer className="bg-slate-900 py-12 text-white" role="contentinfo">
    <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
      <div>
        <h2 className="text-2xl font-bold mb-2">¿Trabajamos juntos?</h2>
        <p className="text-slate-400">Madrid, España — Disponible para nuevas oportunidades.</p>
      </div>
      <div className="flex gap-4">
        <a href="https://github.com/AdrianBusquets" aria-label="GitHub" className="p-3 bg-slate-800 rounded-full hover:bg-blue-600 transition-colors">
          <Github size={20} />
        </a>
        <a href="https://es.linkedin.com/in/adrián-busquets-bravo-897670222" aria-label="LinkedIn" className="p-3 bg-slate-800 rounded-full hover:bg-blue-600 transition-colors">
          <Linkedin size={20} />
        </a>
        <a href="mailto:adrian.busquets@hotmail.com" aria-label="Enviar email" className="p-3 bg-slate-800 rounded-full hover:bg-blue-600 transition-colors">
          <Mail size={20} />
        </a>
      </div>
    </div>
  </footer>
);

export default Footer;
