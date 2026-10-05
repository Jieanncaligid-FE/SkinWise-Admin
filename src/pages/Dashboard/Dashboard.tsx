import { AdminLayout } from '../../components/AdminLayout';
import { Icon, type IconName } from '../../components/Icons';
import { StatCard } from '../../components/StatCard';
import { useDashboardStats } from '../../hooks/useDashboardStats';

export default function Dashboard() {
	const { totalIngredients, totalUsers } = useDashboardStats();
	const dashboardStats: {
		label: string;
		value: number;
		icon: IconName;
		actionLabel: string;
		href: string;
	}[] = [
		{
			label: 'Total Ingredients',
			value: totalIngredients,
			icon: 'ingredients',
			actionLabel: 'Manage Ingredients',
			href: '/ingredients',
		},
		{
			label: 'Total Users',
			value: totalUsers,
			icon: 'users',
			actionLabel: 'Manage Users',
			href: '/users',
		},
	];

	return (
		<AdminLayout
			activeItem="dashboard"
			title="Welcome, Admin"
			subtitle="Here's a quick overview of your SkinWise platform."
			onLogout={() => window.location.assign('/login')}
		>
			<section aria-label="Platform overview" className="grid gap-4 sm:grid-cols-2">
				{dashboardStats.map((stat) => (
					<StatCard
						key={stat.label}
						icon={stat.icon}
						label={stat.label}
						value={stat.value}
						actionLabel={stat.actionLabel}
						onAction={() => window.location.assign(stat.href)}
					/>
				))}
			</section>

			<section
				aria-label="SkinWise"
				className="relative isolate mt-5 min-h-[142px] overflow-hidden rounded-lg border border-[#f0e1d7] bg-[#fbefe8] px-6 py-6 shadow-[0_4px_14px_rgba(93,62,42,0.06)] sm:px-7"
			>
				<div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
					<span className="absolute -bottom-[72px] left-[-5%] h-[112px] w-[58%] rounded-[50%] bg-[#f2ddd0]" />
					<span className="absolute -bottom-[82px] left-[39%] h-[126px] w-[68%] rounded-[50%] bg-[#e9cbbb]" />
					<span className="absolute -bottom-[92px] right-[-23%] h-[130px] w-[68%] rounded-[50%] border-t-[11px] border-[#f8e8dd] bg-transparent" />

					<span className="absolute bottom-[-7px] right-[16%] h-[98px] w-px origin-bottom rotate-[25deg] bg-[#d6a48c]/65" />
					<span className="absolute bottom-[-6px] right-[20%] h-[76px] w-px origin-bottom rotate-[-38deg] bg-[#d6a48c]/60" />
					<span className="absolute bottom-[-5px] right-[14%] h-[76px] w-px origin-bottom rotate-[53deg] bg-[#d6a48c]/60" />
					<span className="absolute bottom-[70px] right-[18%] size-7 rotate-[18deg] rounded-[100%_0_100%_0] bg-[#d8a58d]/55" />
					<span className="absolute bottom-[48px] right-[11%] size-7 rotate-[52deg] rounded-[100%_0_100%_0] bg-[#d8a58d]/55" />
					<span className="absolute bottom-[38px] right-[22%] size-6 rotate-[-25deg] rounded-[100%_0_100%_0] bg-[#d8a58d]/50" />
					<span className="absolute bottom-[83px] right-[7%] size-7 rotate-[30deg] rounded-[100%_0_100%_0] bg-[#d8a58d]/55" />
				</div>

				<div className="relative z-10 flex min-h-[88px] flex-col justify-center">
					<div className="flex items-center gap-2.5">
						<span className="grid size-7 place-items-center rounded-full bg-[#f2dfd2] text-[#a96545]">
							<Icon name="ingredients" className="size-4" />
						</span>
						<h2 className="font-serif text-[18px] text-[#5b4437]">SkinWise</h2>
					</div>
					<p className="mt-2 pl-[37px] font-serif text-[12px] text-[#907c6d]">
						Better skin starts with knowledge.
					</p>
				</div>
			</section>
		</AdminLayout>
	);
}