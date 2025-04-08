import api from './api';

export type MemberRole = 'MEMBER' | 'COLLABORATOR' | 'PASTOR' | 'PRESBYTER' | 'EVANGELIST' | 'DEACON';
export type Sex = 'MALE' | 'FEMALE';
export type CivilState = 'SINGLE' | 'MARRIED' | 'DIVORCED' | 'WIDOWED';
export type HolySpiritBaptism = 'SIM' | 'NAO';

export interface Member {
  id: number;
  fullName: string;
  role: MemberRole;
  phone: string;
  birthDate: string;
  sex: Sex;
  zipCode: string;
  city: string;
  neighborhood: string;
  address: string;
  number?: string;
  complement?: string;
  state: string;
  civilState: CivilState;
  cpf: string;
  nationality: string;
  filiation: string;
  profession: string;
  birthPlace: string;
  baptismDate?: string;
  baptismPlace?: string;
  holySpiritBaptism: HolySpiritBaptism;
  holySpiritBaptismDate?: string;
  holySpiritBaptismPlace?: string;
  recommendationLetterDate?: string;
  recommendationLetter?: string;
  churchId: number;
  active: boolean;
}

interface MemberFilters {
  churchId?: number;
  page?: number;
  size?: number;
  name?: string;
}

export interface CreateMemberData extends Omit<Member, 'id' | 'active'> {}

class MemberService {
  async getAll(filters?: MemberFilters) {
    try {
      console.log('Debug - Getting all members with filters:', filters);
      const params = new URLSearchParams();
      
      // Sempre inclui o churchId=1 por padrão
      params.append('churchId', '1');
      
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && key !== 'churchId') { // Ignora churchId dos filtros
            params.append(key, value.toString());
          }
        });
      }

      const queryString = params.toString();
      const url = `/members?${queryString}`;
      
      console.log('Debug - Request URL:', url);
      const response = await api.get(url);
      console.log('Debug - GetAll response:', response);
      return response.data;
    } catch (error) {
      console.error('Debug - GetAll error:', error);
      throw error;
    }
  }

  async getById(id: number) {
    try {
      console.log('Debug - Starting getById request for member:', id);
      
      const token = localStorage.getItem('token');
      console.log('Debug - Token present:', !!token);
      
      const url = `/members/${id}`;
      console.log('Debug - Request URL:', url);
      
      const response = await api.get(url);
      console.log('Debug - GetById raw response:', response);
      
      return response.data;
    } catch (error) {
      console.error('Debug - GetById error details:', error);
      throw error;
    }
  }

  async create(member: CreateMemberData) {
    try {
      console.log('Debug - Creating member:', member);
      const response = await api.post('/members', {
        ...member,
        active: true
      });
      console.log('Debug - Create response:', response);
      return response.data;
    } catch (error) {
      console.error('Debug - Create error:', error);
      throw error;
    }
  }

  async update(id: number, member: Partial<Omit<Member, 'id' | 'active' | 'churchId'>>) {
    try {
      console.log('Debug - Updating member:', id, member);
      const response = await api.patch(`/members/${id}`, member);
      console.log('Debug - Update response:', response);
      return response.data;
    } catch (error) {
      console.error('Debug - Update error:', error);
      throw error;
    }
  }

  async delete(id: number) {
    try {
      console.log('Debug - Deleting member:', id);
      const response = await api.delete(`/members/${id}`);
      console.log('Debug - Delete response:', response);
      return response.data;
    } catch (error) {
      console.error('Debug - Delete error:', error);
      throw error;
    }
  }
}

export const memberService = new MemberService(); 