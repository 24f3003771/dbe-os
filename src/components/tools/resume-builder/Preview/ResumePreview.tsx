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
    <div className="bg-[#E5E7EB] px-2 py-0.5 mb-2 border-b border-black">
      <h2 className="text-[11pt] font-bold text-black uppercase tracking-tight">{title}</h2>
    </div>
  );

  return (
    <div 
      id="resume-a4-target"
      className="bg-white text-black w-[210mm] min-h-[297mm] p-[15mm] font-['Arial',sans-serif] leading-[1.2] selection:bg-indigo-100 flex flex-col box-border shadow-2xl"
    >
      {/* Header */}
      <header className="text-center mb-4">
        <h1 className="text-[24pt] font-bold tracking-tight mb-1 uppercase">{basics.name || "YOUR NAME"}</h1>
        <div className="flex justify-center flex-wrap gap-x-3 gap-y-1 text-[9pt] font-medium border-b border-black pb-2">
          {basics.email && (
            <span>Email: <a href={`mailto:${basics.email}`} className="text-blue-700 underline">{basics.email}</a></span>
          )}
          {basics.phone && (
            <span className="before:content-['|'] before:mr-3">Mobile: {basics.phone}</span>
          )}
          {basics.url && (
            <span className="before:content-['|'] before:mr-3"><a href={basics.url} className="text-blue-700 underline">LinkedIn Profile</a></span>
          )}
        </div>
      </header>

      {/* Education */}
      {education.length > 0 && (
        <section className="mb-4">
          <SectionTitle title="Education" />
          <table className="w-full border-collapse border border-black text-[9pt]">
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
                  <td className="border border-black px-2 py-1 font-bold">{edu.area}</td>
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
        <section className="mb-4">
          <SectionTitle title="Professional Experience" />
          <div className="space-y-3">
            {work.map((item, idx) => (
              <div key={idx} className="space-y-0.5">
                <div className="flex justify-between items-baseline font-bold text-[10pt]">
                  <span>{item.position} | {item.name}</span>
                  <span className="text-[9pt] whitespace-nowrap">({item.startDate})</span>
                </div>
                <ul className="list-disc list-outside ml-5 space-y-0.5">
                  {item.highlights.filter(h => h.trim()).map((h, i) => (
                    <li key={i} className="text-[9pt] leading-tight pl-1">
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
        <section className="mb-4">
          <SectionTitle title="Key Achievements & Awards" />
          <ul className="list-disc list-outside ml-5 space-y-0.5">
            {awards.map((award, idx) => (
              <li key={idx} className="text-[9pt] leading-tight pl-1">
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
        <section className="mb-4">
          <SectionTitle title="Positions of Responsibility" />
          <div className="space-y-3">
            {volunteer.map((por, idx) => (
              <div key={idx} className="space-y-0.5">
                <div className="flex justify-between items-baseline font-bold text-[10pt]">
                  <span>{por.position} | {por.organization}</span>
                  <span className="text-[9pt] whitespace-nowrap">({por.startDate})</span>
                </div>
                <ul className="list-disc list-outside ml-5 space-y-0.5">
                  {por.highlights.filter(h => h.trim()).map((h, i) => (
                    <li key={i} className="text-[9pt] leading-tight pl-1">{h}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <section className="mb-4">
          <SectionTitle title="Skills & Tools" />
          <ul className="list-disc list-outside ml-5 space-y-1">
            {skills.map((skill, idx) => (
              <li key={idx} className="text-[9pt] leading-tight pl-1">
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
        #resume-a4-target * {
          -webkit-print-color-adjust: exact;
        }
      `}</style>
    </div>
  );
}
