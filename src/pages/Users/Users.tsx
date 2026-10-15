import { useState } from 'react';
import { ActionButton } from '../../components/ActionButton';
import { AdminLayout } from '../../components/AdminLayout';
import { DataTable, type DataTableColumn } from '../../components/DataTable';
import { Pagination } from '../../components/Pagination';
import { SearchBar } from '../../components/SearchBar';
import { SelectFilter } from '../../components/SelectFilter';
import { StatusBadge } from '../../components/StatusBadge';
import { useUsers } from '../../hooks/useUsers';
import type { AdminUserListItem, AdminUserListSort, AdminUserListAccessFilter } from '../../types/user';

const pageSize = 10;

function getInitials(name: string) {
	return name
		.split(/\s+/)
		.filter(Boolean)
		.slice(0, 2)
		.map((part) => part[0]?.toLocaleUpperCase() ?? '')
		.join('');
}

function formatDate(value: string | null): string {
	if (!value) return '—';
	const date = new Date(value);
	return Number.isNaN(date.getTime()) ? '—' : date.toLocaleDateString();
}

const accessLabel: Record<AdminUserListItem['access'], string> = {
	free: 'Free',
	trial: 'Trial',
	premium: 'Premium',
};

const columns: DataTableColumn<AdminUserListItem>[] = [
	{
		key: 'user',
		header: 'Name',
		className: 'min-w-[180px] w-[24%]',
		render: (user) => (
			<div className="flex min-w-0 items-center gap-2.5">
				<span aria-hidden="true" className="grid size-7 shrink-0 place-items-center rounded-full border border-[#BA867B]/30 bg-[#F5ECE9] text-[9px] font-medium text-[#BA867B]">
					{getInitials(user.name)}
				</span>
				<span className="truncate font-medium text-[#1E0C08]">{user.name}</span>
			</div>
		),
	},
	{ key: 'email', header: 'Email', className: 'min-w-[200px] w-[26%]', render: (user) => <span className="text-[#1E0C08]/60">{user.email}</span> },
	{
		key: 'access',
		header: 'Access',
		className: 'min-w-[110px] w-[14%]',
		render: (user) => (
			<StatusBadge
				label={accessLabel[user.access]}
				variant={user.access === 'premium' ? 'positive' : 'neutral'}
			/>
		),
	},
	{
		key: 'trialEnds',
		header: 'Trial ends',
		className: 'min-w-[110px] w-[14%]',
		render: (user) => (
			<span className="text-[#1E0C08]/60">
				{user.access === 'trial' ? formatDate(user.trialEndsAt) : '—'}
			</span>
		),
	},
	{
		key: 'joined',
		header: 'Joined',
		className: 'min-w-[110px] w-[14%]',
		render: (user) => <span className="text-[#1E0C08]/60">{formatDate(user.createdAt)}</span>,
	},
];

export default function Users() {
	const [search, setSearch] = useState('');
	const [access, setAccess] = useState<AdminUserListAccessFilter>('all');
	const [sort, setSort] = useState<AdminUserListSort>('newest');
	const [currentPage, setCurrentPage] = useState(1);

	const { data, isLoading, error, retry } = useUsers({ search, access, sort, page: currentPage, pageSize });

	const total = data?.total ?? 0;
	const totalPages = Math.max(1, data?.totalPages ?? 1);
	const visibleUsers = data?.users ?? [];
	const hasFilter = search.trim() !== '' || access !== 'all';
	const from = total === 0 ? 0 : (currentPage - 1) * pageSize + 1;
	const to = Math.min(currentPage * pageSize, total);

	return (
		<AdminLayout
			activeItem="users"
			title="Users"
			subtitle="Manage and view SkinWise users."
			onLogout={() => window.location.assign('/login')}
		>
			{error && (
				<div role="alert" className="mb-3 flex flex-col gap-2 rounded-md border border-[#BA867B]/30 bg-[#F5ECE9] px-3 py-2 text-xs text-[#1E0C08] sm:flex-row sm:items-center sm:justify-between">
					<span>{error}</span>
					<button
						type="button"
						onClick={retry}
						className="inline-flex w-fit items-center gap-1.5 rounded-full bg-[#BA867B] px-3 py-1.5 text-[10px] font-medium text-white transition-colors hover:bg-[#BA867B]/85"
					>
						Try again
					</button>
				</div>
			)}

			<div className="mb-3 flex flex-col gap-2 sm:flex-row">
				<SearchBar
					value={search}
					onChange={(value) => { setSearch(value); setCurrentPage(1); }}
					placeholder="Search users..."
					ariaLabel="Search users by name or email"
					className="flex-1"
				/>
				<SelectFilter
					label="Access"
					aria-label="Filter users by access"
					value={access}
					onChange={(event) => { setAccess(event.target.value as AdminUserListAccessFilter); setCurrentPage(1); }}
					options={[
						{ label: 'All', value: 'all' },
						{ label: 'Free', value: 'free' },
						{ label: 'Trial', value: 'trial' },
						{ label: 'Premium', value: 'premium' },
					]}
					className="w-full sm:w-[150px]"
				/>
				<SelectFilter
					label="Sort"
					aria-label="Sort users"
					value={sort}
					onChange={(event) => { setSort(event.target.value as AdminUserListSort); setCurrentPage(1); }}
					options={[
						{ label: 'Newest', value: 'newest' },
						{ label: 'Oldest', value: 'oldest' },
					]}
					className="w-full sm:w-[150px]"
				/>
			</div>

			<p aria-live="polite" className="mb-3 text-[11px] text-[#1E0C08]/60">
				{isLoading && !data ? 'Loading users...' : `Showing ${from} to ${to} of ${total} users`}
			</p>

			<DataTable
				columns={columns}
				rows={visibleUsers}
				getRowKey={(user) => user.id}
				emptyMessage={isLoading ? 'Loading users...' : error ? 'Unable to load users.' : hasFilter ? 'No users match your search.' : 'No users yet.'}
				renderActions={(user) => (
					<ActionButton
						action="view"
						label={`View ${user.name}`}
						onClick={() => window.location.assign(`/users/${encodeURIComponent(user.id)}`)}
					/>
				)}
			/>

			<div className="mt-3">
				<Pagination currentPage={Math.min(currentPage, totalPages)} pageCount={totalPages} onPageChange={setCurrentPage} />
			</div>
		</AdminLayout>
	);
}
