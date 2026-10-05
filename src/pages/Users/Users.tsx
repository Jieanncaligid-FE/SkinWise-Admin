import { useMemo, useState } from 'react';
import { ActionButton } from '../../components/ActionButton';
import { AdminLayout } from '../../components/AdminLayout';
import { DataTable, type DataTableColumn } from '../../components/DataTable';
import { Pagination } from '../../components/Pagination';
import { SearchBar } from '../../components/SearchBar';
import { SelectFilter } from '../../components/SelectFilter';
import { StatCard } from '../../components/StatCard';
import { StatusBadge } from '../../components/StatusBadge';
import { useUsers } from '../../hooks/useUsers';
import type { User } from '../../types/user';

const pageSize = 8;

function getInitials(name: string) {
	return name
		.split(/\s+/)
		.filter(Boolean)
		.slice(0, 2)
		.map((part) => part[0]?.toLocaleUpperCase() ?? '')
		.join('');
}

export default function Users() {
	const { users, isLoading, error } = useUsers();
	const [search, setSearch] = useState('');
	const [status, setStatus] = useState('all');
	const [currentPage, setCurrentPage] = useState(1);

	const filteredUsers = useMemo(() => {
		const query = search.trim().toLocaleLowerCase();
		return users.filter((user) => {
			const matchesQuery = !query
				|| user.name.toLocaleLowerCase().includes(query)
				|| user.email.toLocaleLowerCase().includes(query);
			const matchesStatus = status === 'all'
				|| (status === 'with-analysis' && user.hasAnalysis)
				|| (status === 'without-analysis' && !user.hasAnalysis);
			return matchesQuery && matchesStatus;
		});
	}, [search, status, users]);

	const pageCount = Math.max(1, Math.ceil(filteredUsers.length / pageSize));
	const safePage = Math.min(currentPage, pageCount);
	const visibleUsers = filteredUsers.slice((safePage - 1) * pageSize, safePage * pageSize);
	const columns: DataTableColumn<User>[] = [
		{
			key: 'user',
			header: 'User',
			className: 'min-w-[180px] w-[28%]',
			render: (user) => (
				<div className="flex min-w-0 items-center gap-2.5">
					<span aria-hidden="true" className="grid size-7 shrink-0 place-items-center rounded-full border border-[#f0dfd4] bg-[#fbf0e8] text-[9px] font-medium text-[#a96545]">
						{getInitials(user.name)}
					</span>
					<span className="truncate font-medium text-[#59483d]">{user.name}</span>
				</div>
			),
		},
		{ key: 'email', header: 'Email', className: 'min-w-[200px] w-[34%]', render: (user) => <span className="text-[#806e61]">{user.email}</span> },
		{
			key: 'status',
			header: 'Status',
			className: 'min-w-[150px] w-[24%]',
			render: (user) => (
				<StatusBadge
					label={user.hasAnalysis ? 'With Analysis' : 'Without Analysis'}
					variant={user.hasAnalysis ? 'positive' : 'negative'}
				/>
			),
		},
	];

	return (
		<AdminLayout
			activeItem="users"
			title="Users"
			subtitle="Manage and view SkinWise users."
			onLogout={() => window.location.assign('/login')}
		>
			<section aria-label="User overview" className="mb-3 grid gap-3 sm:grid-cols-3">
				<StatCard icon="users" label="Total Users" value={isLoading ? '...' : error ? '-' : users.length} decorative />
				<StatCard icon="check" label="With Analysis" value={isLoading ? '...' : error ? '-' : users.filter((user) => user.hasAnalysis).length} decorative />
				<StatCard icon="eye" label="Without Analysis" value={isLoading ? '...' : error ? '-' : users.filter((user) => !user.hasAnalysis).length} decorative />
			</section>

			{error && (
				<p role="alert" className="mb-3 rounded-md border border-[#efd4c9] bg-[#fbf0e8] px-3 py-2 text-xs text-[#8c5544]">
					{error}
				</p>
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
					label="Status"
					aria-label="Filter users by analysis status"
					value={status}
					onChange={(event) => { setStatus(event.target.value); setCurrentPage(1); }}
					options={[
						{ label: 'All', value: 'all' },
						{ label: 'With Analysis', value: 'with-analysis' },
						{ label: 'Without Analysis', value: 'without-analysis' },
					]}
					className="w-full sm:w-[150px]"
				/>
			</div>

			<DataTable
				columns={columns}
				rows={visibleUsers}
				getRowKey={(user) => user.id}
				emptyMessage={isLoading ? 'Loading users...' : error ? 'Unable to load users.' : 'No users found.'}
				renderActions={(user) => (
					<ActionButton
						action="view"
						label={`View ${user.name}`}
						onClick={() => window.location.assign(`/users/${encodeURIComponent(user.id)}`)}
					/>
				)}
			/>

			<div className="mt-3">
				<Pagination currentPage={safePage} pageCount={pageCount} onPageChange={setCurrentPage} />
			</div>
		</AdminLayout>
	);
}