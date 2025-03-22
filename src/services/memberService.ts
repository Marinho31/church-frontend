import api from './api';

export type MemberRole = 'MEMBER' | 'COLLABORATOR' | 'PASTOR' | 'PRESBYTER' | 'EVANGELIST' | 'DEACON';
export type Sex = 'MALE' | 'FEMALE';
export type CivilState = 'SINGLE' | 'MARRIED' | 'DIVORCED' | 'WIDOWED';

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
  state: string;
  holySpiritBaptismDate?: string;
  holySpiritBaptismPlace?: string;
  civilState: CivilState;
  baptismDate?: string;
  baptismPlace?: string;
  recommendationLetter?: string;
  recommendationLetterDate?: string;
  cpf: string;
  nationality: string;
  filiation: string;
  profession: string;
  birthPlace: string;
  churchId: number;
}

class MemberService {
  async create(member: Omit<Member, 'id'>) {
    const response = await api.post('/members', member);
    return response.data;
  }

  async getAll() {
    const response = await api.get('/members');
    return response.data;
  }

  async getById(id: number) {
    const response = await api.get(`/members/${id}`);
    return response.data;
  }

  async update(id: number, member: Partial<Omit<Member, 'id'>>) {
    const response = await api.patch(`/members/${id}`, member);
    return response.data;
  }

  async delete(id: number) {
    await api.delete(`/members/${id}`);
  }
}

export const memberService = new MemberService(); 