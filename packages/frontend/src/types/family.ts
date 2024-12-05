export interface Family {
  id: string;
  name: string;
  description?: string;
  members: FamilyMember[];
  createdAt: string;
  updatedAt: string;
}

export interface FamilyMember {
  id: string;
  name: string;
  email: string;
  role: 'HEAD' | 'MEMBER';
  familyId: string;
  portfolios: Portfolio[];
  createdAt: string;
  updatedAt: string;
}

export interface Portfolio {
  id: string;
  name: string;
  description?: string;
  memberId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateFamilyInput {
  name: string;
  description?: string;
}

export interface CreateFamilyMemberInput {
  name: string;
  email: string;
  role: 'HEAD' | 'MEMBER';
}

export interface UpdateFamilyInput {
  name?: string;
  description?: string;
}

export interface UpdateFamilyMemberInput {
  name?: string;
  email?: string;
  role?: 'HEAD' | 'MEMBER';
}
