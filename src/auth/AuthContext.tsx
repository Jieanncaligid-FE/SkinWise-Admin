import { useState, type ReactNode } from 'react';
import { AuthContext, authStorageKey } from './context';

function hasStoredSession() {
	return window.localStorage.getItem(authStorageKey) === 'true'
		|| window.sessionStorage.getItem(authStorageKey) === 'true';
}

export function AuthProvider({ children }: { children: ReactNode }) {
	const [isAuthenticated, setIsAuthenticated] = useState(hasStoredSession);

	function login(email: string, password: string, rememberMe: boolean) {
		const isValid = email.trim().toLowerCase() === 'appskinwise@gmail.com'
			&& password === 'test123456';

		if (!isValid) return false;

		const storage = rememberMe ? window.localStorage : window.sessionStorage;
		storage.setItem(authStorageKey, 'true');
		(rememberMe ? window.sessionStorage : window.localStorage).removeItem(authStorageKey);
		setIsAuthenticated(true);
		return true;
	}

	function logout() {
		window.localStorage.removeItem(authStorageKey);
		window.sessionStorage.removeItem(authStorageKey);
		setIsAuthenticated(false);
	}

	return <AuthContext.Provider value={{ isAuthenticated, login, logout }}>{children}</AuthContext.Provider>;
}