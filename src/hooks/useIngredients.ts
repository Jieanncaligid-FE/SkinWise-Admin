import { useEffect, useState } from 'react';
import { isApiConfigured } from '../api/client';
import {
	createIngredient as createIngredientRequest,
	deleteIngredient as deleteIngredientRequest,
	getIngredients,
	updateIngredient as updateIngredientRequest,
} from '../services/ingredients';
import type { Ingredient, IngredientDraft } from '../types/ingredient';

export function useIngredients() {
	const [ingredients, setIngredients] = useState<Ingredient[]>([]);
	const [isLoading, setIsLoading] = useState(isApiConfigured);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (!isApiConfigured) return;

		const controller = new AbortController();
		getIngredients(controller.signal)
			.then((result) => setIngredients(result))
			.catch((cause: unknown) => {
				if (!controller.signal.aborted) {
					setError(cause instanceof Error ? cause.message : 'Unable to load ingredients.');
				}
			})
			.finally(() => {
				if (!controller.signal.aborted) setIsLoading(false);
			});

		return () => controller.abort();
	}, []);

	const create = async (draft: IngredientDraft) => {
		const created = await createIngredientRequest(draft);
		setIngredients((current) => [created, ...current]);
		setError(null);
		return created;
	};

	const update = async (id: string, draft: IngredientDraft) => {
		const updated = await updateIngredientRequest(id, draft);
		setIngredients((current) => current.map((ingredient) => ingredient.id === id ? updated : ingredient));
		setError(null);
		return updated;
	};

	const remove = async (id: string) => {
		await deleteIngredientRequest(id);
		setIngredients((current) => current.filter((ingredient) => ingredient.id !== id));
		setError(null);
	};

	return { ingredients, isLoading, error, create, update, remove };
}