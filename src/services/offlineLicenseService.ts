import { OfflineActivationRequest, OfflineFingerprint, OfflineLicenseRecord } from '../types';
import { ActivationStatusEnum, LicenseStatusEnum } from '../licensingLifecycle';

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const compactHash = (value: string) =>
  Array.from(value).reduce((sum, char, index) => sum + char.charCodeAt(0) * (index + 1), 0).toString(16).toUpperCase().slice(0, 12);

export const approveOfflineLicense = async (license: OfflineLicenseRecord): Promise<OfflineLicenseRecord> => {
  await wait(500);
  return {
    ...license,
    status: 'Approved',
    workflowStatus: LicenseStatusEnum.GENERATED,
    activationStatus: ActivationStatusEnum.NOT_BOUND,
    approvedAt: new Date().toISOString().split('T')[0],
    notes: 'Subscription approval confirmed. Ready to issue generic offline license.',
  };
};

export const issueGenericOfflineLicense = async (license: OfflineLicenseRecord): Promise<OfflineLicenseRecord> => {
  await wait(700);
  const fileStub = `${license.id}_${license.productType.replace(/\s+/g, '-').toLowerCase()}`;
  return {
    ...license,
    status: 'Awaiting Fingerprint',
    workflowStatus: LicenseStatusEnum.ISSUED,
    activationStatus: ActivationStatusEnum.NOT_BOUND,
    genericLicenseFileName: `${fileStub}_generic.lic`,
    issuedAt: new Date().toISOString().split('T')[0],
    notes: 'Generic .lic file generated. Waiting for offline machine fingerprint request.',
  };
};

export const uploadOfflineFingerprintRequest = async (
  license: OfflineLicenseRecord,
  fingerprint: OfflineFingerprint
): Promise<{ license: OfflineLicenseRecord; request: OfflineActivationRequest }> => {
  await wait(700);
  const fingerprintHash = `FP-${compactHash(
    `${fingerprint.machineName}-${fingerprint.macAddress}-${fingerprint.hostName}-${fingerprint.osHash}`
  )}`;
  const requestFileName = `${fingerprint.machineName.replace(/\s+/g, '-').toLowerCase()}.req`;

  return {
    license: {
      ...license,
      status: 'Fingerprint Uploaded',
      workflowStatus: LicenseStatusEnum.ACTIVATION_PENDING,
      activationStatus: ActivationStatusEnum.REQUEST_RECEIVED,
      fingerprintHash,
      requestFileName,
      notes: 'Fingerprint request uploaded. License can now be bound and activated.',
    },
    request: {
      id: `off-req-${Date.now()}`,
      offlineLicenseId: license.id,
      requestFileName,
      fingerprintHash,
      fingerprint,
      uploadedAt: new Date().toISOString().split('T')[0],
      status: 'Uploaded',
      activationStatus: ActivationStatusEnum.REQUEST_RECEIVED,
    },
  };
};

export const bindAndActivateOfflineLicense = async (
  license: OfflineLicenseRecord,
  request: OfflineActivationRequest
): Promise<{ license: OfflineLicenseRecord; request: OfflineActivationRequest }> => {
  await wait(800);
  const finalFileName = `${request.fingerprint.machineName.replace(/\s+/g, '-').toLowerCase()}_final.lic`;

  return {
    license: {
      ...license,
      status: 'Activated',
      workflowStatus: LicenseStatusEnum.ACTIVE,
      activationStatus: ActivationStatusEnum.ACTIVATED,
      finalLicenseFileName: finalFileName,
      activatedAt: new Date().toISOString().split('T')[0],
      notes: 'Final activated .lic generated and ready for manual transfer.',
    },
    request: {
      ...request,
      status: 'Processed',
      activationStatus: ActivationStatusEnum.ACTIVATED,
    },
  };
};

export const buildOfflineArtifactPreview = (
  kind: 'generic-license' | 'request' | 'final-license',
  license: OfflineLicenseRecord,
  request?: OfflineActivationRequest
) =>
  JSON.stringify(
    {
      schemaVersion: '1.0',
      kind,
      licenseId: license.id,
      productType: license.productType,
      seats: license.seats,
      status: license.status,
      fingerprintHash: license.fingerprintHash ?? null,
      requestFileName: request?.requestFileName ?? license.requestFileName ?? null,
      finalLicenseFileName: license.finalLicenseFileName ?? null,
      generatedAt: new Date().toISOString(),
    },
    null,
    2
  );
