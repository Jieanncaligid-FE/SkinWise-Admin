const apiBaseUrl = import.meta.env.VITE_API_BASE_URL?.replace(/\/+$/, '') ?? '';

export const isApiConfigured = apiBaseUrl.length > 0;

async function apiRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
	if (!isApiConfigured) {
		throw new Error('VITE_API_BASE_URL is not configured.');
	}

	const normalizedPath = path.startsWith('/') ? path : `/${path}`;
	const headers = new Headers(init.headers);
	headers.set('Accept', 'application/json');
	if (init.body) headers.set('Content-Type', 'application/json');
	const response = await fetch(`${apiBaseUrl}${normalizedPath}`, {
		...init,
		headers,
	});

	if (!response.ok) {
		throw new Error(`API request failed with status ${response.status}.`);
	}
	if (response.status === 204) return undefined as T;

	return response.json() as Promise<T>;
}

export function apiGet<T>(path: string, signal?: AbortSignal): Promise<T> {
	return apiRequest<T>(path, { method: 'GET', signal });
}

export function apiPost<T>(path: string, body: unknown): Promise<T> {
	return apiRequest<T>(path, { method: 'POST', body: JSON.stringify(body) });
}

export function apiPut<T>(path: string, body: unknown): Promise<T> {
	return apiRequest<T>(path, { method: 'PUT', body: JSON.stringify(body) });
}

export function apiDelete(path: string): Promise<void> {
	return apiRequest<void>(path, { method: 'DELETE' });
}