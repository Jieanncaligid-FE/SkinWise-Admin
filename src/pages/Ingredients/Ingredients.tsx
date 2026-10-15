import { useMemo, useState } from 'react';
import { ActionButton } from '../../components/ActionButton';
import { AdminLayout } from '../../components/AdminLayout';
import { DataTable, type DataTableColumn } from '../../components/DataTable';
import { Icon } from '../../components/Icons';
import { Pagination } from '../../components/Pagination';
import { SearchBar } from '../../components/SearchBar';
import { SelectFilter } from '../../components/SelectFilter';
import { StatusBadge } from '../../components/StatusBadge';
import { useIngredients } from '../../hooks/useIngredients';
import type { AdminIngredientListItem } from '../../types/ingredient';
import { CATEGORY_OPTIONS } from '../../types/ingredient';
import { IngredientForm } from './IngredientForm';
import { IngredientDetail } from './IngredientDetail';

const pageSize = 8;

type View = { kind: 'list' } | { kind: 'detail'; id: number } | { kind: 'create' } | { kind: 'edit'; id: number };

function formatDate(value: string | null): string {
	if (!value) return '—';
	const date = new Date(value);
	return Number.isNaN(date.getTime()) ? '—' : date.toLocaleDateString();
}

const ingredientColumns: DataTableColumn<AdminIngredientListItem>[] = [
	{
		key: 'ingredient',
		header: 'Name',
		className: 'min-w-[210px] w-[32%]',
		render: (ingredient) => (
			<div className="max-w-[320px]">
				<p className="flex flex-wrap items-center gap-1.5 font-semibold text-[#1E0C08]">
					{ingredient.name}
					{ingredient.isRoutineCatalog && (
						<StatusBadge label="Routine catalog" variant="neutral" />
					)}
				</p>
			</div>
		),
	},
	{
		key: 'category',
		header: 'Category',
		className: 'min-w-[130px] w-[18%]',
		render: (ingredient) => <span className="text-[#1E0C08]/60">{ingredient.category}</span>,
	},
	{
		key: 'pregnancy',
		header: 'Pregnancy',
		className: 'min-w-[100px] w-[14%]',
		render: (ingredient) => <span className="text-[#1E0C08]/60">{ingredient.pregnancyCaution ? 'Yes' : 'No'}</span>,
	},
	{
		key: 'sensitivity',
		header: 'Sensitivity',
		className: 'min-w-[100px] w-[14%]',
		render: (ingredient) => <span className="text-[#1E0C08]/60">{ingredient.sensitivityFlag ? 'Yes' : 'No'}</span>,
	},
	{
		key: 'updated',
		header: 'Updated',
		className: 'min-w-[110px] w-[14%]',
		render: (ingredient) => <span className="text-[#1E0C08]/60">{formatDate(ingredient.updatedAt)}</span>,
	},
];

export default function Ingredients() {
	const { data, isLoading, error, refresh } = useIngredients();
	const [search, setSearch] = useState('');
	const [category, setCategory] = useState('all');
	const [currentPage, setCurrentPage] = useState(1);
	const [view, setView] = useState<View>({ kind: 'list' });

	const ingredients = useMemo(() => data?.ingredients ?? [], [data]);
	const categories = useMemo(
		() => [...new Set(ingredients.map((ingredient) => ingredient.category))].sort(),
		[ingredients],
	);

	const filteredIngredients = useMemo(() => {
		const normalizedSearch = search.trim().toLocaleLowerCase();
		return ingredients.filter((ingredient) => {
			const matchesCategory = category === 'all' || ingredient.category === category;
			const matchesSearch = !normalizedSearch || [ingredient.name, ...ingredient.aliases].some(
				(value) => value.toLocaleLowerCase().includes(normalizedSearch),
			);
			return matchesCategory && matchesSearch;
		});
	}, [category, ingredients, search]);

	const pageCount = Math.max(1, Math.ceil(filteredIngredients.length / pageSize));
	const safePage = Math.min(currentPage, pageCount);
	const visibleIngredients = filteredIngredients.slice((safePage - 1) * pageSize, safePage * pageSize);

	const goToList = () => {
		setView({ kind: 'list' });
		setCurrentPage(1);
	};

	const handleSaved = (id: number) => {
		void refresh();
		setView({ kind: 'detail', id });
	};

	return (
		<AdminLayout
			activeItem="ingredients"
			title="Ingredients"
			subtitle="Manage the educational ingredient database."
			onLogout={() => window.location.assign('/login')}
		>
			{error && view.kind === 'list' && (
				<div role="alert" className="mb-3 flex flex-col gap-2 rounded-md border border-[#BA867B]/30 bg-[#F5ECE9] px-3 py-2 text-xs text-[#1E0C08] sm:flex-row sm:items-center sm:justify-between">
					<span>{error}</span>
					<button
						type="button"
						onClick={() => void refresh()}
						className="inline-flex w-fit items-center gap-1.5 rounded-full bg-[#BA867B] px-3 py-1.5 text-[10px] font-medium text-white transition-colors hover:bg-[#BA867B]/85"
					>
						Try again
					</button>
				</div>
			)}

			{view.kind === 'list' ? (
				<>
					<div className="mb-3 flex flex-col gap-2.5 sm:flex-row sm:items-center">
						<SearchBar
							value={search}
							onChange={(value) => { setSearch(value); setCurrentPage(1); }}
							placeholder="Search by name or alias..."
							ariaLabel="Search ingredients by name or alias"
							className="flex-1"
						/>
						<SelectFilter
							label="Category"
							aria-label="Filter by category"
							value={category}
							onChange={(event) => { setCategory(event.target.value); setCurrentPage(1); }}
							options={[
								{ label: 'All', value: 'all' },
								...CATEGORY_OPTIONS.filter((option) => categories.includes(option.value))
									.map((option) => ({ label: option.label, value: option.value })),
								...categories
									.filter((value) => !CATEGORY_OPTIONS.some((option) => option.value === value))
									.map((value) => ({ label: value, value })),
							]}
							className="w-full sm:w-[145px]"
						/>
						<button
							type="button"
							onClick={() => setView({ kind: 'create' })}
							className="inline-flex h-10 items-center justify-center gap-1.5 rounded-md bg-[#BA867B] px-4 text-[11px] font-medium text-[#fffdfa] transition-colors hover:bg-[#BA867B]/85 sm:ml-auto"
						>
							<Icon name="plus" className="size-3.5" />
							Add New Ingredient
						</button>
					</div>

					{data?.truncated && (
						<p role="note" className="mb-3 rounded-md border border-[#BA867B]/30 bg-[#F5ECE9] px-3 py-2 text-xs text-[#1E0C08]">
							Showing the first {data.ingredients.length} of {data.total} ingredients.
						</p>
					)}

					<DataTable
						columns={ingredientColumns}
						rows={visibleIngredients}
						getRowKey={(ingredient) => ingredient.id}
						emptyMessage={isLoading
							? 'Loading ingredients...'
							: error
								? 'Unable to load ingredients.'
								: ingredients.length === 0
									? 'No ingredients yet.'
									: 'No ingredients match your search.'}
						renderActions={(ingredient) => (
							<>
								<ActionButton action="view" label={`View ${ingredient.name}`} onClick={() => setView({ kind: 'detail', id: ingredient.id })} />
								<ActionButton action="edit" label={`Edit ${ingredient.name}`} onClick={() => setView({ kind: 'edit', id: ingredient.id })} />
							</>
						)}
					/>

					<div className="mt-3">
						<Pagination currentPage={safePage} pageCount={pageCount} onPageChange={setCurrentPage} />
					</div>
				</>
			) : view.kind === 'detail' ? (
				<>
					<button
						type="button"
						onClick={goToList}
						className="mb-4 inline-flex items-center gap-1.5 text-[11px] text-[#BA867B] hover:text-[#1E0C08]"
					>
						<Icon name="arrow-left" className="size-3.5" />
						Back to ingredients
					</button>
					<IngredientDetail id={view.id} onBack={goToList} onEdit={() => setView({ kind: 'edit', id: view.id })} />
				</>
			) : view.kind === 'create' ? (
				<>
					<button
						type="button"
						onClick={goToList}
						className="mb-4 inline-flex items-center gap-1.5 text-[11px] text-[#BA867B] hover:text-[#1E0C08]"
					>
						<Icon name="arrow-left" className="size-3.5" />
						Back to ingredients
					</button>
					<IngredientForm ingredientId={null} onCancel={goToList} onSaved={handleSaved} />
				</>
			) : (
				<>
					<button
						type="button"
						onClick={() => setView({ kind: 'detail', id: view.id })}
						className="mb-4 inline-flex items-center gap-1.5 text-[11px] text-[#BA867B] hover:text-[#1E0C08]"
					>
						<Icon name="arrow-left" className="size-3.5" />
						Back to ingredient
					</button>
					<IngredientForm ingredientId={view.id} onCancel={() => setView({ kind: 'detail', id: view.id })} onSaved={handleSaved} />
				</>
			)}
		</AdminLayout>
	);
}
