import { apiGet } from '../api/client';
import type { ResourceCountResponse } from '../types/dashboard';
import type { User } from '../types/user';

export async function getUsers(signal?: AbortSignal): Promise<User[]> {
	const users = await apiGet<User[]>('/users', signal);
	if (!Array.isArray(users)) {
		throw new Error('The users response is invalid.');
	}

	return users;
}

export function getUser(id: string, signal?: AbortSignal): Promise<User> {
	return apiGet<User>(`/users/${encodeURIComponent(id)}`, signal);
}

export async function getUserCount(signal?: AbortSignal): Promise<number> {
	const response = await apiGet<ResourceCountResponse>('/users/count', signal);
	if (!Number.isSafeInteger(response.count) || response.count < 0) {
		throw new Error('The user count response is invalid.');
	}

	return response.count;
}