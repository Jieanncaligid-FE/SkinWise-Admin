import { useState, type FormEvent } from 'react';
import { FormField } from '../../components/FormField';
import { SelectInput } from '../../components/SelectInput';
import { TagInput } from '../../components/TagInput';
import { TextArea } from '../../components/TextArea';
import { TextInput } from '../../components/TextInput';
import type { Ingredient, IngredientDraft } from '../../types/ingredient';
import { IngredientInteractions } from './IngredientInteractions';

interface IngredientFormProps {
	ingredient: Ingredient | null;
	ingredients: Ingredient[];
	onSave: (ingredient: IngredientDraft) => Promise<void>;
	onCancel: () => void;
}

const categories = [
	'Active', 'Antioxidant', 'Barrier Support', 'Botanical', 'Exfoliant', 'Humectant', 'Moisturizer', 'Other',
].map((value) => ({ label: value, value }));

const emptyIngredient: IngredientDraft = {
	name: '', category: '', description: '', benefits: [], skinConcerns: [],
	suitableSkinTypes: [], cautions: '', usage: '', aliases: [], interactions: [],
};

export function IngredientForm({ ingredient, ingredients, onSave, onCancel }: IngredientFormProps) {
	const [isSaving, setIsSaving] = useState(false);
	const [submitError, setSubmitError] = useState<string | null>(null);
	const [draft, setDraft] = useState<IngredientDraft>(() => ingredient ? {
		name: ingredient.name,
		category: ingredient.category,
		description: ingredient.description,
		benefits: [...ingredient.benefits],
		skinConcerns: [...ingredient.skinConcerns],
		suitableSkinTypes: [...ingredient.suitableSkinTypes],
		cautions: ingredient.cautions,
		usage: ingredient.usage,
		aliases: [...ingredient.aliases],
		interactions: ingredient.interactions.map((interaction) => ({ ...interaction })),
	} : { ...emptyIngredient });

	const update = <Key extends keyof IngredientDraft>(key: Key, value: IngredientDraft[Key]) => {
		setDraft((current) => ({ ...current, [key]: value }));
	};
	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setIsSaving(true);
		setSubmitError(null);
		try {
			await onSave(draft);
		} catch (cause) {
			setSubmitError(cause instanceof Error ? cause.message : 'Unable to save ingredient.');
		} finally {
			setIsSaving(false);
		}
	};

	return (
		<section className="mx-auto max-w-[720px] rounded-xl border border-[#efdfd4] bg-[#fbefe8] p-5 shadow-[0_4px_14px_rgba(93,62,42,0.08)] sm:p-7">
			<form onSubmit={handleSubmit} className="space-y-3.5">
				<h2 className="mb-1 font-serif text-lg text-[#5b4437]">{ingredient ? 'Edit Ingredient' : 'Add Ingredient'}</h2>
				{submitError && <p role="alert" className="rounded-md border border-[#efd4c9] bg-white/80 px-3 py-2 text-xs text-[#8c5544]">{submitError}</p>}

				<FormField id="ingredient-name" label="Ingredient Name" required>
					<TextInput id="ingredient-name" name="name" required value={draft.name} onChange={(event) => update('name', event.target.value)} />
				</FormField>
				<FormField id="ingredient-category" label="Category" required>
					<SelectInput
						id="ingredient-category" name="category" required value={draft.category}
						onChange={(event) => update('category', event.target.value)} options={categories} placeholder="Select a category"
					/>
				</FormField>
				<FormField id="ingredient-description" label="Description" required>
					<TextArea
						id="ingredient-description" name="description" required rows={2} value={draft.description}
						onChange={(event) => update('description', event.target.value)}
					/>
				</FormField>
				<FormField id="ingredient-benefits" label="Benefits" hint="Enter one benefit per line.">
					<TextArea
						id="ingredient-benefits" name="benefits" rows={3} value={draft.benefits.join('\n')}
						onChange={(event) => update('benefits', event.target.value.split('\n').filter(Boolean))}
					/>
				</FormField>
				<FormField id="ingredient-concerns" label="Skin Concerns" hint="Press Enter or use a comma to add each tag.">
					<TagInput
						id="ingredient-concerns" name="skinConcerns" value={draft.skinConcerns}
						onChange={(value) => update('skinConcerns', value)} placeholder="Add a skin concern"
					/>
				</FormField>
				<FormField id="ingredient-skin-types" label="Suitable Skin Types">
					<TagInput
						id="ingredient-skin-types" name="suitableSkinTypes" value={draft.suitableSkinTypes}
						onChange={(value) => update('suitableSkinTypes', value)} placeholder="Add a skin type"
					/>
				</FormField>
				<FormField id="ingredient-cautions" label="Cautions / Potential Irritation">
					<TextArea
						id="ingredient-cautions" name="cautions" rows={3} value={draft.cautions}
						onChange={(event) => update('cautions', event.target.value)}
					/>
				</FormField>
				<FormField id="ingredient-usage" label="Usage Information">
					<TextArea
						id="ingredient-usage" name="usage" rows={3} value={draft.usage}
						onChange={(event) => update('usage', event.target.value)}
					/>
				</FormField>
				<FormField id="ingredient-aliases" label="Aliases" hint="Press Enter or use a comma to add each alias.">
					<TagInput
						id="ingredient-aliases" name="aliases" value={draft.aliases}
						onChange={(value) => update('aliases', value)} placeholder="Add an alias"
					/>
				</FormField>

				<IngredientInteractions
					currentIngredientId={ingredient?.id}
					ingredients={ingredients}
					value={draft.interactions}
					onChange={(value) => update('interactions', value)}
				/>

				<div className="flex justify-end gap-2 pt-1">
					<button type="button" disabled={isSaving} onClick={onCancel} className="rounded-md border border-[#d9c6b9] bg-white px-4 py-2 text-[11px] text-[#725d4f] transition-colors hover:bg-[#f8f1eb] disabled:cursor-not-allowed disabled:opacity-50">
						Cancel
					</button>
					<button type="submit" disabled={isSaving} className="rounded-md bg-[#d99a86] px-5 py-2 text-[11px] font-medium text-white transition-colors hover:bg-[#c7836d] disabled:cursor-wait disabled:opacity-60">
						{isSaving ? 'Saving...' : 'Save'}
					</button>
				</div>
			</form>
		</section>
	);
}