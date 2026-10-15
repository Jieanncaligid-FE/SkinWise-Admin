import type { ReactNode } from 'react';
import { useAuth } from './context';
import Login from './Login';

export default function ProtectedRoute({ children }: { children: ReactNode }) {
	const { status } = useAuth();

	if (status === 'checking') {
		return (
			<main className="grid min-h-screen place-items-center bg-[#FAF5F4] px-4">
				<p role="status" className="text-[12px] text-[#1E0C08]/60">Checking your session…</p>
			</main>
		);
	}

	return status === 'authenticated' ? children : <Login />;
}
