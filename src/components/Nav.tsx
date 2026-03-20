import React, { useState } from 'react';
import { Download } from 'lucide-react';
import PdfPreviewModal from './PdfPreviewModal';

interface WindowWithGtag {
  gtag?: (...args: unknown[]) => void;
}

const Nav: React.FC = () => {
  const [isPreviewOpen, setPreviewOpen] = useState<boolean>(false);

  const handlePreview = () => setPreviewOpen(true);

  const handleDownloadClick = () => {
    const w = window as unknown as WindowWithGtag;
    if (typeof window !== 'undefined' && w.gtag) {
      w.gtag('event', 'download_cv', { event_category: 'engagement', event_label: 'cv_pdf' });
    }
  };

  return (
    <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-slate-200 z-50" aria-label="Main Navigation">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <a href="/" className="font-bold text-xl tracking-tight text-blue-600">AB.</a>
        <div className="hidden md:flex gap-8 text-sm font-medium text-slate-600">
          <a href="#experiencia" className="hover:text-blue-600 transition-colors">Experiencia</a>
          <a href="#habilidades" className="hover:text-blue-600 transition-colors">Habilidades</a>
          <a href="#educacion" className="hover:text-blue-600 transition-colors">Educación</a>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handlePreview}
            className="hidden sm:inline-flex items-center px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-100 transition"
            aria-label="Previsualizar CV en PDF"
            title="Ver CV (vista previa)"
          >
            Ver CV
          </button>
          <a
            href="/CV.pdf"
            download
            target="_blank"
            rel="noopener noreferrer"
            className="bg-slate-900 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-slate-800 transition-all flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            aria-label="Descargar CV en PDF"
            title="Abrir en nueva pestaña o descargar CV (PDF)"
            onClick={handleDownloadClick}
          >
            <Download size={16} /> <span className="ml-1">CV PDF</span>
            <span className="sr-only"> — Se abrirá en nueva pestaña.</span>
          </a>
        </div>
      </div>
      <PdfPreviewModal open={isPreviewOpen} onClose={() => setPreviewOpen(false)} pdfUrl="/CV.pdf" />
    </nav>
  );
};

export default Nav;
