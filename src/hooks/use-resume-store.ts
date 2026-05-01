import { create } from "zustand";
import { Resume } from "@/types/resume";

interface ResumeStore {
  resume: Resume | null;
  setResume: (resume: Resume) => void;
  updateResume: (updates: Partial<Resume>) => void;
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
  languages: [],
  interests: [],
  meta: {
    canonical: "",
    version: "1.0.0",
    lastModified: new Date().toISOString(),
  },
};

export const useResumeStore = create<ResumeStore>((set) => ({
  resume: null,
  setResume: (resume) => set({ resume }),
  updateResume: (updates) =>
    set((state) => ({
      resume: state.resume ? { ...state.resume, ...updates } : null,
    })),
  resetResume: () => set({ resume: initialResume }),
}));
