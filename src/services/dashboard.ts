import { apiGet } from '../api/client';
import type { AdminDashboardStats } from '../types/dashboard';

export function getDashboardStats(signal?: AbortSignal): Promise<AdminDashboardStats> {
	return apiGet<AdminDashboardStats>('/api/admin/stats', signal);
}
