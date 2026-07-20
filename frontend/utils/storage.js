const STORAGE_KEY = 'cad-risk-assessment-result';

export function loadStoredResult() {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveStoredResult(result) {
  if (typeof window === 'undefined') {
    return;
  }

  if (!result) {
    window.sessionStorage.removeItem(STORAGE_KEY);
    return;
  }

  window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(result));
}
