import api from '@/lib/api';

export interface Curriculum {
  description: string;
  modules: string[];
}

export interface Requirements {
  academic_requirements: string[];
  other_requirements: string[];
}

export interface Program {
  id: string;
  program_title: string;
  institution: string;
  program_overview: string;
  location: string;
  program_type: string;
  field_of_study: string;
  budget: number;
  duration: string;
  curriculum: Curriculum;
  requirements: Requirements;
  created_at: string;
  updated_at: string;
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