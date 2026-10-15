import { ApiError, apiGet, apiPatch, apiPost } from '../api/client';
import type {
	AdminIngredientDetail,
	AdminIngredientDraft,
	AdminIngredientListResponse,
	FieldErrors,
} from '../types/ingredient';

export function getIngredients(signal?: AbortSignal): Promise<AdminIngredientListResponse> {
	return apiGet<AdminIngredientListResponse>('/api/admin/ingredients', signal);
}

export function getIngredient(id: number, signal?: AbortSignal): Promise<AdminIngredientDetail> {
	return apiGet<AdminIngredientDetail>(`/api/admin/ingredients/${encodeURIComponent(String(id))}`, signal);
}

export function createIngredient(draft: AdminIngredientDraft): Promise<AdminIngredientDetail> {
	return apiPost<AdminIngredientDetail>('/api/admin/ingredients', draft);
}

export function updateIngredient(
	id: number,
	draft: Omit<AdminIngredientDraft, 'name'>,
): Promise<AdminIngredientDetail> {
	return apiPatch<AdminIngredientDetail>(`/api/admin/ingredients/${encodeURIComponent(String(id))}`, draft);
}

/** Extract per-field server errors from a 400 response, if present. */
export function getFieldErrors(cause: unknown): FieldErrors | null {
	if (!(cause instanceof ApiError) || cause.status !== 400) return null;
	if (typeof cause.body !== 'object' || cause.body === null) return null;
	const errors = (cause.body as { errors?: unknown }).errors;
	if (!Array.isArray(errors)) return null;
	const fields: FieldErrors = {};
	for (const entry of errors) {
		if (typeof entry !== 'object' || entry === null) continue;
		const { field, message } = entry as { field?: unknown; message?: unknown };
		if (typeof field === 'string' && typeof message === 'string' && !(field in fields)) {
			fields[field] = message;
		}
	}
	return fields;
}

/** Extract the server message from a 409 duplicate response, if present. */
export function getConflictMessage(cause: unknown): string | null {
	if (!(cause instanceof ApiError) || cause.status !== 409) return null;
	if (typeof cause.body !== 'object' || cause.body === null) return null;
	const message = (cause.body as { message?: unknown }).message;
	return typeof message === 'string' && message ? message : 'Name or alias already in use.';
}
