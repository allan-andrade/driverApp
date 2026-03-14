'use client';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api';

type RefreshResponse = {
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
};

let refreshPromise: Promise<string | null> | null = null;

function getAccessToken() {
  return localStorage.getItem('accessToken');
}

function getRefreshToken() {
  return localStorage.getItem('refreshToken');
}

function persistTokens(tokens: RefreshResponse['tokens']) {
  localStorage.setItem('accessToken', tokens.accessToken);
  localStorage.setItem('refreshToken', tokens.refreshToken);
}

function clearSession() {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
}

async function refreshAccessToken(): Promise<string | null> {
  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = (async () => {
    const refreshToken = getRefreshToken();
    if (!refreshToken) {
      clearSession();
      return null;
    }

    const response = await fetch(`${API_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
      cache: 'no-store',
    });

    if (!response.ok) {
      clearSession();
      return null;
    }

    const data = (await response.json()) as RefreshResponse;
    persistTokens(data.tokens);
    return data.tokens.accessToken;
  })()
    .catch(() => {
      clearSession();
      return null;
    })
    .finally(() => {
      refreshPromise = null;
    });

  return refreshPromise;
}

function isAuthPath(path: string) {
  return path.startsWith('/auth/');
}

async function doRequest(path: string, init?: RequestInit, token?: string) {
  return fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init?.headers ?? {}),
    },
    cache: 'no-store',
  });
}

export async function clientApiRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const accessToken = getAccessToken();
  let response = await doRequest(path, init, accessToken ?? undefined);

  if (response.status === 401 && !isAuthPath(path)) {
    const refreshedToken = await refreshAccessToken();
    if (refreshedToken) {
      response = await doRequest(path, init, refreshedToken);
    }
  }

  if (!response.ok) {
    throw new Error(await response.text());
  }

  return response.json();
}
