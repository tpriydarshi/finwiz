import axios from 'axios';
import {
  Family,
  FamilyMember,
  Portfolio,
  CreateFamilyInput,
  CreateFamilyMemberInput,
  UpdateFamilyInput,
  UpdateFamilyMemberInput,
} from '../types/family';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const familyService = {
  // Family operations
  createFamily: async (data: CreateFamilyInput): Promise<Family> => {
    const response = await axios.post(`${API_URL}/families`, data);
    return response.data;
  },

  getFamilies: async (): Promise<Family[]> => {
    const response = await axios.get(`${API_URL}/families`);
    return response.data;
  },

  getFamily: async (id: string): Promise<Family> => {
    const response = await axios.get(`${API_URL}/families/${id}`);
    return response.data;
  },

  updateFamily: async (id: string, data: UpdateFamilyInput): Promise<Family> => {
    const response = await axios.put(`${API_URL}/families/${id}`, data);
    return response.data;
  },

  deleteFamily: async (id: string): Promise<void> => {
    await axios.delete(`${API_URL}/families/${id}`);
  },

  // Family Member operations
  addFamilyMember: async (familyId: string, data: CreateFamilyMemberInput): Promise<FamilyMember> => {
    const response = await axios.post(`${API_URL}/families/${familyId}/members`, data);
    return response.data;
  },

  updateFamilyMember: async (memberId: string, data: UpdateFamilyMemberInput): Promise<FamilyMember> => {
    const response = await axios.put(`${API_URL}/families/members/${memberId}`, data);
    return response.data;
  },

  removeFamilyMember: async (memberId: string): Promise<void> => {
    await axios.delete(`${API_URL}/families/members/${memberId}`);
  },

  // Portfolio operations
  addPortfolio: async (memberId: string, data: Partial<Portfolio>): Promise<Portfolio> => {
    const response = await axios.post(`${API_URL}/portfolios`, {
      ...data,
      memberId,
    });
    return response.data;
  },

  updatePortfolio: async (portfolioId: string, data: Partial<Portfolio>): Promise<Portfolio> => {
    const response = await axios.put(`${API_URL}/portfolios/${portfolioId}`, data);
    return response.data;
  },

  deletePortfolio: async (portfolioId: string): Promise<void> => {
    await axios.delete(`${API_URL}/portfolios/${portfolioId}`);
  },
};
