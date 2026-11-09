export function safeGetStorage(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function safeSetStorage(key: string, value: string): void {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Gracefully fall back to in-memory state in restricted iframe environments (e.g. Google Sites)
  }
}

export function safeRemoveStorage(key: string): void {
  try {
    window.localStorage.removeItem(key);
  } catch {
    // Ignore storage denial in restricted iframe environments
  }
}
