"use client";

import { useResumeStore } from "@/hooks/use-resume-store";

export default function ResumePreview() {
  const { resume, template } = useResumeStore();

  if (!resume) {
    return (
      <div className="h-full flex items-center justify-center text-on-surface-variant/30 italic font-medium">
        Enter data to see preview
      </div>
    );
  }

  return (
    <>
      {template === 'template1' && <Template1 resume={resume} />}
      {template === 'template2' && <Template2 resume={resume} />}
      {template === 'template3' && <Template3 resume={resume} />}
      <style jsx global>{`
        @page { size: A4; margin: 0; }
        #resume-a4-target * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      `}</style>
    </>
  );
}

function Template1({ resume }: { resume: any }) {
  const { basics, work, education, skills, awards, volunteer } = resume;

  const SectionTitle = ({ title }: { title: string }) => (
    <div className="bg-[#E5E7EB] px-2 py-0.5 mb-2 border-b border-black">
      <h2 className="text-[11pt] font-bold text-black uppercase tracking-tight">{title}</h2>
    </div>
  );

  return (
    <div id="resume-a4-target" className="bg-white text-black w-[210mm] min-h-[297mm] p-[15mm] font-['Arial',sans-serif] leading-[1.2] flex flex-col box-border">
      <header className="text-center mb-4">
        <h1 className="text-[24pt] font-bold tracking-tight mb-1 uppercase">{basics.name || "YOUR NAME"}</h1>
        <div className="flex justify-center flex-wrap gap-x-3 gap-y-1 text-[9pt] font-medium border-b border-black pb-2">
          {basics.email && <span>Email: <a href={`mailto:${basics.email}`} className="text-blue-700 underline">{basics.email}</a></span>}
          {basics.phone && <span className="before:content-['|'] before:mr-3">Mobile: {basics.phone}</span>}
          {basics.url && <span className="before:content-['|'] before:mr-3"><a href={basics.url} className="text-blue-700 underline">LinkedIn</a></span>}
        </div>
      </header>

      {education.length > 0 && (
        <section className="mb-4">
          <SectionTitle title="Education" />
          <table className="w-full border-collapse border border-black text-[9pt]">
            <thead>
              <tr className="bg-white">
                <th className="border border-black px-2 py-1 text-left font-bold w-1/3">Degree</th>
                <th className="border border-black px-2 py-1 text-left font-bold w-1/4">Institute</th>
                <th className="border border-black px-2 py-1 text-left font-bold w-1/3">Details/Focus</th>
                <th className="border border-black px-2 py-1 text-center font-bold">Year</th>
              </tr>
            </thead>
            <tbody>
              {education.map((edu: any, idx: number) => (
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

      {work.length > 0 && (
        <section className="mb-4">
          <SectionTitle title="Professional Experience" />
          <div className="space-y-3">
            {work.map((item: any, idx: number) => (
              <div key={idx} className="space-y-0.5">
                <div className="flex justify-between items-baseline font-bold text-[10pt]">
                  <span>{item.position} | {item.name}</span>
                  <span className="text-[9pt] whitespace-nowrap">({item.startDate})</span>
                </div>
                <ul className="list-disc list-outside ml-5 space-y-0.5">
                  {item.highlights.filter((h: string) => h.trim()).map((h: string, i: number) => (
                    <li key={i} className="text-[9pt] leading-tight pl-1">{h}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}

      {awards && awards.length > 0 && (
        <section className="mb-4">
          <SectionTitle title="Key Achievements & Awards" />
          <ul className="list-disc list-outside ml-5 space-y-0.5">
            {awards.map((award: any, idx: number) => (
              <li key={idx} className="text-[9pt] leading-tight pl-1">{award.summary}</li>
            ))}
          </ul>
        </section>
      )}

      {volunteer && volunteer.length > 0 && (
        <section className="mb-4">
          <SectionTitle title="Positions of Responsibility" />
          <div className="space-y-3">
            {volunteer.map((por: any, idx: number) => (
              <div key={idx} className="space-y-0.5">
                <div className="flex justify-between items-baseline font-bold text-[10pt]">
                  <span>{por.position} | {por.organization}</span>
                  <span className="text-[9pt] whitespace-nowrap">({por.startDate})</span>
                </div>
                <ul className="list-disc list-outside ml-5 space-y-0.5">
                  {por.highlights.filter((h: string) => h.trim()).map((h: string, i: number) => (
                    <li key={i} className="text-[9pt] leading-tight pl-1">{h}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}

      {skills.length > 0 && (
        <section className="mb-4">
          <SectionTitle title="Skills & Tools" />
          <ul className="list-disc list-outside ml-5 space-y-1">
            {skills.map((skill: any, idx: number) => (
              <li key={idx} className="text-[9pt] leading-tight pl-1">
                <span className="font-bold">{skill.name}:</span> {skill.keywords.join(', ')}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

function Template2({ resume }: { resume: any }) {
  const { basics, work, education, skills, awards, volunteer } = resume;

  const SectionTitle = ({ title }: { title: string }) => (
    <div className="mb-3 mt-4 border-b-2 border-indigo-600 pb-1">
      <h2 className="text-[12pt] font-black text-indigo-900 uppercase tracking-widest">{title}</h2>
    </div>
  );

  return (
    <div id="resume-a4-target" className="bg-white text-gray-900 w-[210mm] min-h-[297mm] p-[15mm] font-['Inter',sans-serif] leading-[1.3] flex flex-col box-border">
      <header className="mb-6 flex flex-col items-start">
        <h1 className="text-[28pt] font-black tracking-tight mb-2 text-indigo-900">{basics.name || "YOUR NAME"}</h1>
        <div className="text-[10pt] font-medium text-gray-600 space-x-4">
          {basics.email && <span>{basics.email}</span>}
          {basics.phone && <span>• {basics.phone}</span>}
          {basics.url && <span>• {basics.url}</span>}
        </div>
      </header>

      {education.length > 0 && (
        <section>
          <SectionTitle title="Education" />
          <div className="space-y-3">
            {education.map((edu: any, idx: number) => (
              <div key={idx} className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-[10pt] text-gray-900">{edu.area}</h3>
                  <div className="text-[9.5pt] text-gray-700">{edu.institution}</div>
                  <div className="text-[9pt] text-gray-500 italic mt-0.5">{edu.details}</div>
                </div>
                <div className="font-semibold text-[9.5pt] text-indigo-600 whitespace-nowrap">{edu.endDate}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {work.length > 0 && (
        <section>
          <SectionTitle title="Experience" />
          <div className="space-y-4">
            {work.map((item: any, idx: number) => (
              <div key={idx}>
                <div className="flex justify-between items-start mb-1">
                  <div>
                    <h3 className="font-bold text-[10.5pt] text-gray-900">{item.position}</h3>
                    <div className="text-[9.5pt] font-medium text-indigo-600">{item.name}</div>
                  </div>
                  <div className="font-medium text-[9.5pt] text-gray-500">{item.startDate}</div>
                </div>
                <ul className="list-disc list-outside ml-4 space-y-1 mt-1.5">
                  {item.highlights.filter((h: string) => h.trim()).map((h: string, i: number) => (
                    <li key={i} className="text-[9.5pt] text-gray-700 pl-1">{h}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}

      {awards && awards.length > 0 && (
        <section>
          <SectionTitle title="Achievements" />
          <ul className="list-disc list-outside ml-4 space-y-1">
            {awards.map((award: any, idx: number) => (
              <li key={idx} className="text-[9.5pt] text-gray-700 pl-1">{award.summary}</li>
            ))}
          </ul>
        </section>
      )}

      {volunteer && volunteer.length > 0 && (
        <section>
          <SectionTitle title="Leadership" />
          <div className="space-y-4">
            {volunteer.map((por: any, idx: number) => (
              <div key={idx}>
                <div className="flex justify-between items-start mb-1">
                  <div>
                    <h3 className="font-bold text-[10pt] text-gray-900">{por.position}</h3>
                    <div className="text-[9.5pt] text-indigo-600">{por.organization}</div>
                  </div>
                  <div className="text-[9.5pt] text-gray-500">{por.startDate}</div>
                </div>
                <ul className="list-disc list-outside ml-4 space-y-1 mt-1">
                  {por.highlights.filter((h: string) => h.trim()).map((h: string, i: number) => (
                    <li key={i} className="text-[9.5pt] text-gray-700 pl-1">{h}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}

      {skills.length > 0 && (
        <section>
          <SectionTitle title="Skills" />
          <div className="grid grid-cols-1 gap-2">
            {skills.map((skill: any, idx: number) => (
              <div key={idx} className="text-[9.5pt]">
                <span className="font-bold text-gray-900">{skill.name}:</span> <span className="text-gray-700">{skill.keywords.join(', ')}</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function Template3({ resume }: { resume: any }) {
  const { basics, work, education, skills, awards, volunteer } = resume;

  const SectionTitle = ({ title }: { title: string }) => (
    <div className="mb-2 mt-4 text-center">
      <h2 className="text-[11pt] font-semibold text-gray-800 uppercase tracking-widest border-y border-gray-300 py-1 inline-block px-8">{title}</h2>
    </div>
  );

  return (
    <div id="resume-a4-target" className="bg-white text-gray-800 w-[210mm] min-h-[297mm] p-[15mm] font-['Georgia',serif] leading-[1.3] flex flex-col box-border">
      <header className="text-center mb-6">
        <h1 className="text-[26pt] font-normal tracking-wide mb-2 text-gray-900 uppercase">{basics.name || "YOUR NAME"}</h1>
        <div className="text-[9.5pt] flex justify-center items-center gap-2">
          {basics.email && <span>{basics.email}</span>}
          {basics.phone && <><span>|</span><span>{basics.phone}</span></>}
          {basics.url && <><span>|</span><span>{basics.url}</span></>}
        </div>
      </header>

      {education.length > 0 && (
        <section>
          <SectionTitle title="Education" />
          <div className="space-y-2 mt-2">
            {education.map((edu: any, idx: number) => (
              <div key={idx} className="flex justify-between">
                <div>
                  <span className="font-bold text-[10pt]">{edu.institution}</span>
                  <span className="text-[10pt] italic"> — {edu.area}</span>
                  <div className="text-[9pt] mt-0.5">{edu.details}</div>
                </div>
                <div className="text-[9.5pt] whitespace-nowrap">{edu.endDate}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {work.length > 0 && (
        <section>
          <SectionTitle title="Experience" />
          <div className="space-y-3 mt-2">
            {work.map((item: any, idx: number) => (
              <div key={idx}>
                <div className="flex justify-between font-bold text-[10pt] mb-1">
                  <span>{item.position}, {item.name}</span>
                  <span className="font-normal">{item.startDate}</span>
                </div>
                <ul className="list-square list-outside ml-4 space-y-1">
                  {item.highlights.filter((h: string) => h.trim()).map((h: string, i: number) => (
                    <li key={i} className="text-[9.5pt] pl-1">{h}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}

      {awards && awards.length > 0 && (
        <section>
          <SectionTitle title="Awards" />
          <ul className="list-square list-outside ml-4 space-y-1 mt-2">
            {awards.map((award: any, idx: number) => (
              <li key={idx} className="text-[9.5pt] pl-1">{award.summary}</li>
            ))}
          </ul>
        </section>
      )}

      {volunteer && volunteer.length > 0 && (
        <section>
          <SectionTitle title="Volunteer & Leadership" />
          <div className="space-y-3 mt-2">
            {volunteer.map((por: any, idx: number) => (
              <div key={idx}>
                <div className="flex justify-between font-bold text-[10pt] mb-1">
                  <span>{por.position}, {por.organization}</span>
                  <span className="font-normal">{por.startDate}</span>
                </div>
                <ul className="list-square list-outside ml-4 space-y-1">
                  {por.highlights.filter((h: string) => h.trim()).map((h: string, i: number) => (
                    <li key={i} className="text-[9.5pt] pl-1">{h}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}

      {skills.length > 0 && (
        <section>
          <SectionTitle title="Skills" />
          <div className="mt-2 space-y-1">
            {skills.map((skill: any, idx: number) => (
              <div key={idx} className="text-[9.5pt]">
                <span className="font-bold">{skill.name}:</span> {skill.keywords.join(', ')}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
