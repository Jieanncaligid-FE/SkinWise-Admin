import { ActionButton } from '../../components/ActionButton';
import { DataTable, type DataTableColumn } from '../../components/DataTable';
import { useIngredientDetail } from '../../hooks/useIngredients';
import type { AdminIngredientInteraction } from '../../types/ingredient';

interface IngredientDetailProps {
	id: number;
	onBack: () => void;
	onEdit: () => void;
}

function formatDate(value: string | null): string {
	if (!value) return '—';
	const date = new Date(value);
	return Number.isNaN(date.getTime()) ? '—' : date.toLocaleDateString();
}

const interactionColumns: DataTableColumn<AdminIngredientInteraction>[] = [
	{
		key: 'other',
		header: 'Other Ingredient',
		className: 'min-w-[160px] w-[30%]',
		render: (row) => <span className="font-medium text-[#1E0C08]">{row.otherIngredientName}</span>,
	},
	{
		key: 'type',
		header: 'Interaction',
		className: 'min-w-[130px] w-[25%]',
		render: (row) => <span className="text-[#1E0C08]/60">{row.interactionType}</span>,
	},
	{
		key: 'note',
		header: 'Note',
		className: 'min-w-[200px] w-[45%]',
		render: (row) => <span className="text-[#1E0C08]/60">{row.note || '—'}</span>,
	},
];

function DetailRow({ label, children }: { label: string; children: React.ReactNode }) {
	return (
		<div className="grid gap-1 sm:grid-cols-[170px_minmax(0,1fr)] sm:gap-6">
			<h4 className="font-semibold text-[#1E0C08]">{label}</h4>
			<div className="text-[#1E0C08]/60">{children}</div>
		</div>
	);
}

export function IngredientDetail({ id, onBack, onEdit }: IngredientDetailProps) {
	const { detail, isLoading, error, notFound, retry } = useIngredientDetail(id);

	if (isLoading) {
		return <p role="status" className="py-12 text-center text-sm text-[#1E0C08]/60">Loading ingredient...</p>;
	}

	if (notFound) {
		return (
			<div className="rounded-md border border-[#BA867B]/30 bg-white px-4 py-8 text-center">
				<p className="text-sm text-[#1E0C08]">Ingredient not found.</p>
				<button
					type="button"
					onClick={onBack}
					className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-[#BA867B] px-3 py-1.5 text-[10px] font-medium text-white transition-colors hover:bg-[#BA867B]/85"
				>
					Back to ingredients
				</button>
			</div>
		);
	}

	if (error) {
		return (
			<div role="alert" className="flex flex-col gap-2 rounded-md border border-[#BA867B]/30 bg-[#F5ECE9] px-3 py-2 text-xs text-[#1E0C08] sm:flex-row sm:items-center sm:justify-between">
				<span>{error}</span>
				<div className="flex gap-2">
					<button type="button" onClick={onBack} className="rounded-full border border-[#BA867B]/30 bg-white px-3 py-1.5 text-[10px] font-medium text-[#1E0C08]">Back</button>
					<button type="button" onClick={retry} className="rounded-full bg-[#BA867B] px-3 py-1.5 text-[10px] font-medium text-white">Try again</button>
				</div>
			</div>
		);
	}

	if (!detail) return null;

	return (
		<article className="mx-auto max-w-[720px] space-y-4">
			<div className="flex items-center justify-between gap-2">
				<h2 className="font-serif text-lg text-[#1E0C08]">{detail.name}</h2>
				<ActionButton action="edit" label={`Edit ${detail.name}`} onClick={onEdit} />
			</div>

			{detail.isRoutineCatalog && (
				<p role="note" className="rounded-md border border-[#BA867B]/30 bg-[#F5ECE9] px-3 py-2 text-xs text-[#1E0C08]">
					Used by the routine generator. The name cannot be changed and this ingredient cannot be deleted.
				</p>
			)}

			<section aria-label="Details" className="rounded-xl border border-[#BA867B]/30 bg-[#F5ECE9] p-5 sm:p-6">
				<div className="space-y-2.5 text-[12px]">
					<DetailRow label="INCI Name">{detail.inciName || '—'}</DetailRow>
					<DetailRow label="Category">{detail.category}</DetailRow>
					<DetailRow label="Description">{detail.description || '—'}</DetailRow>
					<DetailRow label="Common Uses">{detail.commonUses || '—'}</DetailRow>
					<DetailRow label="General Benefits">{detail.generalBenefits || '—'}</DetailRow>
					<DetailRow label="Benefits">{detail.benefits || '—'}</DetailRow>
					<DetailRow label="Cautions">{detail.cautionNotes || '—'}</DetailRow>
					<DetailRow label="Aliases">{detail.aliases.length > 0 ? detail.aliases.join(', ') : '—'}</DetailRow>
					<DetailRow label="Sensitivity Flag">{detail.sensitivityFlag ? 'Yes' : 'No'}</DetailRow>
					<DetailRow label="Pregnancy Caution">{detail.pregnancyCaution ? 'Yes' : 'No'}</DetailRow>
					<DetailRow label="Updated">{formatDate(detail.updatedAt)}</DetailRow>
				</div>
			</section>

			<section aria-label="Interactions">
				<h3 className="mb-1 font-serif text-base text-[#1E0C08]">Interactions</h3>
				<p className="mb-3 text-[11px] text-[#1E0C08]/60">Read-only compatibility notes with other ingredients.</p>
				<DataTable
					columns={interactionColumns}
					rows={detail.interactions}
					getRowKey={(row) => `${row.otherIngredientId}-${row.interactionType}`}
					emptyMessage="No recorded interactions."
				/>
			</section>
		</article>
	);
}
