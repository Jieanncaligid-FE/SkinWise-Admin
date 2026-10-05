import { useMemo, useState } from 'react';
import { ActionButton } from '../../components/ActionButton';
import { AdminLayout } from '../../components/AdminLayout';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { DataTable, type DataTableColumn } from '../../components/DataTable';
import { Icon } from '../../components/Icons';
import { Pagination } from '../../components/Pagination';
import { SearchBar } from '../../components/SearchBar';
import { SelectFilter } from '../../components/SelectFilter';
import { useIngredients } from '../../hooks/useIngredients';
import type { Ingredient, IngredientDraft } from '../../types/ingredient';
import { IngredientForm } from './IngredientForm';

const pageSize = 5;

const ingredientColumns: DataTableColumn<Ingredient>[] = [
	{
		key: 'ingredient', header: 'Ingredient', className: 'min-w-[210px] w-[38%]',
		render: (ingredient) => (
			<div className="max-w-[320px]">
				<p className="font-semibold text-[#59483d]">{ingredient.name}</p>
				<p className="mt-1 line-clamp-2 text-[10px] leading-[1.45] text-[#806e61]">{ingredient.description}</p>
			</div>
		),
	},
	{ key: 'skinConcerns', header: 'Skin Concerns', className: 'min-w-[150px] w-[23%]', render: (ingredient) => ingredient.skinConcerns.join(', ') },
	{ key: 'suitableSkinTypes', header: 'Suitable For', className: 'min-w-[135px] w-[23%]', render: (ingredient) => ingredient.suitableSkinTypes.join(', ') },
];

export default function Ingredients() {
	const { ingredients, isLoading, error, create, update, remove } = useIngredients();
	const [search, setSearch] = useState('');
	const [category, setCategory] = useState('all');
	const [currentPage, setCurrentPage] = useState(1);
	const [editingIngredient, setEditingIngredient] = useState<Ingredient | null>(null);
	const [isFormOpen, setIsFormOpen] = useState(false);
	const [ingredientToDelete, setIngredientToDelete] = useState<Ingredient | null>(null);
	const [actionError, setActionError] = useState<string | null>(null);

	const categories = useMemo(
		() => [...new Set(ingredients.map((ingredient) => ingredient.category))].sort(),
		[ingredients],
	);
	const filteredIngredients = useMemo(() => {
		const normalizedSearch = search.trim().toLocaleLowerCase();
		return ingredients.filter((ingredient) => {
			const matchesCategory = category === 'all' || ingredient.category === category;
			const matchesSearch = !normalizedSearch || [
				ingredient.name, ingredient.description, ...ingredient.skinConcerns,
				...ingredient.suitableSkinTypes, ...ingredient.aliases,
			].some((value) => value.toLocaleLowerCase().includes(normalizedSearch));
			return matchesCategory && matchesSearch;
		});
	}, [category, ingredients, search]);
	const pageCount = Math.max(1, Math.ceil(filteredIngredients.length / pageSize));
	const safePage = Math.min(currentPage, pageCount);
	const visibleIngredients = filteredIngredients.slice((safePage - 1) * pageSize, safePage * pageSize);

	const saveIngredient = async (draft: IngredientDraft) => {
		if (editingIngredient) {
			await update(editingIngredient.id, draft);
		} else {
			await create(draft);
		}
		setIsFormOpen(false);
		setEditingIngredient(null);
		setCurrentPage(1);
	};

	const deleteIngredient = async () => {
		if (!ingredientToDelete) return;
		setActionError(null);
		try {
			await remove(ingredientToDelete.id);
			setIngredientToDelete(null);
			setCurrentPage(1);
		} catch (cause) {
			setActionError(cause instanceof Error ? cause.message : 'Unable to delete ingredient.');
		}
	};

	return (
		<AdminLayout
			activeItem="ingredients"
			title="Ingredients"
			subtitle="Manage and view skin care ingredients."
			onLogout={() => window.location.assign('/login')}
		>
			{error && (
				<p role="alert" className="mb-3 rounded-md border border-[#efd4c9] bg-[#fbf0e8] px-3 py-2 text-xs text-[#8c5544]">
					{error}
				</p>
			)}
			{actionError && (
				<p role="alert" className="mb-3 rounded-md border border-[#efd4c9] bg-[#fbf0e8] px-3 py-2 text-xs text-[#8c5544]">
					{actionError}
				</p>
			)}
			{isFormOpen ? (
				<IngredientForm
					key={editingIngredient?.id ?? 'new-ingredient'}
					ingredient={editingIngredient}
					ingredients={ingredients}
					onSave={saveIngredient}
					onCancel={() => {
						setIsFormOpen(false);
						setEditingIngredient(null);
					}}
				/>
			) : (
				<>
					<div className="mb-3 flex flex-col gap-2.5 sm:flex-row sm:items-center">
						<SearchBar
							value={search}
							onChange={(value) => { setSearch(value); setCurrentPage(1); }}
							placeholder="Search ingredients..."
							ariaLabel="Search ingredients"
							className="flex-1"
						/>
						<SelectFilter
							label="Category"
							aria-label="Filter by category"
							value={category}
							onChange={(event) => { setCategory(event.target.value); setCurrentPage(1); }}
							options={[
								{ label: 'All', value: 'all' },
								...categories.map((value) => ({ label: value, value })),
							]}
							className="w-full sm:w-[145px]"
						/>
						<button
							type="button"
							onClick={() => { setEditingIngredient(null); setIsFormOpen(true); }}
							className="inline-flex h-10 items-center justify-center gap-1.5 rounded-md bg-[#d99a86] px-4 text-[11px] font-medium text-[#fffdfa] transition-colors hover:bg-[#c7836d] sm:ml-auto"
						>
							<Icon name="plus" className="size-3.5" />
							Add New Ingredient
						</button>
					</div>

					<DataTable
						columns={ingredientColumns}
						rows={visibleIngredients}
						getRowKey={(ingredient) => ingredient.id}
						emptyMessage={isLoading
							? 'Loading ingredients...'
							: error
								? 'Unable to load ingredients.'
								: ingredients.length === 0
									? 'No ingredients yet. (0 total)'
									: 'No ingredients match your search.'}
						renderActions={(ingredient) => (
							<>
								<ActionButton action="edit" onClick={() => { setEditingIngredient(ingredient); setIsFormOpen(true); }} />
								<ActionButton action="delete" onClick={() => setIngredientToDelete(ingredient)} />
							</>
						)}
					/>

					<div className="mt-3">
						<Pagination currentPage={safePage} pageCount={pageCount} onPageChange={setCurrentPage} />
					</div>
				</>
			)}

			<ConfirmDialog
				open={ingredientToDelete !== null}
				title="Delete ingredient?"
				description={ingredientToDelete ? `Are you sure you want to delete ${ingredientToDelete.name}? This action cannot be undone.` : ''}
				confirmLabel="Delete ingredient"
				onCancel={() => setIngredientToDelete(null)}
				onConfirm={deleteIngredient}
			/>
		</AdminLayout>
	);
}