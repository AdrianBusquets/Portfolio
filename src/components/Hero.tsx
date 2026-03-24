import React from 'react';
import useReveal from '../hooks/useReveal';
import { Code2, Github, Linkedin, Mail } from 'lucide-react';
// @ts-ignore: JS module without types
import DownloadButton from './DownloadButton';
// @ts-ignore: JS module without types
import useTokenValidation from '../hooks/useTokenValidation';
// @ts-ignore: JS module without types
import { skills as skillsData, experience as experienceData, education as educationData } from '../data/siteData';

interface ExperienceItem {
  role?: string;
  company?: string;
  period?: string;
  description?: string;
  highlights?: string[];
}

interface EducationItem {
  title?: string;
  institution?: string;
}

interface Profile {
  name: string;
  jobTitle?: string;
  description?: string;
  email?: string;
  website?: string;
  skills?: unknown;
  experience?: ExperienceItem[];
  education?: EducationItem[];
}

const Hero: React.FC = () => {
  const { valid, extraData } = useTokenValidation() as { valid?: boolean; extraData?: unknown };

  const baseExperience = (experienceData as ExperienceItem[]) || [];
  const extra = extraData as { experience?: ExperienceItem[] } | undefined;

  const mergedExperience: ExperienceItem[] = (valid && extra && Array.isArray(extra.experience))
    ? [...baseExperience, ...extra.experience!]
    : baseExperience;

  const profile: Profile = {
    name: 'Adrián Busquets Bravo',
    jobTitle: 'Full Stack Developer',
    description: 'Especializado en PHP (Laravel) y React. Apasionado por las buenas prácticas, el código limpio y los procesos de automatización.',
    email: 'adrian.busquets@hotmail.com',
    website: 'https://tuweb.com',
    skills: skillsData,
    experience: mergedExperience,
    education: educationData as EducationItem[],
  };

  // DownloadButton is a JS module; assert a compatible React component type so TSX checks props
  const DownloadButtonTyped = DownloadButton as React.ComponentType<{ data: Profile }>;

  const { ref, visible } = useReveal<HTMLDivElement>();

  return (
    <section className="w-full mb-16 relative h-screen md:h-auto flex items-center" aria-labelledby="hero-heading">

      <div
        ref={ref}
        className={`max-w-6xl mx-auto px-6 relative z-10 transition-all duration-700 ease-out transform ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="relative">
            <div className="w-48 h-48 rounded-2xl overflow-hidden shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500">
              <img
                src="/Foto_Portfolio.png"
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
              <DownloadButtonTyped data={profile} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
