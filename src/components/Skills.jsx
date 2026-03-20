import React from 'react';
import PropTypes from 'prop-types';
import { Cpu, Layout, Server, Database } from 'lucide-react';

const Skills = ({ data }) => (
  <section id="habilidades" className="max-w-6xl mx-auto px-6 mb-24" aria-labelledby="skills-heading">
    <div className="flex items-center gap-3 mb-10">
      <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
        <Cpu size={24} />
      </div>
      <h2 id="skills-heading" className="text-3xl font-bold text-slate-900">Tecnologías & Habilidades</h2>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
        <Layout className="text-blue-500 mb-4" size={32} />
        <h3 className="text-lg font-bold mb-4">Frontend</h3>
        <div className="flex flex-wrap gap-2">
          {data.frontend.map(s => (
            <span key={s} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-md text-xs font-bold uppercase tracking-wider">{s}</span>
          ))}
        </div>
      </div>

      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
        <Server className="text-green-500 mb-4" size={32} />
        <h3 className="text-lg font-bold mb-4">Backend</h3>
        <div className="flex flex-wrap gap-2">
          {data.backend.map(s => (
            <span key={s} className="px-3 py-1 bg-green-50 text-green-700 rounded-md text-xs font-bold uppercase tracking-wider">{s}</span>
          ))}
        </div>
      </div>

      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
        <Database className="text-orange-500 mb-4" size={32} />
        <h3 className="text-lg font-bold mb-4">Herramientas & Cloud</h3>
        <div className="flex flex-wrap gap-2">
          {data.tools.map(s => (
            <span key={s} className="px-3 py-1 bg-orange-50 text-orange-700 rounded-md text-xs font-bold uppercase tracking-wider">{s}</span>
          ))}
        </div>
      </div>
    </div>
  </section>
);

Skills.propTypes = {
  data: PropTypes.shape({
    frontend: PropTypes.arrayOf(PropTypes.string),
    backend: PropTypes.arrayOf(PropTypes.string),
    tools: PropTypes.arrayOf(PropTypes.string)
  }).isRequired
};

export default Skills;
