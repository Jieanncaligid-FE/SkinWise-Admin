import { useCallback, useEffect, useState } from 'react';
import { ApiError, isApiConfigured } from '../api/client';
import { getDashboardStats } from '../services/dashboard';
import type { AdminDashboardStats } from '../types/dashboard';

export function useDashboardStats() {
	const [stats, setStats] = useState<AdminDashboardStats | null>(null);
	const [isLoading, setIsLoading] = useState(isApiConfigured);
	const [error, setError] = useState<string | null>(null);
	const [reloadCount, setReloadCount] = useState(0);

	const retry = useCallback(() => {
		setIsLoading(true);
		setError(null);
		setReloadCount((count) => count + 1);
	}, []);

	useEffect(() => {
		if (!isApiConfigured) return;

		const controller = new AbortController();
		getDashboardStats(controller.signal)
			.then((result) => {
				if (!controller.signal.aborted) {
					setStats(result);
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
					setError(cause instanceof Error ? cause.message : 'Unable to load dashboard stats.');
				}
			})
			.finally(() => {
				if (!controller.signal.aborted) setIsLoading(false);
			});

		return () => controller.abort();
	}, [reloadCount]);

	return { stats, isLoading, error, retry };
}
