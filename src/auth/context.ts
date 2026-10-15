import { createContext, useContext } from 'react';

export interface AdminUser {
	id: number;
	email: string;
	name: string;
}

export type AuthStatus = 'checking' | 'authenticated' | 'anonymous';

interface AuthContextValue {
	/** The signed-in admin. Kept in memory only, never in storage. */
	admin: AdminUser | null;
	status: AuthStatus;
	isAuthenticated: boolean;
	login: (email: string, password: string) => Promise<AdminUser>;
	logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth() {
	const context = useContext(AuthContext);
	if (!context) throw new Error('useAuth must be used within an AuthProvider');
	return context;
}
