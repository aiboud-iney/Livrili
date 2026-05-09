const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;

  const possibleKeys = ['authToken', 'token', 'access_token', 'accessToken', 'jwt'];

  for (const key of possibleKeys) {
    const fromLocal = localStorage.getItem(key);
    if (fromLocal) {
      return fromLocal;
    }

    const fromSession = sessionStorage.getItem(key);
    if (fromSession) {
      return fromSession;
    }
  }

  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (possibleKeys.some(key => name.toLowerCase().includes(key.toLowerCase()))) {
      return decodeURIComponent(value);
    }
  }

  return null;
}

export function requireAuth(redirectUrl: string = '/login'): string {
  const token = getAuthToken();

  if (!token) {
    console.error('[API Client] Authentication required but no token found');
    if (typeof window !== 'undefined') {
      window.location.href = redirectUrl;
    }
    throw new Error('Authentication required');
  }

  return token;
}

export async function apiFetch(
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> {
  const token = getAuthToken();

  if (!token) {
    console.error(`[API Client] No token available for request to ${endpoint}`);
    throw new Error('Authentication required. Please log in again.');
  }

  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
    ...((options.headers as Record<string, string>) || {}),
  };

  if (options.body instanceof FormData) {
    delete headers['Content-Type'];
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (response.status === 403 || response.status === 401) {
    console.error(`[API Client] Auth error (${response.status}) for ${url}`);

  }

  return response;
}

export async function safeParseResponse<T = any>(response: Response): Promise<T | null> {
  const responseText = await response.text();

  if (!responseText || responseText.trim() === '') {
    console.warn('[API Client] Empty response body');
    return null;
  }

  try {
    return JSON.parse(responseText) as T;
  } catch (parseError) {
    console.warn('[API Client] Failed to parse JSON response:', parseError);
    return null;
  }
}

export const api = {
  get: (endpoint: string) => apiFetch(endpoint, { method: 'GET' }),
  post: (endpoint: string, body: any) =>
    apiFetch(endpoint, {
      method: 'POST',
      body: body instanceof FormData ? body : JSON.stringify(body)
    }),
  put: (endpoint: string, body: any) =>
    apiFetch(endpoint, {
      method: 'PUT',
      body: body instanceof FormData ? body : JSON.stringify(body)
    }),
  patch: (endpoint: string, body: any) =>
    apiFetch(endpoint, {
      method: 'PATCH',
      body: body instanceof FormData ? body : JSON.stringify(body)
    }),
  delete: (endpoint: string) => apiFetch(endpoint, { method: 'DELETE' }),
};

export default api;
