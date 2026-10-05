import { useState } from 'react';
import { ActionButton } from '../../components/ActionButton';
import { FormField } from '../../components/FormField';
import { SelectInput } from '../../components/SelectInput';
import { TextArea } from '../../components/TextArea';
import type { Ingredient, IngredientInteraction } from '../../types/ingredient';

interface IngredientInteractionsProps {
	currentIngredientId?: string;
	ingredients: Ingredient[];
	value: IngredientInteraction[];
	onChange: (interactions: IngredientInteraction[]) => void;
}

const interactionTypes = [
	{ label: 'Compatible', value: 'Compatible' },
	{ label: 'Use with caution', value: 'Use with caution' },
	{ label: 'Avoid combining', value: 'Avoid combining' },
];

export function IngredientInteractions({ currentIngredientId, ingredients, value, onChange }: IngredientInteractionsProps) {
	const [partnerIngredientId, setPartnerIngredientId] = useState('');
	const [interactionType, setInteractionType] = useState('');
	const [note, setNote] = useState('');
	const availablePartners = ingredients.filter((ingredient) => ingredient.id !== currentIngredientId);

	const addInteraction = () => {
		if (!partnerIngredientId || !interactionType) return;
		onChange([...value, {
			id: crypto.randomUUID(),
			partnerIngredientId,
			interactionType,
			note: note.trim(),
		}]);
		setPartnerIngredientId('');
		setInteractionType('');
		setNote('');
	};

	return (
		<section className="rounded-lg border border-[#eadbd0] bg-[#fffaf6] p-4 sm:p-5">
			<h3 className="font-serif text-base text-[#5b4437]">Ingredient Interactions</h3>
			<p className="mt-1 text-[11px] text-[#907c6d]">Record compatibility notes with other ingredients.</p>

			{value.length > 0 && (
				<ul className="mt-4 divide-y divide-[#f0e5dc] rounded-md border border-[#f0e5dc] bg-white">
					{value.map((interaction) => {
						const partner = ingredients.find((ingredient) => ingredient.id === interaction.partnerIngredientId);
						return (
							<li key={interaction.id} className="flex items-start justify-between gap-3 p-3">
								<div className="min-w-0">
									<p className="text-[11px] font-medium text-[#59483d]">
										{partner?.name ?? 'Unknown ingredient'}
										<span className="mx-1.5 text-[#bd7c5b]">·</span>{interaction.interactionType}
									</p>
									{interaction.note && <p className="mt-1 text-[10px] leading-4 text-[#806e61]">{interaction.note}</p>}
								</div>
								<ActionButton
									action="delete"
									label={`Remove interaction with ${partner?.name ?? 'ingredient'}`}
									onClick={() => onChange(value.filter((item) => item.id !== interaction.id))}
								/>
							</li>
						);
					})}
				</ul>
			)}

			<div className="mt-4 grid gap-3 sm:grid-cols-2">
				<FormField id="interaction-partner" label="Partner Ingredient">
					<SelectInput
						id="interaction-partner" value={partnerIngredientId}
						onChange={(event) => setPartnerIngredientId(event.target.value)}
						options={availablePartners.map((ingredient) => ({ label: ingredient.name, value: ingredient.id }))}
						placeholder="Select an ingredient"
					/>
				</FormField>
				<FormField id="interaction-type" label="Interaction Type">
					<SelectInput
						id="interaction-type" value={interactionType}
						onChange={(event) => setInteractionType(event.target.value)}
						options={interactionTypes} placeholder="Select a type"
					/>
				</FormField>
				<div className="sm:col-span-2">
					<FormField id="interaction-note" label="Note">
						<TextArea
							id="interaction-note" rows={2} value={note}
							onChange={(event) => setNote(event.target.value)} placeholder="Add an optional note"
						/>
					</FormField>
				</div>
			</div>
			<button
				type="button" disabled={!partnerIngredientId || !interactionType} onClick={addInteraction}
				className="mt-3 rounded-md border border-[#d9c6b9] bg-white px-3 py-2 text-[10px] font-medium text-[#725d4f] transition-colors hover:bg-[#f8f1eb] disabled:cursor-not-allowed disabled:opacity-50"
			>
				Add Interaction
			</button>
		</section>
	);
}