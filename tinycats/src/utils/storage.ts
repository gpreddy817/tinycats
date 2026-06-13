const PREFIX = 'tinycats:';

/**
 * Reads a value from localStorage under the tinycats: namespace.
 * Returns null if key doesn't exist or value can't be parsed.
 */
export function storageGet<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

/**
 * Writes a value to localStorage under the tinycats: namespace.
 * Fails silently if storage is full or unavailable.
 */
export function storageSet<T>(key: string, value: T): void {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    // Storage full or unavailable — fail silently
  }
}

/**
 * Removes a key from localStorage under the tinycats: namespace.
 */
export function storageRemove(key: string): void {
  try {
    localStorage.removeItem(PREFIX + key);
  } catch {
    // Fail silently
  }
}
