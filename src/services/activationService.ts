/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface HardwareFingerprint {
  cpuId: string;
  motherboardSerial: string;
  macAddress: string;
  ipAddress: string;
}

export interface ActivationRecord {
  id: string;
  licenseKey: string;
  fingerprint: HardwareFingerprint;
  activatedAt: string;
  token: string;
}

/**
 * Simulates the EMS (Enterprise Management System) collecting hardware info.
 */
export const collectHardwareInfo = async (): Promise<HardwareFingerprint> => {
  // In a real scenario, this would use system APIs or a native agent.
  // Here we simulate the collection.
  return {
    cpuId: 'BFEBFBFF000906E3',
    motherboardSerial: 'XYZ-789-ABC-456',
    macAddress: '00:1A:2B:3C:4D:5E',
    ipAddress: '192.168.1.105'
  };
};

/**
 * Generates a unique machine fingerprint from hardware info.
 */
export const generateFingerprintHash = (info: HardwareFingerprint): string => {
  const raw = `${info.cpuId}-${info.motherboardSerial}-${info.macAddress}`;
  // Simple hash simulation
  return btoa(raw).substring(0, 32);
};

/**
 * Simulates the License Server validation and activation.
 */
export const activateLicense = async (licenseKey: string, fingerprint: HardwareFingerprint): Promise<ActivationRecord> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  // In a real app, this would be a POST request to /api/activate
  const token = `ACT-${Math.random().toString(36).substring(2, 15).toUpperCase()}`;
  
  return {
    id: Math.random().toString(36).substring(2, 9),
    licenseKey,
    fingerprint,
    activatedAt: new Date().toISOString(),
    token
  };
};
