export interface Family {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  members: FamilyMember[];
}

export interface FamilyMember {
  id: string;
  name: string;
  relation: 'self' | 'spouse' | 'child' | 'parent' | 'other';
  portfolios: Portfolio[];
}

export interface Portfolio {
  id: string;
  name: string;
  description?: string;
  assetClasses: AssetClass[];
  totalValue: number;
  createdAt: string;
  updatedAt: string;
}

export interface AssetClass {
  id: string;
  type: 'equity' | 'debt' | 'real_estate' | 'gold' | 'cash' | 'others';
  name: string;
  value: number;
  allocation: number; // Percentage allocation
  holdings: Holding[];
  createdAt: string;
  updatedAt: string;
}

export interface Holding {
  id: string;
  name: string;
  quantity: number;
  purchasePrice: number;
  currentPrice: number;
  purchaseDate: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
