export interface LicenseInfo {
  isUnlockedAll: boolean;
  unlockedPracticalIds: string[];
  licenseKey?: string;
  tier?: 'single' | 'grade_pass' | 'tutor' | 'school';
  purchasedAt?: string;
}

const LICENSE_KEY = 'vylab_sba_license_v1';
const SUBMISSIONS_KEY = 'vylab_sba_submissions_v1';

export function getLicenseInfo(): LicenseInfo {
  try {
    const raw = localStorage.getItem(LICENSE_KEY);
    if (!raw) {
      return {
        isUnlockedAll: false,
        unlockedPracticalIds: ['gr12-internal-resistance'] // Free practical always unlocked
      };
    }
    const parsed: LicenseInfo = JSON.parse(raw);
    if (!parsed.unlockedPracticalIds.includes('gr12-internal-resistance')) {
      parsed.unlockedPracticalIds.push('gr12-internal-resistance');
    }
    return parsed;
  } catch {
    return {
      isUnlockedAll: false,
      unlockedPracticalIds: ['gr12-internal-resistance']
    };
  }
}

export function isPracticalUnlocked(practicalId: string): boolean {
  if (practicalId === 'gr12-internal-resistance') return true;
  const info = getLicenseInfo();
  return info.isUnlockedAll || info.unlockedPracticalIds.includes(practicalId);
}

export function activateLicenseKey(code: string): { success: boolean; message: string } {
  const cleanCode = code.trim().toUpperCase();

  if (cleanCode.startsWith('VYLAB-ALL-') || cleanCode === 'HOMESCHOOL2026' || cleanCode === 'MATRICPASS') {
    const info: LicenseInfo = {
      isUnlockedAll: true,
      unlockedPracticalIds: ['gr12-internal-resistance', 'gr12-titration', 'gr12-reaction-rates', 'gr11-snells-law', 'gr11-boyles-law', 'gr11-newton2'],
      licenseKey: cleanCode,
      tier: 'grade_pass',
      purchasedAt: new Date().toISOString()
    };
    localStorage.setItem(LICENSE_KEY, JSON.stringify(info));
    return { success: true, message: 'All 6 CAPS SBA Practicals successfully unlocked!' };
  }

  if (cleanCode.startsWith('VYLAB-TITR-')) {
    const info = getLicenseInfo();
    if (!info.unlockedPracticalIds.includes('gr12-titration')) {
      info.unlockedPracticalIds.push('gr12-titration');
    }
    info.licenseKey = cleanCode;
    localStorage.setItem(LICENSE_KEY, JSON.stringify(info));
    return { success: true, message: 'Grade 12 Acid-Base Titration Practical unlocked!' };
  }

  return { success: false, message: 'Invalid activation code. Please check your purchase receipt or Paystack email.' };
}

export function unlockPracticalDirect(practicalId: string, tier: 'single' | 'grade_pass' = 'single') {
  const info = getLicenseInfo();
  if (tier === 'grade_pass') {
    info.isUnlockedAll = true;
    info.unlockedPracticalIds = ['gr12-internal-resistance', 'gr12-titration', 'gr12-reaction-rates', 'gr11-snells-law', 'gr11-boyles-law', 'gr11-newton2'];
    info.tier = 'grade_pass';
  } else {
    if (!info.unlockedPracticalIds.includes(practicalId)) {
      info.unlockedPracticalIds.push(practicalId);
    }
    info.tier = 'single';
  }
  info.purchasedAt = new Date().toISOString();
  localStorage.setItem(LICENSE_KEY, JSON.stringify(info));
}

export function saveSubmissionToLocal(submission: any) {
  try {
    const existing = getSavedSubmissions();
    const filtered = existing.filter(s => s.id !== submission.id);
    const updated = [submission, ...filtered];
    localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to save submission locally:', err);
  }
}

export function getSavedSubmissions(): any[] {
  try {
    const raw = localStorage.getItem(SUBMISSIONS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
