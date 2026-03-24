import React from 'react';
import PropTypes from 'prop-types';
import { GraduationCap } from 'lucide-react';
import useReveal from '../hooks/useReveal';

function EducationItem({ edu, idx }) {
  const { ref, visible } = useReveal();
  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${idx * 120}ms` }}
      className={`flex gap-4 items-start p-6 bg-white rounded-xl border border-slate-100 hover:shadow-sm transition-shadow transform-gpu will-change-transform ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'} transition-all duration-900`}
    >
      <div className="w-12 h-12 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400 shrink-0">
        <GraduationCap size={20} />
      </div>
      <div>
        <h4 className="font-bold text-slate-900 mb-1">{edu.title}</h4>
        <p className="text-slate-500 text-sm italic">{edu.institution}</p>
      </div>
    </div>
  );
}

const Education = ({ data }) => (
  <section id="educacion" className="max-w-6xl mx-auto px-6" aria-labelledby="education-heading">
    <div className="flex items-center gap-3 mb-10">
      <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
        <GraduationCap size={24} />
      </div>
      <h2 id="education-heading" className="text-3xl font-bold text-slate-900">Educación</h2>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {data.map((edu, idx) => (
        <EducationItem key={idx} edu={edu} idx={idx} />
      ))}
    </div>
  </section>
);

Education.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      institution: PropTypes.string
    })
  ).isRequired
};

export default Education;
