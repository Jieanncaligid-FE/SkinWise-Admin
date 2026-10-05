import type { ReactNode } from 'react';
import { useAuth } from './context';
import Login from './Login';

export default function ProtectedRoute({ children }: { children: ReactNode }) {
	const { isAuthenticated } = useAuth();
	return isAuthenticated ? children : <Login />;
}