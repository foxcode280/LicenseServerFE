export enum LicenseStatus {
  ACTIVE = 'ACTIVE',
  EXPIRED = 'EXPIRED',
  REVOKED = 'REVOKED',
  PENDING = 'PENDING',
}

export enum SubscriptionTier {
  BASIC = 'BASIC',
  PRO = 'PRO',
  ENTERPRISE = 'ENTERPRISE',
}

export interface License {
  id: string;
  key: string;
  companyId: string;
  companyName: string;
  status: LicenseStatus;
  tier: SubscriptionTier;
  issuedAt: string;
  expiresAt: string;
  activations: number;
  maxActivations: number;
}

export interface Company {
  id: string;
  name: string;
  email: string;
  activeLicenses: number;
  subscriptionTier: SubscriptionTier;
  joinedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'MANAGER' | 'VIEWER';
  avatar?: string;
}

export interface Stat {
  label: string;
  value: string | number;
  change: number;
  trend: 'up' | 'down';
}
