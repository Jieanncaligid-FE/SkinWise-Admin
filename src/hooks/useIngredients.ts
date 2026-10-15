import { useCallback, useEffect, useState } from 'react';
import { ApiError, isApiConfigured } from '../api/client';
import { getIngredient, getIngredients } from '../services/ingredients';
import type { AdminIngredientDetail, AdminIngredientListResponse } from '../types/ingredient';

export function useIngredients() {
	const [data, setData] = useState<AdminIngredientListResponse | null>(null);
	const [isLoading, setIsLoading] = useState(isApiConfigured);
	const [error, setError] = useState<string | null>(null);
	const [reloadCount, setReloadCount] = useState(0);

	const refresh = useCallback(() => {
		setIsLoading(true);
		setError(null);
		setReloadCount((count) => count + 1);
	}, []);

	useEffect(() => {
		if (!isApiConfigured) return;

		const controller = new AbortController();
		getIngredients(controller.signal)
			.then((result) => {
				if (!controller.signal.aborted) {
					setData(result);
					setError(null);
				}
			})
			.catch((cause: unknown) => {
				if (controller.signal.aborted) return;
				setError(mapListError(cause));
			})
			.finally(() => {
				if (!controller.signal.aborted) setIsLoading(false);
			});

		return () => controller.abort();
	}, [reloadCount]);

	return { data, isLoading, error, refresh };
}

function mapListError(cause: unknown): string {
	if (cause instanceof ApiError && cause.status === 429) {
		return 'Too many requests. Try again later.';
	}
	if (cause instanceof ApiError && cause.status === 401) {
		// The shared 401 handler already sends the user to login.
		return 'Your session expired. Please log in again.';
	}
	if (cause instanceof ApiError && cause.status === 403) {
		return 'This action is not allowed.';
	}
	return cause instanceof Error ? cause.message : 'Unable to load ingredients.';
}

export function useIngredientDetail(id: number | null) {
	const [detail, setDetail] = useState<AdminIngredientDetail | null>(null);
	const [isLoading, setIsLoading] = useState(isApiConfigured && id !== null);
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
		if (!isApiConfigured || id === null) return;

		const controller = new AbortController();
		getIngredient(id, controller.signal)
			.then((result) => {
				if (!controller.signal.aborted) {
					setDetail(result);
					setError(null);
					setNotFound(false);
				}
			})
			.catch((cause: unknown) => {
				if (controller.signal.aborted) return;
				if (cause instanceof ApiError && cause.status === 404) {
					setNotFound(true);
				} else {
					setError(mapListError(cause));
				}
			})
			.finally(() => {
				if (!controller.signal.aborted) setIsLoading(false);
			});

		return () => controller.abort();
	}, [id, reloadCount]);

	return { detail, isLoading, error, notFound, retry };
}
