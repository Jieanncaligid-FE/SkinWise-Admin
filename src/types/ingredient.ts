export type IngredientCategory =
	| 'ACTIVE'
	| 'HUMECTANT'
	| 'EMOLLIENT'
	| 'PRESERVATIVE'
	| 'FRAGRANCE'
	| 'SUNSCREEN_FILTER'
	| 'EXFOLIANT'
	| 'ANTIOXIDANT';

export interface AdminIngredientListItem {
	id: number;
	name: string;
	inciName: string | null;
	aliases: string[];
	category: string;
	sensitivityFlag: boolean;
	pregnancyCaution: boolean;
	isRoutineCatalog: boolean;
	updatedAt: string;
}

export interface AdminIngredientListResponse {
	ingredients: AdminIngredientListItem[];
	total: number;
	truncated: boolean;
}

export interface AdminIngredientInteraction {
	otherIngredientId: number;
	otherIngredientName: string;
	interactionType: string;
	note: string;
}

export interface AdminIngredientDetail {
	id: number;
	name: string;
	inciName: string | null;
	aliases: string[];
	category: string;
	description: string;
	commonUses: string;
	generalBenefits: string | null;
	cautionNotes: string | null;
	benefits: string | null;
	sensitivityFlag: boolean;
	pregnancyCaution: boolean;
	createdAt: string;
	updatedAt: string;
	isRoutineCatalog: boolean;
	interactions: AdminIngredientInteraction[];
}

export interface AdminIngredientDraft {
	name: string;
	inciName: string;
	aliases: string[];
	category: string;
	description: string;
	commonUses: string;
	generalBenefits: string;
	cautionNotes: string;
	benefits: string;
	sensitivityFlag: boolean;
	pregnancyCaution: boolean;
}

export type FieldErrors = Record<string, string>;

export const CATEGORY_OPTIONS: { label: string; value: string }[] = [
	{ label: 'Active', value: 'ACTIVE' },
	{ label: 'Humectant', value: 'HUMECTANT' },
	{ label: 'Emollient', value: 'EMOLLIENT' },
	{ label: 'Preservative', value: 'PRESERVATIVE' },
	{ label: 'Fragrance', value: 'FRAGRANCE' },
	{ label: 'Sunscreen filter', value: 'SUNSCREEN_FILTER' },
	{ label: 'Exfoliant', value: 'EXFOLIANT' },
	{ label: 'Antioxidant', value: 'ANTIOXIDANT' },
];
