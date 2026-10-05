export interface IngredientInteraction {
	id: string;
	partnerIngredientId: string;
	interactionType: string;
	note: string;
}

export interface IngredientDraft {
	name: string;
	category: string;
	description: string;
	benefits: string[];
	skinConcerns: string[];
	suitableSkinTypes: string[];
	cautions: string;
	usage: string;
	aliases: string[];
	interactions: IngredientInteraction[];
}

export interface Ingredient extends IngredientDraft {
	id: string;
}