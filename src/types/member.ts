export type MemberRole = 'MEMBER' | 'COLLABORATOR' | 'PASTOR' | 'PRESBYTER' | 'EVANGELIST' | 'DEACON';
export type Sex = 'MALE' | 'FEMALE';
export type CivilState = 'SINGLE' | 'MARRIED' | 'DIVORCED' | 'WIDOWED';

export interface Address {
  zipCode: string;
  city: string;
  neighborhood: string;
  address?: string;
  state?: string;
}

export interface Member {
  // Informações Básicas
  fullName: string;
  role: MemberRole;
  phone: string;
  birthDate: string;
  sex: Sex;

  // Endereço
  zipCode: string;
  city: string;
  neighborhood: string;
  address?: string;
  state?: string;

  // Informações Adicionais
  holySpiritBaptismDate?: string;
  holySpiritBaptismPlace?: string;
  civilState?: CivilState;
  baptismDate?: string;
  baptismPlace?: string;
  recommendationLetter?: string;
  recommendationLetterDate?: string;
  cpf?: string;
  nationality?: string;
  filiation?: string;
  profession?: string;
  birthPlace?: string;
}

export interface MemberFormData extends Member {} 