import { useState, type FormEvent } from 'react';
import { ApiError } from '../../api/client';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { FormField } from '../../components/FormField';
import { SelectInput } from '../../components/SelectInput';
import { TagInput } from '../../components/TagInput';
import { TextArea } from '../../components/TextArea';
import { TextInput } from '../../components/TextInput';
import { useIngredientDetail } from '../../hooks/useIngredients';
import {
	createIngredient,
	getConflictMessage,
	getFieldErrors,
	updateIngredient,
} from '../../services/ingredients';
import { CATEGORY_OPTIONS, type AdminIngredientDraft, type FieldErrors } from '../../types/ingredient';

interface IngredientFormProps {
	/** Null = create mode. Otherwise the id to load and edit. */
	ingredientId: number | null;
	onCancel: () => void;
	onSaved: (id: number) => void;
}

function blankDraft(): AdminIngredientDraft {
	return {
		name: '',
		inciName: '',
		aliases: [],
		category: 'ACTIVE',
		description: '',
		commonUses: '',
		generalBenefits: '',
		cautionNotes: '',
		benefits: '',
		sensitivityFlag: false,
		pregnancyCaution: false,
	};
}

function toDraft(source: {
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
}): AdminIngredientDraft {
	return {
		name: source.name,
		inciName: source.inciName ?? '',
		aliases: [...source.aliases],
		category: source.category,
		description: source.description,
		commonUses: source.commonUses,
		generalBenefits: source.generalBenefits ?? '',
		cautionNotes: source.cautionNotes ?? '',
		benefits: source.benefits ?? '',
		sensitivityFlag: source.sensitivityFlag,
		pregnancyCaution: source.pregnancyCaution,
	};
}

export function IngredientForm({ ingredientId, onCancel, onSaved }: IngredientFormProps) {
	const isCreate = ingredientId === null;
	const { detail, isLoading, error, retry } = useIngredientDetail(isCreate ? null : ingredientId);
	const [draft, setDraft] = useState<AdminIngredientDraft | null>(null);
	const [isSaving, setIsSaving] = useState(false);
	const [confirmOpen, setConfirmOpen] = useState(false);
	const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
	const [formError, setFormError] = useState<string | null>(null);

	const current: AdminIngredientDraft | null =
		draft ?? (detail ? toDraft(detail) : isCreate ? blankDraft() : null);

	const update = <Key extends keyof AdminIngredientDraft>(key: Key, value: AdminIngredientDraft[Key]) => {
		setDraft((prev) => ({ ...(prev ?? current ?? blankDraft()), [key]: value }));
		setFieldErrors((prev) => {
			if (!(key in prev)) return prev;
			const next = { ...prev };
			delete next[key];
			return next;
		});
	};

	const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setFormError(null);
		if (isCreate && !current?.name.trim()) {
			setFieldErrors({ name: 'Name must be 1–100 characters.' });
			return;
		}
		setConfirmOpen(true);
	};

	const doSave = async () => {
		if (!current) return;
		setConfirmOpen(false);
		setIsSaving(true);
		setFieldErrors({});
		setFormError(null);
		try {
			const saved = isCreate
				? await createIngredient({ ...current, name: current.name.trim() })
				: await updateIngredient(ingredientId as number, {
						inciName: current.inciName,
						aliases: current.aliases,
						category: current.category,
						description: current.description,
						commonUses: current.commonUses,
						generalBenefits: current.generalBenefits,
						cautionNotes: current.cautionNotes,
						benefits: current.benefits,
						sensitivityFlag: current.sensitivityFlag,
						pregnancyCaution: current.pregnancyCaution,
					});
			onSaved(saved.id);
		} catch (cause) {
			const fields = getFieldErrors(cause);
			if (fields) setFieldErrors(fields);
			const conflict = getConflictMessage(cause);
			if (conflict) {
				setFormError(conflict);
				setFieldErrors((prev) => ({ name: conflict, ...prev }));
			} else if (!fields) {
				if (cause instanceof ApiError && cause.status === 429) {
					setFormError('Too many requests. Try again later.');
				} else if (cause instanceof ApiError && cause.status === 401) {
					setFormError('Your session expired. Please log in again.');
				} else {
					setFormError(cause instanceof Error ? cause.message : 'Unable to save ingredient.');
				}
			}
		} finally {
			setIsSaving(false);
		}
	};

	if (!isCreate && isLoading) {
		return <p role="status" className="py-12 text-center text-sm text-[#1E0C08]/60">Loading ingredient...</p>;
	}

	if (!isCreate && error) {
		return (
			<div role="alert" className="flex flex-col gap-2 rounded-md border border-[#BA867B]/30 bg-[#F5ECE9] px-3 py-2 text-xs text-[#1E0C08] sm:flex-row sm:items-center sm:justify-between">
				<span>{error}</span>
				<div className="flex gap-2">
					<button type="button" onClick={onCancel} className="rounded-full border border-[#BA867B]/30 bg-white px-3 py-1.5 text-[10px] font-medium text-[#1E0C08]">Back</button>
					<button type="button" onClick={retry} className="rounded-full bg-[#BA867B] px-3 py-1.5 text-[10px] font-medium text-white">Try again</button>
				</div>
			</div>
		);
	}

	if (!current) return null;
	const routine = !isCreate && detail?.isRoutineCatalog === true;

	return (
		<section className="mx-auto max-w-[720px] rounded-xl border border-[#BA867B]/30 bg-[#F5ECE9] p-5 shadow-[0_4px_14px_rgba(30,12,8,0.08)] sm:p-7">
			<form onSubmit={handleSubmit} className="space-y-3.5" noValidate>
				<h2 className="mb-1 font-serif text-lg text-[#1E0C08]">{isCreate ? 'Add Ingredient' : 'Edit Ingredient'}</h2>

				{routine && (
					<p role="note" className="rounded-md border border-[#BA867B]/30 bg-white/80 px-3 py-2 text-xs text-[#1E0C08]">
						Used by the routine generator. The name cannot be changed and this ingredient cannot be deleted.
					</p>
				)}
				{formError && <p role="alert" className="rounded-md border border-[#BA867B]/30 bg-white/80 px-3 py-2 text-xs text-[#8c5544]">{formError}</p>}

				<FormField id="ingredient-name" label="Ingredient Name" required error={fieldErrors.name}>
					{isCreate ? (
						<TextInput
							id="ingredient-name"
							value={current.name}
							onChange={(event) => update('name', event.target.value)}
							aria-invalid={Boolean(fieldErrors.name)}
							maxLength={100}
						/>
					) : (
						<>
							<TextInput id="ingredient-name" value={current.name} disabled aria-readonly="true" className="opacity-70" />
							<p className="mt-1 text-[11px] text-[#1E0C08]/60">The name cannot be changed after creation.</p>
						</>
					)}
				</FormField>

				<FormField id="ingredient-inci" label="INCI Name" error={fieldErrors.inciName}>
					<TextInput
						id="ingredient-inci"
						value={current.inciName}
						onChange={(event) => update('inciName', event.target.value)}
						aria-invalid={Boolean(fieldErrors.inciName)}
						maxLength={200}
					/>
				</FormField>

				<FormField id="ingredient-category" label="Category" required error={fieldErrors.category}>
					<SelectInput
						id="ingredient-category"
						value={current.category}
						onChange={(event) => update('category', event.target.value)}
						options={CATEGORY_OPTIONS}
						aria-invalid={Boolean(fieldErrors.category)}
					/>
				</FormField>

				<FormField id="ingredient-description" label="Description" error={fieldErrors.description}>
					<TextArea
						id="ingredient-description"
						rows={2}
						value={current.description}
						onChange={(event) => update('description', event.target.value)}
						aria-invalid={Boolean(fieldErrors.description)}
						maxLength={2000}
					/>
				</FormField>

				<FormField id="ingredient-common-uses" label="Common Uses" error={fieldErrors.commonUses}>
					<TextArea
						id="ingredient-common-uses"
						rows={2}
						value={current.commonUses}
						onChange={(event) => update('commonUses', event.target.value)}
						aria-invalid={Boolean(fieldErrors.commonUses)}
						maxLength={1000}
					/>
				</FormField>

				<FormField id="ingredient-general-benefits" label="General Benefits" error={fieldErrors.generalBenefits}>
					<TextArea
						id="ingredient-general-benefits"
						rows={2}
						value={current.generalBenefits}
						onChange={(event) => update('generalBenefits', event.target.value)}
						aria-invalid={Boolean(fieldErrors.generalBenefits)}
						maxLength={1000}
					/>
				</FormField>

				<FormField id="ingredient-benefits" label="Benefits" error={fieldErrors.benefits}>
					<TextArea
						id="ingredient-benefits"
						rows={2}
						value={current.benefits}
						onChange={(event) => update('benefits', event.target.value)}
						aria-invalid={Boolean(fieldErrors.benefits)}
						maxLength={1000}
					/>
				</FormField>

				<FormField id="ingredient-cautions" label="Cautions / Potential Irritation" error={fieldErrors.cautionNotes}>
					<TextArea
						id="ingredient-cautions"
						rows={2}
						value={current.cautionNotes}
						onChange={(event) => update('cautionNotes', event.target.value)}
						aria-invalid={Boolean(fieldErrors.cautionNotes)}
						maxLength={1000}
					/>
				</FormField>

				<FormField id="ingredient-aliases" label="Aliases" hint="Press Enter or use a comma to add each alias." error={fieldErrors.aliases}>
					<TagInput
						id="ingredient-aliases"
						value={current.aliases}
						onChange={(value) => update('aliases', value)}
						placeholder="Add an alias"
						aria-invalid={Boolean(fieldErrors.aliases)}
					/>
				</FormField>

				<div className="grid gap-3 sm:grid-cols-2">
					<label className="flex cursor-pointer items-center gap-2 text-[12px] text-[#1E0C08]">
						<input
							type="checkbox"
							checked={current.sensitivityFlag}
							onChange={(event) => update('sensitivityFlag', event.target.checked)}
							className="size-4 accent-[#BA867B]"
						/>
						Sensitivity flag
					</label>
					<label className="flex cursor-pointer items-center gap-2 text-[12px] text-[#1E0C08]">
						<input
							type="checkbox"
							checked={current.pregnancyCaution}
							onChange={(event) => update('pregnancyCaution', event.target.checked)}
							className="size-4 accent-[#BA867B]"
						/>
						Pregnancy caution
					</label>
				</div>
				{(fieldErrors.sensitivityFlag || fieldErrors.pregnancyCaution) && (
					<p role="alert" className="text-[11px] text-[#a84d39]">
						{fieldErrors.sensitivityFlag ?? fieldErrors.pregnancyCaution}
					</p>
				)}

				<div className="flex justify-end gap-2 pt-1">
					<button type="button" disabled={isSaving} onClick={onCancel} className="rounded-md border border-[#BA867B]/30 bg-white px-4 py-2 text-[11px] text-[#1E0C08] transition-colors hover:bg-[#F5ECE9] disabled:cursor-not-allowed disabled:opacity-50">
						Cancel
					</button>
					<button type="submit" disabled={isSaving} className="rounded-md bg-[#BA867B] px-5 py-2 text-[11px] font-medium text-white transition-colors hover:bg-[#BA867B]/85 disabled:cursor-wait disabled:opacity-60">
						{isSaving ? 'Saving...' : 'Save'}
					</button>
				</div>
			</form>

			<ConfirmDialog
				open={confirmOpen}
				title={isCreate ? 'Add ingredient?' : 'Save changes?'}
				description="These changes appear in the mobile app immediately."
				confirmLabel={isSaving ? 'Saving...' : 'Save'}
				onCancel={() => setConfirmOpen(false)}
				onConfirm={doSave}
			/>
		</section>
	);
}
