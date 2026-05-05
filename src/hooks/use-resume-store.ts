import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Resume } from "@/types/resume";

interface ResumeStore {
  resume: Resume | null;
  targetJob: string;
  jobDescription: string;
  template: string;
  setResume: (resume: Resume) => void;
  updateResume: (updates: Partial<Resume>) => void;
  setTargetJob: (job: string) => void;
  setJobDescription: (jd: string) => void;
  setTemplate: (template: string) => void;
  resetResume: () => void;
}

const initialResume: Resume = {
  basics: {
    name: "",
    label: "",
    email: "",
    phone: "",
    url: "",
    summary: "",
    location: { address: "", postalCode: "", city: "", countryCode: "", region: "" },
    profiles: [],
  },
  work: [],
  education: [],
  skills: [],
  projects: [],
  awards: [],
  volunteer: [],
  languages: [],
  interests: [],
  meta: {
    canonical: "",
    version: "1.0.0",
    lastModified: new Date().toISOString(),
  },
};

export const useResumeStore = create<ResumeStore>()(
  persist(
    (set) => ({
      resume: initialResume,
      targetJob: "general", // "general" or "specific"
      jobDescription: "",
      template: "template1",
      setResume: (resume) => set({ resume }),
      updateResume: (updates) =>
        set((state) => ({
          resume: state.resume ? { ...state.resume, ...updates } : null,
        })),
      setTargetJob: (job) => set({ targetJob: job }),
      setJobDescription: (jd) => set({ jobDescription: jd }),
      setTemplate: (template) => set({ template }),
      resetResume: () => set({ resume: initialResume }),
    }),
    {
      name: "resume-storage", // unique name
      storage: createJSONStorage(() => localStorage),
    }
  )
);
