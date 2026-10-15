export type AdminUserAccess = 'free' | 'trial' | 'premium';

export type AdminUserListAccessFilter = 'all' | AdminUserAccess;

export type AdminUserListSort = 'newest' | 'oldest';

export interface AdminUserListItem {
	id: number;
	name: string;
	email: string;
	createdAt: string | null;
	emailVerified: boolean;
	plan: string;
	trialEndsAt: string | null;
	access: AdminUserAccess;
}

export interface AdminUsersResponse {
	users: AdminUserListItem[];
	page: number;
	pageSize: number;
	total: number;
	totalPages: number;
}

export interface UserListQuery {
	search: string;
	access: AdminUserListAccessFilter;
	sort: AdminUserListSort;
	page: number;
	pageSize: number;
}

export type AdminDetailAccess = 'free' | 'trial' | 'premium';

export interface AdminUserDetailAccount {
	id: number;
	name: string;
	email: string;
	createdAt: string | null;
	updatedAt: string | null;
	emailVerified: boolean;
	hasCompletedAssessment: boolean;
}

export interface AdminUserDetailPremium {
	plan: 'FREE' | 'PREMIUM';
	access: AdminDetailAccess;
	trialEndsAt: string | null;
	trialStartedAtEstimated: string | null;
	trialActive: boolean;
}

export interface AdminUserDetailPayment {
	referenceId: string;
	xenditId: string | null;
	planId: string;
	status: string;
	amount: number;
	currency: string;
	createdAt: string | null;
	paidAt: string | null;
}

export interface AdminUserDetail {
	user: AdminUserDetailAccount;
	premium: AdminUserDetailPremium;
	payments: AdminUserDetailPayment[];
}