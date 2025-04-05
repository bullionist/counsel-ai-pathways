import api from '@/lib/api';

export interface Module {
  name: string;
  description: string;
  credits: number;
}

export interface Curriculum {
  core_modules: Module[];
  elective_modules: Module[];
}

export interface EligibilityCriteria {
  qualifications: string[];
  experience: string;
  age_limit: string;
  other_requirements: string[];
}

export interface Program {
  id: string;
  program_title: string;
  institution: string;
  program_overview: string;
  eligibility_criteria: EligibilityCriteria;
  duration: string;
  fees: number;
  curriculum: Curriculum;
  mode_of_delivery: string;
  application_details: string;
  location: string;
  additional_notes: string;
}

export const programService = {
  // Get all programs
  getAllPrograms: async () => {
    const response = await api.get<Program[]>('/api/programs');
    return response.data;
  },

  // Get program by ID
  getProgramById: async (id: string) => {
    const response = await api.get<Program>(`/api/programs/${id}`);
    return response.data;
  },

  // Search programs
  searchPrograms: async (query: string) => {
    const response = await api.get<Program[]>('/api/programs/search', {
      params: { q: query }
    });
    return response.data;
  },

  // Get recommended programs
  getRecommendedPrograms: async () => {
    const response = await api.get<Program[]>('/api/programs/recommended');
    return response.data;
  }
}; 