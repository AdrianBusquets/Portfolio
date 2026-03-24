import React, { useEffect, useState } from 'react';
import { Sun, Sparkles, X } from 'lucide-react';

const STORAGE_KEY = 'site:background_mode';
const TOOLTIP_KEY = 'site:background_tooltip_shown';

export default function BackgroundToggle({ className = '' }) {
  const [mode, setMode] = useState('interactive');
  const [showTip, setShowTip] = useState(false);

  useEffect(() => {
    try {
      const v = localStorage.getItem(STORAGE_KEY);
      const tip = localStorage.getItem(TOOLTIP_KEY);
      if (v === 'lottie' || v === 'interactive') setMode(v);
      if (!tip) setShowTip(true);
    } catch (e) { /* ignore */ }
  }, []);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, mode); } catch (e) { /* ignore */ }
  }, [mode]);

  function toggle() {
    setMode(prev => {
      const next = prev === 'interactive' ? 'lottie' : 'interactive';
      try { localStorage.setItem(STORAGE_KEY, next); } catch (e) { /* ignore */ }
      try { localStorage.setItem(TOOLTIP_KEY, '1'); } catch (e) { /* ignore */ }
      setShowTip(false);
      try { setTimeout(() => { window.dispatchEvent(new CustomEvent('background:change', { detail: next })); }, 0); } catch (e) { /* ignore */ }
      return next;
    });
  }

  function dismissTip() {
    try { localStorage.setItem(TOOLTIP_KEY, '1'); } catch (e) { /* ignore */ }
    setShowTip(false);
  }

  return (
    <>
      <button
        aria-label="Alternar fondo"
        title="Alternar fondo"
        onClick={toggle}
        className={`fixed right-4 bottom-6 z-50 bg-blue-200 dark:bg-slate-900/70 backdrop-blur flex items-center justify-center rounded-full p-2 shadow-sm hover:scale-105 active:scale-95 transition-transform focus:outline-none ${className}`}
        style={{ width: 48, height: 48 }}
      >
        {mode === 'interactive' ? <Sparkles size={16} /> : <Sun size={16} />}
      </button>

      {showTip && (
        <div className="fixed right-3 bottom-16 z-50 max-w-xs">
          <div className="bg-white/95 dark:bg-slate-800/95 text-slate-800 dark:text-slate-100 shadow-lg rounded-lg p-3 flex gap-3 items-start animate-[fadeIn_300ms_ease]">
            <div className="flex-1 text-sm leading-snug">
              Cambia el fondo: <strong className="font-medium">interactivo</strong> o <strong className="font-medium">animado</strong>.
            </div>
            <button onClick={dismissTip} aria-label="Cerrar" className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700">
              <X size={14} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
