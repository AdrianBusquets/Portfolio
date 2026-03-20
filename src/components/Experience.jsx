import React from 'react';
import PropTypes from 'prop-types';
import { Briefcase, ChevronRight } from 'lucide-react';

const Experience = ({ data }) => (
  <section id="experiencia" className="max-w-6xl mx-auto px-6 mb-24" aria-labelledby="experience-heading">
    <div className="flex items-center gap-3 mb-10">
      <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
        <Briefcase size={24} />
      </div>
      <h2 id="experience-heading" className="text-3xl font-bold text-slate-900">Experiencia Relevante</h2>
    </div>

    <div className="space-y-8">
      {data.map((job, idx) => (
        <article key={idx} className="group relative bg-white p-8 rounded-2xl border border-slate-200 hover:border-blue-200 transition-all shadow-sm hover:shadow-md">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
            <div>
              <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{job.role}</h3>
              <p className="text-slate-500 font-medium">{job.company}</p>
            </div>
            <span className="inline-block px-4 py-1.5 bg-slate-100 text-slate-600 rounded-full text-sm font-semibold">
              {job.period}
            </span>
          </div>
          <p className="text-slate-600 mb-6 italic border-l-4 border-blue-500 pl-4">
            "{job.description}"
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {job.highlights.map((item, i) => (
              <div key={i} className="flex items-start gap-3 text-slate-600 text-sm">
                <ChevronRight size={18} className="text-blue-500 mt-0.5 flex-shrink-0" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </article>
      ))}
    </div>
  </section>
);

Experience.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      role: PropTypes.string.isRequired,
      company: PropTypes.string.isRequired,
      period: PropTypes.string,
      description: PropTypes.string,
      highlights: PropTypes.arrayOf(PropTypes.string)
    })
  ).isRequired
};

export default Experience;
