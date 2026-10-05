import { useEffect, useState } from 'react';
import { isApiConfigured } from '../api/client';
import { getIngredientCount } from '../services/ingredients';
import { getUserCount } from '../services/users';
import type { DashboardStats } from '../types/dashboard';

const initialStats: DashboardStats = {
	totalIngredients: 0,
	totalUsers: 0,
};

export function useDashboardStats(): DashboardStats {
	const [stats, setStats] = useState(initialStats);

	useEffect(() => {
		if (!isApiConfigured) return;

		const controller = new AbortController();
		const loadStats = async () => {
			const [ingredientResult, userResult] = await Promise.allSettled([
				getIngredientCount(controller.signal),
				getUserCount(controller.signal),
			]);

			if (controller.signal.aborted) return;

			setStats({
				totalIngredients: ingredientResult.status === 'fulfilled' ? ingredientResult.value : 0,
				totalUsers: userResult.status === 'fulfilled' ? userResult.value : 0,
			});
		};

		void loadStats();
		return () => controller.abort();
	}, []);

	return stats;
}