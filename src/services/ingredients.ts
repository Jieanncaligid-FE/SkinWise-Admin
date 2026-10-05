import { apiDelete, apiGet, apiPost, apiPut } from '../api/client';
import type { Ingredient, IngredientDraft } from '../types/ingredient';
import type { ResourceCountResponse } from '../types/dashboard';

export async function getIngredients(signal?: AbortSignal): Promise<Ingredient[]> {
	const ingredients = await apiGet<Ingredient[]>('/ingredients', signal);
	if (!Array.isArray(ingredients)) {
		throw new Error('The ingredients response is invalid.');
	}

	return ingredients;
}

export function createIngredient(ingredient: IngredientDraft): Promise<Ingredient> {
	return apiPost<Ingredient>('/ingredients', ingredient);
}

export function updateIngredient(id: string, ingredient: IngredientDraft): Promise<Ingredient> {
	return apiPut<Ingredient>(`/ingredients/${encodeURIComponent(id)}`, ingredient);
}

export function deleteIngredient(id: string): Promise<void> {
	return apiDelete(`/ingredients/${encodeURIComponent(id)}`);
}

export async function getIngredientCount(signal?: AbortSignal): Promise<number> {
	const response = await apiGet<ResourceCountResponse>('/ingredients/count', signal);
	if (!Number.isSafeInteger(response.count) || response.count < 0) {
		throw new Error('The ingredient count response is invalid.');
	}

	return response.count;
}