import { apiGet } from '../api/client';
import type { AdminUserDetail, AdminUsersResponse, UserListQuery } from '../types/user';

export function getUsers(query: UserListQuery, signal?: AbortSignal): Promise<AdminUsersResponse> {
	const params = new URLSearchParams();
	const search = query.search.trim();
	if (search) params.set('search', search);
	if (query.access !== 'all') params.set('access', query.access);
	params.set('sort', query.sort);
	params.set('page', String(query.page));
	params.set('pageSize', String(query.pageSize));
	const suffix = params.toString();
	return apiGet<AdminUsersResponse>(suffix ? `/api/admin/users?${suffix}` : '/api/admin/users', signal);
}

export function getUserDetail(id: number | string, signal?: AbortSignal): Promise<AdminUserDetail> {
	return apiGet<AdminUserDetail>(`/api/admin/users/${encodeURIComponent(String(id))}`, signal);
}
