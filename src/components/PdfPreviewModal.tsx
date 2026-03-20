import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

type PdfJsLib = {
  GlobalWorkerOptions: { workerSrc?: string };
  getDocument: (url: string) => { promise: Promise<PdfDocument> };
};

type PdfDocument = {
  numPages: number;
  getPage: (pageNum: number) => Promise<PdfPage>;
};

type PdfPage = {
  getViewport: (opts: { scale: number }) => { width: number; height: number };
  render: (params: { canvasContext: CanvasRenderingContext2D | null; viewport: any }) => { promise: Promise<void> };
};

let _pdfjsPromise: Promise<PdfJsLib> | null = null;
const PDFJS_URL = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
const WORKER_URL = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

function loadPdfJs(): Promise<PdfJsLib> {
  if (_pdfjsPromise) return _pdfjsPromise;
  _pdfjsPromise = new Promise((resolve, reject) => {
    // @ts-ignore window augmentation for pdfjs
    if ((window as any).pdfjsLib) {
      // @ts-ignore
      resolve((window as any).pdfjsLib as PdfJsLib);
      return;
    }

    const s = document.createElement('script');
    s.src = PDFJS_URL;
    s.onload = () => {
      // @ts-ignore
      (window as any).pdfjsLib.GlobalWorkerOptions.workerSrc = WORKER_URL;
      // @ts-ignore
      resolve((window as any).pdfjsLib as PdfJsLib);
    };
    s.onerror = reject;
    document.head.appendChild(s);
  });
  return _pdfjsPromise;
}

interface Props {
  open: boolean;
  onClose: () => void;
  pdfUrl: string;
}

const PdfPreviewModal: React.FC<Props> = ({ open, onClose, pdfUrl }) => {
  const canvasContainerRef = useRef<HTMLDivElement | null>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState<string>('');

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    setStatus('loading');
    setErrorMsg('');

    (async () => {
      try {
        const pdfjsLib = await loadPdfJs();
        if (cancelled) return;

        const pdf = await pdfjsLib.getDocument(pdfUrl).promise;
        if (cancelled) return;

        const container = canvasContainerRef.current;
        if (!container) return;
        container.innerHTML = '';

        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
          if (cancelled) return;
          const page = await pdf.getPage(pageNum);
          const viewportAt1 = page.getViewport({ scale: 1 });
          const scale = Math.min((container.clientWidth - 32) / viewportAt1.width, 2);
          const viewport = page.getViewport({ scale: Math.max(scale, 0.5) });

          const canvas = document.createElement('canvas');
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          canvas.style.display = 'block';
          canvas.style.margin = '0 auto 12px auto';
          canvas.style.maxWidth = '100%';
          canvas.style.boxShadow = '0 1px 4px rgba(0,0,0,0.15)';
          container.appendChild(canvas);

          await page.render({ canvasContext: canvas.getContext('2d'), viewport }).promise;
        }

        if (!cancelled) setStatus('done');
      } catch (err: unknown) {
        if (!cancelled) {
          setErrorMsg((err as Error).message || 'Error desconocido');
          setStatus('error');
        }
      }
    })();

    return () => {
      cancelled = true;
      if (canvasContainerRef.current) canvasContainerRef.current.innerHTML = '';
    };
  }, [open, pdfUrl]);

  if (!open || typeof document === 'undefined') return null;

  const modal = (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-label="Previsualización del CV en PDF"
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white rounded-lg shadow-xl w-[98vw] max-w-5xl h-[92vh] flex flex-col overflow-hidden">
        <header className="flex items-center justify-between px-4 py-3 border-b flex-none">
          <h3 className="text-sm font-semibold text-slate-700">Previsualización — CV</h3>
          <div className="flex items-center gap-3">
            <a href={pdfUrl} download className="text-sm text-slate-600 hover:text-slate-800 underline">Descargar</a>
            <button
              onClick={onClose}
              className="text-slate-600 hover:text-slate-900 text-sm font-medium px-2 py-1 rounded hover:bg-slate-100 transition"
            >
              Cerrar ✕
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-auto bg-slate-100 p-4">
          {status === 'loading' && (
            <div className="flex items-center justify-center h-40 text-sm text-slate-500">Cargando PDF…</div>
          )}
          {status === 'error' && (
            <div className="flex flex-col items-center justify-center h-40 gap-2 text-sm text-red-500">
              <p>Error: {errorMsg}</p>
              <a href={pdfUrl} target="_blank" rel="noopener noreferrer" className="underline text-blue-600">Abrir en nueva pestaña</a>
            </div>
          )}
          <div ref={canvasContainerRef} className="w-full" />
        </div>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
};

export default PdfPreviewModal;
