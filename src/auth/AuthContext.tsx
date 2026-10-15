import { useEffect, useRef, useState, type ReactNode } from 'react';
import { apiGet, apiPost, isApiConfigured, setUnauthorizedHandler } from '../api/client';
import { AuthContext, type AdminUser, type AuthStatus } from './context';

interface MeResponse {
	admin: AdminUser;
}

interface LoginResponse {
	admin: AdminUser;
}

/**
 * Shared in-flight session check so React StrictMode's double-mounted effect
 * only sends one GET /api/admin/me.
 */
let sessionPromise: Promise<AdminUser | null> | null = null;

function fetchSession(): Promise<AdminUser | null> {
	if (!sessionPromise) {
		sessionPromise = apiGet<MeResponse>('/api/admin/me', undefined, { unauthorized: 'ignore' })
			.then((response) => response.admin)
			.catch(() => null)
			.finally(() => {
				sessionPromise = null;
			});
	}
	return sessionPromise;
}

export function AuthProvider({ children }: { children: ReactNode }) {
	const [admin, setAdmin] = useState<AdminUser | null>(null);
	const [status, setStatus] = useState<AuthStatus>(() => (isApiConfigured ? 'checking' : 'anonymous'));
	const statusRef = useRef(status);

	function setSession(nextAdmin: AdminUser | null, nextStatus: AuthStatus) {
		statusRef.current = nextStatus;
		setAdmin(nextAdmin);
		setStatus(nextStatus);
	}

	useEffect(() => {
		if (!isApiConfigured) return;
		let active = true;
		void fetchSession().then((sessionAdmin) => {
			if (!active) return;
			setAdmin(sessionAdmin);
			const nextStatus = sessionAdmin ? 'authenticated' : 'anonymous';
			statusRef.current = nextStatus;
			setStatus(nextStatus);
		});
		return () => {
			active = false;
		};
	}, []);

	useEffect(() => {
		setUnauthorizedHandler(() => {
			// Only an in-memory authenticated session can expire. Calls made
			// while anonymous (login page, initial check) handle 401 themselves.
			if (statusRef.current !== 'authenticated') return;
			statusRef.current = 'anonymous';
			setAdmin(null);
			setStatus('anonymous');
			if (window.location.pathname !== '/login') {
				window.location.assign('/login?expired=1');
			}
		});
		return () => setUnauthorizedHandler(null);
	}, []);

	async function login(email: string, password: string): Promise<AdminUser> {
		// Throws ApiError on 400/401/403/429 or network failure. The Login
		// page maps the status code to a message.
		await apiPost<LoginResponse>('/api/admin/login', { email, password }, { unauthorized: 'ignore' });
		// The session lives in the httpOnly cookie, which the frontend never
		// sees. Re-read /me so the admin identity only lands in memory after
		// the cookie round-trips.
		const me = await apiGet<MeResponse>('/api/admin/me', undefined, { unauthorized: 'ignore' });
		setSession(me.admin, 'authenticated');
		return me.admin;
	}

	async function logout(): Promise<void> {
		try {
			await apiPost<{ message: string }>('/api/admin/logout', {}, { unauthorized: 'ignore' });
		} finally {
			setSession(null, 'anonymous');
		}
	}

	return <AuthContext.Provider value={{ admin, status, isAuthenticated: status === 'authenticated', login, logout }}>{children}</AuthContext.Provider>;
}
