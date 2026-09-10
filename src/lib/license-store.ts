const SUBMISSIONS_KEY = 'vylab_sba_submissions_v1';

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
