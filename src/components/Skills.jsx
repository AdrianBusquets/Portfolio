import React, { useState, useRef, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Cpu, Layout, Server, Database } from 'lucide-react';
import useReveal from '../hooks/useReveal';

// Define expert levels for known skills; fallback per group
const LEVELS = {
  'React 18': 90,
  'Inertia.js': 75,
  'TypeScript': 85,
  'JSX': 85,
  'Tailwind CSS': 90,
  'Bootstrap': 90,
  'JavaScript': 88,
  'PHP 8': 88,
  'Laravel 11': 90,
  'REST APIs': 80,
  'MySQL': 95,
  'PostgreSQL': 80,
  'Redis': 60,
  'Docker': 60,
  'AWS S3': 75,
  'Git': 85,
  'GitHub': 90,
  'CI/CD Pipelines': 72,
  'PHPUnit': 60,
  'Websockets (Pusher)': 70,
  'Queue Management (Laravel Queue)': 88
};

function SkillBar({ name, idx, groupFallback = 65, forceVisible = false }) {
  const { ref, visible } = useReveal();
  const level = LEVELS[name] ?? groupFallback;
  const effectiveVisible = visible || forceVisible;
  return (
    <div ref={ref} style={{ transitionDelay: `${idx * 80}ms` }} className="mb-4">
      <div className="flex justify-between mb-1">
        <span className="text-sm font-medium text-slate-800">{name}</span>
        <span className="text-sm text-slate-500">{level}%</span>
      </div>
      <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
        <div
          className="h-3 bg-blue-600 rounded-full transition-[width] duration-900 ease-out"
          style={{ width: effectiveVisible ? `${level}%` : '0%' }}
        />
      </div>
    </div>
  );
}

const Skills = ({ data }) => {
  const [view, setView] = useState('chips');
  const containerRef = useRef(null);
  const chipsRef = useRef(null);
  const nivelesRef = useRef(null);
  const [containerHeight, setContainerHeight] = useState('auto');

  const columns = useMemo(() => ([
    { key: 'frontend', icon: <Layout className="text-blue-500 mb-4" size={32} />, title: 'Frontend', items: data.frontend, fallback: 78 },
    { key: 'backend', icon: <Server className="text-green-500 mb-4" size={32} />, title: 'Backend', items: data.backend, fallback: 72 },
    { key: 'tools', icon: <Database className="text-orange-500 mb-4" size={32} />, title: 'Herramientas & Cloud', items: data.tools, fallback: 60 }
  ]), [data]);

  useEffect(() => {
    function updateHeight() {
      const activeRef = view === 'chips' ? chipsRef : nivelesRef;
      if (activeRef.current) {
        // prefer using the grid total height (works for stacked mobile and columns on desktop)
        const grid = activeRef.current.querySelector('.grid');
        if (grid) {
          const h = grid.scrollHeight || activeRef.current.scrollHeight || 0;
          // small padding so content doesn't touch the border
          setContainerHeight(`${h + 24}px`);
          return;
        }
        const h = activeRef.current.scrollHeight;
        setContainerHeight(`${h}px`);
      }
    }
    updateHeight();
    const ro = new ResizeObserver(updateHeight);
    if (chipsRef.current) ro.observe(chipsRef.current);
    if (nivelesRef.current) ro.observe(nivelesRef.current);
    window.addEventListener('resize', updateHeight);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', updateHeight);
    };
  }, [view, columns]);


  return (
    <section id="habilidades" className="max-w-6xl mx-auto px-6 mb-24" aria-labelledby="skills-heading">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
          <Cpu size={24} />
        </div>
        <h2 id="skills-heading" className="text-3xl font-bold text-slate-900">Tecnologías & Habilidades</h2>
        <div className="ml-auto">
          <button onClick={() => setView('chips')} className={`px-3 py-1 mb-1 mr-2 rounded ${view === 'chips' ? 'bg-blue-600 text-white' : 'bg-white border'}`}>Chips</button>
          <button onClick={() => setView('niveles')} className={`px-3 py-1 rounded ${view === 'niveles' ? 'bg-blue-600 text-white' : 'bg-white border'}`}>Niveles</button>
        </div>
      </div>

      <div ref={containerRef} className="relative transition-[height] duration-500" style={{ height: containerHeight }}>
        {/* Chips view (will crossfade) */}
        <div
          ref={chipsRef}
          aria-hidden={view !== 'chips'}
          className={`absolute inset-0 transition-all duration-500 ease-out ${view === 'chips' ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-4 pointer-events-none'}`}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {columns.map((col) => (
              <div key={col.key} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  {col.icon}
                  <h3 className="text-lg font-bold">{col.title}</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {col.items.map((s, idx) => (
                    <span
                      key={s}
                      className="px-3 py-1 bg-blue-50 text-blue-700 rounded-md text-xs font-bold uppercase tracking-wider transition-all duration-400"
                      style={{
                        transitionDelay: `${idx * 40}ms`,
                        transform: view === 'chips' ? 'translateY(0)' : 'translateY(6px)',
                        opacity: view === 'chips' ? 1 : 0
                      }}
                    >{s}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Niveles view (will crossfade) */}
        <div
          ref={nivelesRef}
          aria-hidden={view !== 'niveles'}
          className={`absolute inset-0 transition-all duration-500 ease-out ${view === 'niveles' ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-4 pointer-events-none'}`}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {columns.map((col, colIdx) => (
              <div key={col.key} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  {col.icon}
                  <h3 className="text-lg font-bold">{col.title}</h3>
                </div>
                <div>
                  {col.items.map((s, idx) => (
                    <SkillBar key={s} name={s} idx={idx + colIdx * 10} groupFallback={col.fallback} forceVisible={view === 'niveles'} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

Skills.propTypes = {
  data: PropTypes.shape({
    frontend: PropTypes.arrayOf(PropTypes.string),
    backend: PropTypes.arrayOf(PropTypes.string),
    tools: PropTypes.arrayOf(PropTypes.string)
  }).isRequired
};

export default Skills;
