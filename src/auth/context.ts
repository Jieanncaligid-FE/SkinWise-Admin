import { createContext, useContext } from 'react';

interface AuthContextValue {
	isAuthenticated: boolean;
	login: (email: string, password: string, rememberMe: boolean) => boolean;
	logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
export const authStorageKey = 'skinwise-admin-authenticated';

export function useAuth() {
	const context = useContext(AuthContext);
	if (!context) throw new Error('useAuth must be used within an AuthProvider');
	return context;
}