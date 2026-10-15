const apiBaseUrl = import.meta.env.VITE_API_BASE_URL?.replace(/\/+$/, '') ?? '';

export const isApiConfigured = apiBaseUrl.length > 0;

export interface ApiRequestOptions {
	signal?: AbortSignal;
	/**
	 * What to do when the server answers 401. Defaults to 'redirect', which
	 * notifies the registered unauthorized handler (the auth provider clears
	 * the in-memory admin and sends the user to the login page). Auth calls
	 * themselves use 'ignore' and map the status to a message instead.
	 */
	unauthorized?: 'redirect' | 'ignore';
}

export class ApiError extends Error {
	readonly status: number;
	readonly retryAfterSec?: number;
	readonly body?: unknown;

	constructor(message: string, status: number, retryAfterSec?: number, body?: unknown) {
		super(message);
		this.name = 'ApiError';
		this.status = status;
		if (retryAfterSec !== undefined) this.retryAfterSec = retryAfterSec;
		if (body !== undefined) this.body = body;
	}
}

type UnauthorizedHandler = () => void;

let unauthorizedHandler: UnauthorizedHandler | null = null;

export function setUnauthorizedHandler(handler: UnauthorizedHandler | null) {
	unauthorizedHandler = handler;
}

function parseRetryAfterSec(response: Response, body: unknown): number | undefined {
	const header = response.headers.get('Retry-After');
	if (header !== null) {
		const fromHeader = Number.parseInt(header.trim(), 10);
		if (Number.isSafeInteger(fromHeader) && fromHeader >= 0) return fromHeader;
	}
	if (typeof body === 'object' && body !== null && 'retryAfterSec' in body) {
		const fromBody = (body as { retryAfterSec?: unknown }).retryAfterSec;
		if (typeof fromBody === 'number' && Number.isFinite(fromBody) && fromBody >= 0) {
			return Math.ceil(fromBody);
		}
	}
	return undefined;
}

async function readBody(response: Response): Promise<unknown> {
	try {
		return await response.json();
	} catch {
		return null;
	}
}

async function apiRequest<T>(path: string, init: RequestInit = {}, options: ApiRequestOptions = {}): Promise<T> {
	if (!isApiConfigured) {
		throw new Error('VITE_API_BASE_URL is not configured.');
	}

	const normalizedPath = path.startsWith('/') ? path : `/${path}`;
	const headers = new Headers(init.headers);
	headers.set('Accept', 'application/json');
	if (init.body !== undefined && init.body !== null) headers.set('Content-Type', 'application/json');

	let response: Response;
	try {
		response = await fetch(`${apiBaseUrl}${normalizedPath}`, {
			...init,
			signal: options.signal ?? init.signal,
			credentials: 'include',
			headers,
		});
	} catch {
		throw new ApiError('Cannot reach the server. Check your connection and try again.', 0);
	}

	if (response.status === 204) return undefined as T;

	const body = await readBody(response);

	if (!response.ok) {
		const retryAfterSec = response.status === 429 ? parseRetryAfterSec(response, body) : undefined;
		if (response.status === 401 && (options.unauthorized ?? 'redirect') === 'redirect') {
			unauthorizedHandler?.();
		}
		throw new ApiError(`API request failed with status ${response.status}.`, response.status, retryAfterSec, body);
	}

	return body as T;
}

export function apiGet<T>(path: string, signal?: AbortSignal, options?: ApiRequestOptions): Promise<T> {
	return apiRequest<T>(path, { method: 'GET' }, { ...options, signal: options?.signal ?? signal });
}

export function apiPost<T>(path: string, body: unknown, options?: ApiRequestOptions): Promise<T> {
	return apiRequest<T>(path, { method: 'POST', body: JSON.stringify(body) }, options);
}

export function apiPut<T>(path: string, body: unknown, options?: ApiRequestOptions): Promise<T> {
	return apiRequest<T>(path, { method: 'PUT', body: JSON.stringify(body) }, options);
}

export function apiPatch<T>(path: string, body: unknown, options?: ApiRequestOptions): Promise<T> {
	return apiRequest<T>(path, { method: 'PATCH', body: JSON.stringify(body) }, options);
}

export function apiDelete(path: string, options?: ApiRequestOptions): Promise<void> {
	return apiRequest<void>(path, { method: 'DELETE' }, options);
}
