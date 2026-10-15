export type AdminAccessLabel = 'free' | 'trial' | 'premium';

export interface AdminStatsUsers {
	total: number;
	free: number;
	trial: number;
	premium: number;
}

export interface AdminRecentRegistration {
	id: number;
	name: string;
	email: string;
	createdAt: string | null;
	access: AdminAccessLabel;
}

export interface AdminDashboardStats {
	users: AdminStatsUsers;
	ingredients: { total: number };
	recentRegistrations: AdminRecentRegistration[];
	generatedAt: string;
}
