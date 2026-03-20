export const SubscriptionStatusEnum = {
  DRAFT: 'DRAFT',
  PENDING_APPROVAL: 'PENDING_APPROVAL',
  APPROVED: 'APPROVED',
  ACTIVE: 'ACTIVE',
  SUSPENDED: 'SUSPENDED',
  EXPIRED: 'EXPIRED',
  CANCELLED: 'CANCELLED',
} as const;

export type SubscriptionLifecycleStatus =
  (typeof SubscriptionStatusEnum)[keyof typeof SubscriptionStatusEnum];

export const LicenseStatusEnum = {
  DRAFT: 'DRAFT',
  GENERATED: 'GENERATED',
  ISSUED: 'ISSUED',
  ACTIVATION_PENDING: 'ACTIVATION_PENDING',
  ACTIVE: 'ACTIVE',
  GRACE: 'GRACE',
  EXPIRED: 'EXPIRED',
  REVOKED: 'REVOKED',
} as const;

export type LicenseLifecycleStatus =
  (typeof LicenseStatusEnum)[keyof typeof LicenseStatusEnum];

export const ActivationStatusEnum = {
  NOT_BOUND: 'NOT_BOUND',
  REQUEST_RECEIVED: 'REQUEST_RECEIVED',
  VERIFIED: 'VERIFIED',
  ACTIVATED: 'ACTIVATED',
  MISMATCH: 'MISMATCH',
  BLOCKED: 'BLOCKED',
} as const;

export type ActivationStatus =
  (typeof ActivationStatusEnum)[keyof typeof ActivationStatusEnum];

export const SUBSCRIPTION_STATUS_FLOW: SubscriptionLifecycleStatus[] = [
  SubscriptionStatusEnum.DRAFT,
  SubscriptionStatusEnum.PENDING_APPROVAL,
  SubscriptionStatusEnum.APPROVED,
  SubscriptionStatusEnum.ACTIVE,
  SubscriptionStatusEnum.SUSPENDED,
  SubscriptionStatusEnum.EXPIRED,
  SubscriptionStatusEnum.CANCELLED,
];

export const LICENSE_STATUS_FLOW: LicenseLifecycleStatus[] = [
  LicenseStatusEnum.DRAFT,
  LicenseStatusEnum.GENERATED,
  LicenseStatusEnum.ISSUED,
  LicenseStatusEnum.ACTIVATION_PENDING,
  LicenseStatusEnum.ACTIVE,
  LicenseStatusEnum.GRACE,
  LicenseStatusEnum.EXPIRED,
  LicenseStatusEnum.REVOKED,
];

export const ACTIVATION_STATUS_FLOW: ActivationStatus[] = [
  ActivationStatusEnum.NOT_BOUND,
  ActivationStatusEnum.REQUEST_RECEIVED,
  ActivationStatusEnum.VERIFIED,
  ActivationStatusEnum.ACTIVATED,
  ActivationStatusEnum.MISMATCH,
  ActivationStatusEnum.BLOCKED,
];

export const SUBSCRIPTION_STATUS_TRANSITIONS: Record<
  SubscriptionLifecycleStatus,
  SubscriptionLifecycleStatus[]
> = {
  DRAFT: ['PENDING_APPROVAL', 'CANCELLED'],
  PENDING_APPROVAL: ['APPROVED', 'CANCELLED'],
  APPROVED: ['ACTIVE', 'SUSPENDED', 'CANCELLED'],
  ACTIVE: ['SUSPENDED', 'EXPIRED', 'CANCELLED'],
  SUSPENDED: ['ACTIVE', 'EXPIRED', 'CANCELLED'],
  EXPIRED: ['CANCELLED'],
  CANCELLED: [],
};

export const LICENSE_STATUS_TRANSITIONS: Record<
  LicenseLifecycleStatus,
  LicenseLifecycleStatus[]
> = {
  DRAFT: ['GENERATED'],
  GENERATED: ['ISSUED', 'REVOKED'],
  ISSUED: ['ACTIVATION_PENDING', 'ACTIVE', 'REVOKED'],
  ACTIVATION_PENDING: ['ACTIVE', 'REVOKED', 'EXPIRED'],
  ACTIVE: ['GRACE', 'EXPIRED', 'REVOKED'],
  GRACE: ['ACTIVE', 'EXPIRED', 'REVOKED'],
  EXPIRED: [],
  REVOKED: [],
};

export const ACTIVATION_STATUS_TRANSITIONS: Record<
  ActivationStatus,
  ActivationStatus[]
> = {
  NOT_BOUND: ['REQUEST_RECEIVED', 'BLOCKED'],
  REQUEST_RECEIVED: ['VERIFIED', 'MISMATCH', 'BLOCKED'],
  VERIFIED: ['ACTIVATED', 'MISMATCH', 'BLOCKED'],
  ACTIVATED: [],
  MISMATCH: ['VERIFIED', 'BLOCKED'],
  BLOCKED: [],
};

export const LICENSE_GENERATION_ALLOWED_SUBSCRIPTION_STATUSES: SubscriptionLifecycleStatus[] = [
  SubscriptionStatusEnum.APPROVED,
  SubscriptionStatusEnum.ACTIVE,
];

export const LICENSE_ACTIVATION_ALLOWED_SUBSCRIPTION_STATUSES: SubscriptionLifecycleStatus[] = [
  SubscriptionStatusEnum.ACTIVE,
];

export const TERMINAL_SUBSCRIPTION_STATUSES: SubscriptionLifecycleStatus[] = [
  SubscriptionStatusEnum.EXPIRED,
  SubscriptionStatusEnum.CANCELLED,
];

export const TERMINAL_LICENSE_STATUSES: LicenseLifecycleStatus[] = [
  LicenseStatusEnum.EXPIRED,
  LicenseStatusEnum.REVOKED,
];

export const TERMINAL_ACTIVATION_STATUSES: ActivationStatus[] = [
  ActivationStatusEnum.ACTIVATED,
  ActivationStatusEnum.BLOCKED,
];

export const isSubscriptionEligibleForLicenseGeneration = (
  status: SubscriptionLifecycleStatus
) => LICENSE_GENERATION_ALLOWED_SUBSCRIPTION_STATUSES.includes(status);

export const isSubscriptionEligibleForLicenseActivation = (
  status: SubscriptionLifecycleStatus
) => LICENSE_ACTIVATION_ALLOWED_SUBSCRIPTION_STATUSES.includes(status);

export const isLicenseActivationPending = (status: LicenseLifecycleStatus) =>
  status === LicenseStatusEnum.ACTIVATION_PENDING;

export const isGraceAllowed = (
  licenseStatus: LicenseLifecycleStatus,
  gracePeriodDays: number
) => licenseStatus === LicenseStatusEnum.ACTIVE && gracePeriodDays > 0;

export const isRevocationAllowed = (licenseStatus: LicenseLifecycleStatus) =>
  [
    LicenseStatusEnum.ACTIVE,
    LicenseStatusEnum.GRACE,
    LicenseStatusEnum.ACTIVATION_PENDING,
  ].includes(licenseStatus);

export const resolveLicenseStatusByDate = ({
  currentStatus,
  expiryDate,
  gracePeriodDays,
  now = new Date(),
}: {
  currentStatus: LicenseLifecycleStatus;
  expiryDate: string;
  gracePeriodDays: number;
  now?: Date;
}): LicenseLifecycleStatus => {
  if (currentStatus === LicenseStatusEnum.REVOKED) return LicenseStatusEnum.REVOKED;

  const expiry = new Date(expiryDate);
  if (Number.isNaN(expiry.getTime())) return currentStatus;

  const graceEnd = new Date(expiry);
  graceEnd.setDate(graceEnd.getDate() + Math.max(0, gracePeriodDays));

  if (now <= expiry) return currentStatus;
  if (gracePeriodDays > 0 && now <= graceEnd) return LicenseStatusEnum.GRACE;
  return LicenseStatusEnum.EXPIRED;
};

export type LicensingLifecycleDefinition = {
  subscriptionStatuses: typeof SUBSCRIPTION_STATUS_FLOW;
  licenseStatuses: typeof LICENSE_STATUS_FLOW;
  activationStatuses: typeof ACTIVATION_STATUS_FLOW;
};

export const LICENSING_LIFECYCLE: LicensingLifecycleDefinition = {
  subscriptionStatuses: SUBSCRIPTION_STATUS_FLOW,
  licenseStatuses: LICENSE_STATUS_FLOW,
  activationStatuses: ACTIVATION_STATUS_FLOW,
};
