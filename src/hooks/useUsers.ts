import { useCallback, useEffect, useRef, useState } from 'react';
import { ApiError, isApiConfigured } from '../api/client';
import { getUserDetail, getUsers } from '../services/users';
import type { AdminUserDetail, AdminUsersResponse, UserListQuery } from '../types/user';

const SEARCH_DEBOUNCE_MS = 300;

export function useUsers({ search, access, sort, page, pageSize }: UserListQuery) {
	const [data, setData] = useState<AdminUsersResponse | null>(null);
	const [isLoading, setIsLoading] = useState(isApiConfigured);
	const [error, setError] = useState<string | null>(null);
	const [reloadCount, setReloadCount] = useState(0);
	const lastSearchRef = useRef(search);

	const retry = useCallback(() => {
		setIsLoading(true);
		setError(null);
		setReloadCount((count) => count + 1);
	}, []);

	useEffect(() => {
		if (!isApiConfigured) return;

		// Wait briefly after typing before calling the API; page, filter,
		// and sort changes fetch without delay.
		const delay = lastSearchRef.current === search ? 0 : SEARCH_DEBOUNCE_MS;
		lastSearchRef.current = search;

		const controller = new AbortController();
		const timer = window.setTimeout(() => {
			setIsLoading(true);
			setError(null);
			getUsers({ search, access, sort, page, pageSize }, controller.signal)
				.then((result) => {
					if (!controller.signal.aborted) {
						setData(result);
						setError(null);
					}
				})
				.catch((cause: unknown) => {
					if (controller.signal.aborted) return;
					if (cause instanceof ApiError && cause.status === 429) {
						setError('Too many requests. Try again later.');
					} else if (cause instanceof ApiError && cause.status === 401) {
						// The shared 401 handler already sends the user to login.
						setError('Your session expired. Please log in again.');
					} else if (cause instanceof ApiError && cause.status === 403) {
						setError('This action is not allowed.');
					} else {
						setError(cause instanceof Error ? cause.message : 'Unable to load users.');
					}
				})
				.finally(() => {
					if (!controller.signal.aborted) setIsLoading(false);
				});
		}, delay);

		return () => {
			window.clearTimeout(timer);
			controller.abort();
		};
	}, [search, access, sort, page, pageSize, reloadCount]);

	return { data, isLoading, error, retry };
}

export function useUserDetail(userId: string) {
	const [data, setData] = useState<AdminUserDetail | null>(null);
	const [isLoading, setIsLoading] = useState(isApiConfigured);
	const [error, setError] = useState<string | null>(null);
	const [notFound, setNotFound] = useState(false);
	const [reloadCount, setReloadCount] = useState(0);

	const retry = useCallback(() => {
		setIsLoading(true);
		setError(null);
		setNotFound(false);
		setReloadCount((count) => count + 1);
	}, []);

	useEffect(() => {
		if (!isApiConfigured) return;

		const controller = new AbortController();
		getUserDetail(userId, controller.signal)
			.then((result) => {
				if (!controller.signal.aborted) {
					setData(result);
					setError(null);
					setNotFound(false);
				}
			})
			.catch((cause: unknown) => {
				if (controller.signal.aborted) return;
				if (cause instanceof ApiError && cause.status === 404) {
					setNotFound(true);
				} else if (cause instanceof ApiError && cause.status === 429) {
					setError('Too many requests. Try again later.');
				} else if (cause instanceof ApiError && cause.status === 401) {
					// The shared 401 handler already sends the user to login.
					setError('Your session expired. Please log in again.');
				} else if (cause instanceof ApiError && cause.status === 403) {
					setError('This action is not allowed.');
				} else {
					setError(cause instanceof Error ? cause.message : 'Unable to load user details.');
				}
			})
			.finally(() => {
				if (!controller.signal.aborted) setIsLoading(false);
			});

		return () => controller.abort();
	}, [userId, reloadCount]);

	return { data, isLoading, error, notFound, retry };
}
