export function safeParse<T = any>(value: string | null | undefined): T | null {
  if (!value || typeof value !== 'string') return null;

  if (value.trim() === '') return null;

  try {
    return JSON.parse(value) as T;
  } catch (error) {
    console.warn('[SafeJSON] Failed to parse:', value.substring(0, 100), error);
    return null;
  }
}

export function safeParseFromStorage(key: string): any | null {
  if (typeof window === 'undefined') return null;

  const value = localStorage.getItem(key) || sessionStorage.getItem(key);
  return safeParse(value);
}

export function safeStringify(value: any): string | null {
  try {
    return JSON.stringify(value);
  } catch (error) {
    console.warn('[SafeJSON] Failed to stringify:', error);
    return null;
  }
}

export async function safeParseResponse<T = any>(response: Response): Promise<T | null> {

  if (!response.ok) {
    console.warn('[SafeJSON] Response not OK:', response.status, response.statusText);
    return null;
  }

  const contentType = response.headers.get('content-type');
  if (!contentType || !contentType.includes('application/json')) {
    console.warn('[SafeJSON] Response is not JSON:', contentType);
    return null;
  }

  const text = await response.text();

  if (!text || text.trim() === '') {
    console.warn('[SafeJSON] Empty response body');
    return null;
  }

  return safeParse<T>(text);
}

export default { safeParse, safeParseFromStorage, safeStringify, safeParseResponse };
