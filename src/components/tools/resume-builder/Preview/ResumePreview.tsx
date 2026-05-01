"use client";

import { useResumeStore } from "@/hooks/use-resume-store";

export default function ResumePreview() {
  const { resume } = useResumeStore();

  if (!resume) {
    return (
      <div className="h-full flex items-center justify-center text-on-surface-variant/30 italic font-medium">
        Enter data to see preview
      </div>
    );
  }

  const { basics, work, education, skills, awards, volunteer } = resume;

  const SectionTitle = ({ title }: { title: string }) => (
    <div className="bg-[#E5E7EB] px-2 py-1 mb-3">
      <h2 className="text-[12pt] font-bold text-black uppercase tracking-tight">{title}</h2>
    </div>
  );

  return (
    <div className="bg-white text-black w-full min-h-full p-[0.5in] font-['Arial',sans-serif] leading-[1.2] selection:bg-indigo-100">
      {/* Header */}
      <header className="text-center mb-6">
        <h1 className="text-[28pt] font-bold tracking-tight mb-1">{basics.name || "YOUR NAME"}</h1>
        <div className="flex justify-center flex-wrap gap-2 text-[10pt] font-medium border-b-2 border-black pb-2">
          {basics.email && (
            <span>Email: <a href={`mailto:${basics.email}`} className="text-blue-600 underline">{basics.email}</a></span>
          )}
          {basics.phone && (
            <span className="before:content-['|'] before:mr-2">Mobile: {basics.phone}</span>
          )}
          {basics.url && (
            <span className="before:content-['|'] before:mr-2"><a href={basics.url} className="text-blue-600 underline">LinkedIn Profile</a></span>
          )}
        </div>
      </header>

      {/* Education */}
      {education.length > 0 && (
        <section className="mb-6">
          <SectionTitle title="Education" />
          <table className="w-full border-collapse border border-black text-[10pt]">
            <thead>
              <tr className="bg-white">
                <th className="border border-black px-2 py-1 text-left font-bold w-1/3">Degree</th>
                <th className="border border-black px-2 py-1 text-left font-bold w-1/4">Institute</th>
                <th className="border border-black px-2 py-1 text-left font-bold w-1/3">Details/Focus</th>
                <th className="border border-black px-2 py-1 text-left font-bold text-center">Year</th>
              </tr>
            </thead>
            <tbody>
              {education.map((edu, idx) => (
                <tr key={idx}>
                  <td className="border border-black px-2 py-1">{edu.area}</td>
                  <td className="border border-black px-2 py-1">{edu.institution}</td>
                  <td className="border border-black px-2 py-1">{edu.details}</td>
                  <td className="border border-black px-2 py-1 text-center whitespace-nowrap">{edu.endDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      {/* Experience */}
      {work.length > 0 && (
        <section className="mb-6">
          <SectionTitle title="Professional Experience" />
          <div className="space-y-4">
            {work.map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between items-baseline font-bold text-[11pt]">
                  <span>{item.position} | {item.name}</span>
                  <span className="text-[10pt] whitespace-nowrap">({item.startDate})</span>
                </div>
                <ul className="list-disc list-outside ml-4 space-y-1">
                  {item.highlights.filter(h => h.trim()).map((h, i) => (
                    <li key={i} className="text-[10pt] leading-snug pl-1">
                      {h.includes(':') ? (
                        <>
                          <span className="font-bold">{h.split(':')[0]}:</span>
                          {h.split(':').slice(1).join(':')}
                        </>
                      ) : h}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Achievements */}
      {awards && awards.length > 0 && (
        <section className="mb-6">
          <SectionTitle title="Key Achievements & Awards" />
          <ul className="list-disc list-outside ml-4 space-y-1">
            {awards.map((award, idx) => (
              <li key={idx} className="text-[10pt] leading-snug pl-1">
                {award.summary.includes(':') ? (
                   <>
                     <span className="font-bold">{award.summary.split(':')[0]}:</span>
                     {award.summary.split(':').slice(1).join(':')}
                   </>
                ) : award.summary}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* POR */}
      {volunteer && volunteer.length > 0 && (
        <section className="mb-6">
          <SectionTitle title="Positions of Responsibility" />
          <div className="space-y-4">
            {volunteer.map((por, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between items-baseline font-bold text-[11pt]">
                  <span>{por.position} | {por.organization}</span>
                  <span className="text-[10pt] whitespace-nowrap">({por.startDate})</span>
                </div>
                <ul className="list-disc list-outside ml-4 space-y-1">
                  {por.highlights.filter(h => h.trim()).map((h, i) => (
                    <li key={i} className="text-[10pt] leading-snug pl-1">{h}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <section className="mb-6">
          <SectionTitle title="Skills & Tools" />
          <ul className="list-disc list-outside ml-4 space-y-2">
            {skills.map((skill, idx) => (
              <li key={idx} className="text-[10pt] leading-snug pl-1">
                <span className="font-bold">{skill.name}:</span> {skill.keywords.join(', ')}
              </li>
            ))}
          </ul>
        </section>
      )}

      <style jsx global>{`
        @page {
          size: A4;
          margin: 0;
        }
      `}</style>
    </div>
  );
}
