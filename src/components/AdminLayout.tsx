import type { ReactNode } from 'react';
import { useAuth } from '../auth/context';
import { AdminHeader } from './AdminHeader';
import { Sidebar, type SidebarItem } from './Sidebar';

interface AdminLayoutProps {
	activeItem: SidebarItem;
	children: ReactNode;
	onLogout?: () => void;
	title: string;
	subtitle?: string;
}

export function AdminLayout({
	activeItem,
	children,
	onLogout,
	title,
	subtitle,
}: AdminLayoutProps) {
	const { logout } = useAuth();
	const handleLogout = () => {
		logout();
		onLogout?.();
	};

	return (
		<div className="min-h-screen bg-[#fcf9f5] text-[#514238] md:flex">
			<Sidebar activeItem={activeItem} onLogout={handleLogout} />
			<main className="min-w-0 flex-1 px-5 py-7 sm:px-8 md:px-7 md:py-8 lg:px-9">
				<div className="mx-auto w-full max-w-[1400px]">
					<AdminHeader title={title} subtitle={subtitle} onLogout={handleLogout} />
					<div className="mt-6 sm:mt-7">{children}</div>
				</div>
			</main>
		</div>
	);
}