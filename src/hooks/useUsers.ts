import { useEffect, useState } from 'react';
import { isApiConfigured } from '../api/client';
import { getUser, getUsers } from '../services/users';
import type { User } from '../types/user';

export function useUsers() {
	const [users, setUsers] = useState<User[]>([]);
	const [isLoading, setIsLoading] = useState(isApiConfigured);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (!isApiConfigured) return;

		const controller = new AbortController();
		getUsers(controller.signal)
			.then(setUsers)
			.catch((cause: unknown) => {
				if (!controller.signal.aborted) {
					setError(cause instanceof Error ? cause.message : 'Unable to load users.');
				}
			})
			.finally(() => {
				if (!controller.signal.aborted) setIsLoading(false);
			});

		return () => controller.abort();
	}, []);

	return { users, isLoading, error };
}

export function useUser(userId: string) {
	const [user, setUser] = useState<User | null>(null);
	const [isLoading, setIsLoading] = useState(isApiConfigured);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (!isApiConfigured) return;

		const controller = new AbortController();
		getUser(userId, controller.signal)
			.then(setUser)
			.catch((cause: unknown) => {
				if (!controller.signal.aborted) {
					setError(cause instanceof Error ? cause.message : 'Unable to load user details.');
				}
			})
			.finally(() => {
				if (!controller.signal.aborted) setIsLoading(false);
			});

		return () => controller.abort();
	}, [userId]);

	return { user, isLoading, error };
}