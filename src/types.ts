
export type SubscriptionStatus = 'Active' | 'Expired' | 'Pending' | 'Rejected';
export type LicenseStatus = 'Active' | 'Revoked' | 'Expired';
export type UserRole = 'Super Admin' | 'License Admin' | 'Company Admin' | 'Viewer';
export type CompanyStatus = 'Active' | 'Disabled' | 'Deleted' | 'Suspended';
export type DeviceTypeStatus = 'Active' | 'Inactive';
export type PlanStatus = 'Active' | 'Inactive' | 'Deleted';
export type ProductType = 'Digital Signage' | 'Endpoint Management System';
export type OfflineLicenseStatus =
  | 'Pending Approval'
  | 'Approved'
  | 'Issued'
  | 'Awaiting Fingerprint'
  | 'Fingerprint Uploaded'
  | 'Activated'
  | 'Revoked';
export type OfflineRequestStatus = 'Pending Upload' | 'Uploaded' | 'Processed';

export interface DeviceType {
  id: string;
  name: string;
  status: DeviceTypeStatus;
}

export interface DeviceAllocation {
  deviceTypeId: string;
  count: number;
}

export interface SubscriptionPlan {
  id: string;
  code: string;
  name: string;
  productType: ProductType;
  status: PlanStatus;
  duration: number; // in days
  mode: 'SaaS' | 'On-Premise' | 'Hybrid' | 'Periodic' | 'Perpetual';
  totalDeviceLimit: number;
  deviceLimitLabel?: string;
  description: string;
  highlights: string[];
  features: string[];
  price: number;
  billingLabel?: string;
}

export interface Subscription {
  id: string;
  planId: string;
  companyId: string;
  status: SubscriptionStatus;
  statusDescription?: string;
  startDate: string;
  endDate: string;
  requestedAt: string;
  approvedAt?: string;
  allocations: DeviceAllocation[];
}

export interface Company {
  id: string;
  name: string;
  email: string;
  industry: string;
  contactPerson: string;
  primaryMobile: string;
  alternateMobile?: string;
  status: CompanyStatus;
  statusDescription?: string;
  linkedSubscriptions: string[]; // IDs
  linkedLicenses: string[]; // IDs
  isDisabled?: boolean;
}

export interface License {
  id: string;
  subscriptionId: string;
  companyId: string;
  deviceTypeId: string;
  key: string;
  status: LicenseStatus;
  statusDescription?: string;
  expiryDate: string;
  activationsCount: number;
  maxActivations: number;
}

export interface OfflineFingerprint {
  machineName: string;
  macAddress: string;
  ipAddress: string;
  hostName: string;
  osHash: string;
}

export interface OfflineLicenseRecord {
  id: string;
  companyId: string;
  subscriptionId: string;
  planId: string;
  productType: ProductType;
  deviceTypeId: string;
  seats: number;
  status: OfflineLicenseStatus;
  genericLicenseFileName?: string;
  finalLicenseFileName?: string;
  requestFileName?: string;
  fingerprintHash?: string;
  notes?: string;
  createdAt: string;
  approvedAt?: string;
  issuedAt?: string;
  activatedAt?: string;
}

export interface OfflineActivationRequest {
  id: string;
  offlineLicenseId: string;
  requestFileName: string;
  fingerprintHash: string;
  fingerprint: OfflineFingerprint;
  uploadedAt: string;
  status: OfflineRequestStatus;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  designation: string;
  mobile: string;
  alternateMobile?: string;
  lastLogin: string;
  isDisabled?: boolean;
  profilePhoto?: string;
  theme: 'light' | 'dark';
  menuPosition: 'sidebar' | 'topbar';
}

export interface ActivityLog {
  id: string;
  userId: string;
  action: string;
  resource: string;
  timestamp: string;
  status: 'Success' | 'Failure';
}

export interface ConfigSettings {
  licensePolicy: {
    gracePeriod: number;
    allowOveruse: boolean;
    overuseThreshold: number;
  };
  jwtConfig: {
    issuer: string;
    expiry: number;
    algorithm: string;
  };
  encryption: {
    keySize: number;
    method: string;
  };
}
