import { AdminLayout } from '../../components/AdminLayout';
import { DataTable, type DataTableColumn } from '../../components/DataTable';
import { Icon, type IconName } from '../../components/Icons';
import { StatCard } from '../../components/StatCard';
import { StatusBadge } from '../../components/StatusBadge';
import { useDashboardStats } from '../../hooks/useDashboardStats';
import type { AdminRecentRegistration } from '../../types/dashboard';

function formatJoinedDate(value: string | null): string {
	if (!value) return '—';
	const date = new Date(value);
	return Number.isNaN(date.getTime()) ? '—' : date.toLocaleDateString();
}

const accessLabel: Record<AdminRecentRegistration['access'], string> = {
	free: 'Free',
	trial: 'Trial',
	premium: 'Premium',
};

const recentColumns: DataTableColumn<AdminRecentRegistration>[] = [
	{
		key: 'user',
		header: 'User',
		className: 'min-w-[180px] w-[28%]',
		render: (row) => <span className="font-medium text-[#1E0C08]">{row.name}</span>,
	},
	{
		key: 'email',
		header: 'Email',
		className: 'min-w-[200px] w-[34%]',
		render: (row) => <span className="text-[#1E0C08]/60">{row.email}</span>,
	},
	{
		key: 'access',
		header: 'Access',
		className: 'min-w-[120px] w-[18%]',
		render: (row) => (
			<StatusBadge
				label={accessLabel[row.access]}
				variant={row.access === 'premium' ? 'positive' : 'neutral'}
			/>
		),
	},
	{
		key: 'joined',
		header: 'Joined',
		className: 'min-w-[120px] w-[20%]',
		render: (row) => <span className="text-[#1E0C08]/60">{formatJoinedDate(row.createdAt)}</span>,
	},
];

export default function Dashboard() {
	const { stats, isLoading, error, retry } = useDashboardStats();

	const value = (count: number | undefined): string | number => {
		if (isLoading) return '...';
		if (error || count === undefined) return '—';
		return count;
	};

	const cards: {
		label: string;
		value: string | number;
		icon: IconName;
		actionLabel?: string;
		href?: string;
	}[] = [
		{
			label: 'Total Users',
			value: value(stats?.users.total),
			icon: 'users',
			actionLabel: 'Manage Users',
			href: '/users',
		},
		{ label: 'Free', value: value(stats?.users.free), icon: 'user' },
		{ label: 'Trial', value: value(stats?.users.trial), icon: 'eye' },
		{ label: 'Premium', value: value(stats?.users.premium), icon: 'shield' },
		{
			label: 'Total Ingredients',
			value: value(stats?.ingredients.total),
			icon: 'ingredients',
			actionLabel: 'Manage Ingredients',
			href: '/ingredients',
		},
	];

	return (
		<AdminLayout
			activeItem="dashboard"
			title="Welcome, Admin"
			subtitle="Here's a quick overview of your SkinWise platform."
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

			<section aria-label="Platform overview" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
				{cards.map((stat) => (
					<StatCard
						key={stat.label}
						icon={stat.icon}
						label={stat.label}
						value={stat.value}
						actionLabel={stat.actionLabel}
						onAction={stat.href ? () => window.location.assign(stat.href as string) : undefined}
					/>
				))}
			</section>

			<section aria-label="Recent registrations" className="mt-5">
				<h2 className="font-serif text-[18px] text-[#1E0C08]">Recent registrations</h2>
				<p className="mt-1 text-[12px] text-[#1E0C08]/60">The latest users to join SkinWise.</p>
				<div className="mt-3">
					<DataTable
						columns={recentColumns}
						rows={stats?.recentRegistrations ?? []}
						getRowKey={(row) => row.id}
						emptyMessage={
							isLoading
								? 'Loading recent registrations...'
								: error
									? 'Unable to load recent registrations.'
									: 'No registrations yet.'
						}
					/>
				</div>
			</section>

			<section
				aria-label="SkinWise"
				className="relative isolate mt-5 min-h-[142px] overflow-hidden rounded-lg border border-[#BA867B]/30 bg-[#F5ECE9] px-6 py-6 shadow-[0_4px_14px_rgba(30,12,8,0.06)] sm:px-7"
			>
				<div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
					<span className="absolute -bottom-[72px] left-[-5%] h-[112px] w-[58%] rounded-[50%] bg-[#F5ECE9]" />
					<span className="absolute -bottom-[82px] left-[39%] h-[126px] w-[68%] rounded-[50%] bg-[#F5ECE9]" />
					<span className="absolute -bottom-[92px] right-[-23%] h-[130px] w-[68%] rounded-[50%] border-t-[11px] border-[#F5ECE9] bg-transparent" />

					<span className="absolute bottom-[-7px] right-[16%] h-[98px] w-px origin-bottom rotate-[25deg] bg-[#BA867B]/65" />
					<span className="absolute bottom-[-6px] right-[20%] h-[76px] w-px origin-bottom rotate-[-38deg] bg-[#BA867B]/60" />
					<span className="absolute bottom-[-5px] right-[14%] h-[76px] w-px origin-bottom rotate-[53deg] bg-[#BA867B]/60" />
					<span className="absolute bottom-[70px] right-[18%] size-7 rotate-[18deg] rounded-[100%_0_100%_0] bg-[#BA867B]/55" />
					<span className="absolute bottom-[48px] right-[11%] size-7 rotate-[52deg] rounded-[100%_0_100%_0] bg-[#BA867B]/55" />
					<span className="absolute bottom-[38px] right-[22%] size-6 rotate-[-25deg] rounded-[100%_0_100%_0] bg-[#BA867B]/50" />
					<span className="absolute bottom-[83px] right-[7%] size-7 rotate-[30deg] rounded-[100%_0_100%_0] bg-[#BA867B]/55" />
				</div>

				<div className="relative z-10 flex min-h-[88px] flex-col justify-center">
					<div className="flex items-center gap-2.5">
						<span className="grid size-7 place-items-center rounded-full bg-[#F5ECE9] text-[#BA867B]">
							<Icon name="ingredients" className="size-4" />
						</span>
						<h2 className="font-serif text-[18px] text-[#1E0C08]">SkinWise</h2>
					</div>
					<p className="mt-2 pl-[37px] font-serif text-[12px] text-[#1E0C08]/60">
						Better skin starts with knowledge.
					</p>
				</div>
			</section>
		</AdminLayout>
	);
}
