import React, { useState } from 'react';

function splitTextIntoLines(text = '', maxChars = 80) {
  const words = String(text).split(' ');
  const lines = [];
  let current = '';
  for (const w of words) {
    if ((current + ' ' + w).trim().length > maxChars) {
      lines.push(current.trim());
      current = w;
    } else {
      current = (current + ' ' + w).trim();
    }
  }
  if (current) lines.push(current.trim());
  return lines;
}

async function generatePdf(profile = {}) {
  const { PDFDocument, StandardFonts, rgb } = await import('pdf-lib');
  const doc = await PDFDocument.create();
  let page = doc.addPage([595.28, 841.89]); // A4
  const { height } = page.getSize();
  const helvetica = await doc.embedFont(StandardFonts.Helvetica);

  let y = height - 50;
  const lineHeight = 14;

  page.drawText(profile.name || '', { x: 50, y, size: 18, font: helvetica });
  y -= 26;
  if (profile.jobTitle) {
    page.drawText(profile.jobTitle, { x: 50, y, size: 12, font: helvetica });
    y -= 20;
  }

  // Descripción corta bajo el título (si existe)
  if (profile.description) {
    const descLines = splitTextIntoLines(profile.description, 90);
    for (const l of descLines) {
      page.drawText(l, { x: 50, y, size: 10, font: helvetica });
      y -= lineHeight;
    }
    y -= 6;
  }

  const contact = [profile.email, profile.website].filter(Boolean).join(' • ');
  if (contact) {
    page.drawText(contact, { x: 50, y, size: 10, font: helvetica, color: rgb(0.3, 0.3, 0.3) });
    y -= 22;
  }

  // Resumen (si hay)
  if (profile.summary) {
    const lines = splitTextIntoLines(profile.summary, 90);
    for (const l of lines) {
        page.drawText(l, { x: 50, y, size: 11, font: helvetica });
        y -= lineHeight;
    }
    y -= 8;
  }

  // Experiencia
  if (profile.experience && profile.experience.length) {
    page.drawText('Experiencia', { x: 50, y, size: 12, font: helvetica });
    y -= 18;
    for (const exp of profile.experience) {
      if (y < 80) {
        page = doc.addPage([595.28, 841.89]);
        y = page.getSize().height - 50;
      }

      page.drawText(`${exp.role} — ${exp.company}`, { x: 55, y, size: 11, font: helvetica });
      y -= lineHeight;

      if (exp.period) {
        page.drawText(exp.period, { x: 55, y, size: 10, font: helvetica, color: rgb(0.45, 0.45, 0.45) });
        y -= lineHeight;
      }

      if (exp.description) {
        const lines = splitTextIntoLines(exp.description, 90);
        for (const l of lines) {
          page.drawText(l, { x: 55, y, size: 10, font: helvetica });
          y -= lineHeight;
        }
      }

      if (exp.highlights) {
        for (const h of exp.highlights) {
          const lines = splitTextIntoLines('• ' + h, 90);
          for (const l of lines) {
            page.drawText(l, { x: 60, y, size: 10, font: helvetica });
            y -= lineHeight;
          }
        }
      }

      y -= 8;
    }
  }

  // Habilidades (soporta objeto { frontend, backend, tools } o array de strings/objetos)
  if (profile.skills) {
    // normalizar a array de strings para renderizar
    let skillsArr = [];
    if (Array.isArray(profile.skills)) {
      skillsArr = profile.skills.map(s => (typeof s === 'string' ? s : (s.name || JSON.stringify(s))));
    } else if (typeof profile.skills === 'object') {
      for (const key of Object.keys(profile.skills)) {
        const val = profile.skills[key];
        if (Array.isArray(val)) {
          skillsArr.push(`${key.charAt(0).toUpperCase() + key.slice(1)}: ${val.join(', ')}`);
        } else if (typeof val === 'string') {
          skillsArr.push(`${key.charAt(0).toUpperCase() + key.slice(1)}: ${val}`);
        }
      }
    } else {
      skillsArr = [String(profile.skills)];
    }

    if (skillsArr.length) {
      if (y < 120) {
        page = doc.addPage([595.28, 841.89]);
        y = page.getSize().height - 50;
      }
      page.drawText('Habilidades', { x: 50, y, size: 12, font: helvetica });
      y -= 18;
      const skillsText = skillsArr.join(' • ');
      const lines = splitTextIntoLines(skillsText, 90);
      for (const l of lines) {
        page.drawText(l, { x: 55, y, size: 10, font: helvetica });
        y -= lineHeight;
      }
      y -= 8;
    }
  }

  // Educación (simple)
  if (profile.education && profile.education.length) {
    if (y < 120) {
      page = doc.addPage([595.28, 841.89]);
      y = page.getSize().height - 50;
    }
    page.drawText('Educación', { x: 50, y, size: 12, font: helvetica });
    y -= 18;
    for (const edu of profile.education) {
      page.drawText(edu.title || '', { x: 55, y, size: 11, font: helvetica });
      y -= lineHeight;
      if (edu.institution) {
        page.drawText(edu.institution, { x: 55, y, size: 10, font: helvetica, color: rgb(0.45, 0.45, 0.45) });
        y -= lineHeight;
      }
      y -= 6;
    }
  }

  const pdfBytes = await doc.save();
  return pdfBytes;
}

export default function DownloadButton({ data }) {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    setLoading(true);
    const counterUrl = import.meta.env.VITE_DOWNLOAD_COUNTER_URL;
    try {
      if (counterUrl) {
        await fetch(counterUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ file: 'cv_adrian', token: new URLSearchParams(window.location.search).get('token') || null })
        });
      }
    } catch (err) {
      console.warn('Contador de descargas falló', err);
    }

    try {
      const pdfBytes = await generatePdf(data);
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'CV_Adrian.pdf';
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Generación de PDF falló', err);
      alert('Error generando el PDF. Revisa la consola.');
    }

    setLoading(false);
  };

  return (
    <button onClick={handleDownload} className="flex items-center gap-2 px-5 py-3 bg-white border border-slate-200 rounded-xl hover:border-blue-300 hover:shadow-sm transition-all text-slate-600">
      {loading ? 'Generando...' : 'Descargar CV'}
    </button>
  );
}
