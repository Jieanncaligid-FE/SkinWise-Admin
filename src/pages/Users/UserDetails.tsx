import { AdminLayout } from '../../components/AdminLayout';
import { DataTable, type DataTableColumn } from '../../components/DataTable';
import { Icon } from '../../components/Icons';
import { StatusBadge } from '../../components/StatusBadge';
import { useUserDetail } from '../../hooks/useUsers';
import { isApiConfigured } from '../../api/client';
import type { AdminUserDetailPayment } from '../../types/user';

interface UserDetailsProps {
	userId: string;
}

function formatDate(value: string | null): string {
	if (!value) return '—';
	const date = new Date(value);
	return Number.isNaN(date.getTime()) ? '—' : date.toLocaleDateString();
}

function formatAmount(amountMinor: number, currency: string): string {
	if (!Number.isFinite(amountMinor)) return '—';
	return `${(amountMinor / 100).toFixed(2)} ${currency}`;
}

function paymentStatusVariant(status: string): 'positive' | 'negative' | 'neutral' {
	if (status === 'PAID') return 'positive';
	if (status === 'FAILED') return 'negative';
	return 'neutral';
}

const accessLabel = { free: 'Free', trial: 'Trial', premium: 'Premium' } as const;

const paymentColumns: DataTableColumn<AdminUserDetailPayment>[] = [
	{
		key: 'reference',
		header: 'Reference',
		className: 'min-w-[170px] w-[26%]',
		render: (payment) => <span className="break-all font-medium text-[#1E0C08]">{payment.referenceId}</span>,
	},
	{
		key: 'plan',
		header: 'Plan',
		className: 'min-w-[90px] w-[12%]',
		render: (payment) => <span className="text-[#1E0C08]/60">{payment.planId}</span>,
	},
	{
		key: 'amount',
		header: 'Amount',
		className: 'min-w-[110px] w-[16%]',
		render: (payment) => <span className="text-[#1E0C08]/60">{formatAmount(payment.amount, payment.currency)}</span>,
	},
	{
		key: 'status',
		header: 'Status',
		className: 'min-w-[110px] w-[14%]',
		render: (payment) => <StatusBadge label={payment.status} variant={paymentStatusVariant(payment.status)} />,
	},
	{
		key: 'created',
		header: 'Created',
		className: 'min-w-[100px] w-[16%]',
		render: (payment) => <span className="text-[#1E0C08]/60">{formatDate(payment.createdAt)}</span>,
	},
	{
		key: 'paid',
		header: 'Paid',
		className: 'min-w-[100px] w-[16%]',
		render: (payment) => <span className="text-[#1E0C08]/60">{formatDate(payment.paidAt)}</span>,
	},
];

function DetailRow({ label, children }: { label: string; children: React.ReactNode }) {
	return (
		<div className="grid gap-1 sm:grid-cols-[150px_minmax(0,1fr)] sm:gap-6">
			<h4 className="font-semibold text-[#1E0C08]">{label}</h4>
			<div className="text-[#1E0C08]/60">{children}</div>
		</div>
	);
}

export default function UserDetails({ userId }: UserDetailsProps) {
	const { data, isLoading, error, notFound, retry } = useUserDetail(userId);

	return (
		<AdminLayout activeItem="users" title="User Details" onLogout={() => window.location.assign('/login')}>
			<button
				type="button"
				onClick={() => window.location.assign('/users')}
				aria-label="Back to users"
				className="mb-4 grid size-8 place-items-center rounded-full border border-[#BA867B]/30 bg-white text-[#BA867B] transition-colors hover:bg-[#F5ECE9]"
			>
				<Icon name="arrow-left" className="size-4" />
			</button>

			{isLoading ? (
				<p role="status" className="py-12 text-center text-sm text-[#1E0C08]/60">Loading user details...</p>
			) : notFound ? (
				<div className="rounded-md border border-[#BA867B]/30 bg-white px-4 py-8 text-center">
					<p className="text-sm text-[#1E0C08]">User not found.</p>
					<button
						type="button"
						onClick={() => window.location.assign('/users')}
						className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-[#BA867B] px-3 py-1.5 text-[10px] font-medium text-white transition-colors hover:bg-[#BA867B]/85"
					>
						Back to users
					</button>
				</div>
			) : error ? (
				<div role="alert" className="flex flex-col gap-2 rounded-md border border-[#BA867B]/30 bg-[#F5ECE9] px-3 py-2 text-xs text-[#1E0C08] sm:flex-row sm:items-center sm:justify-between">
					<span>{error}</span>
					<button
						type="button"
						onClick={retry}
						className="inline-flex w-fit items-center gap-1.5 rounded-full bg-[#BA867B] px-3 py-1.5 text-[10px] font-medium text-white transition-colors hover:bg-[#BA867B]/85"
					>
						Try again
					</button>
				</div>
			) : !data ? (
				<p className="rounded-md border border-[#BA867B]/30 bg-white px-4 py-8 text-center text-sm text-[#1E0C08]/60">
					{isApiConfigured ? 'User not found.' : 'User details will be available when the backend API is connected.'}
				</p>
			) : (
				<article className="max-w-[1000px] space-y-4">
					<header className="border-b border-[#BA867B]/30 pb-3">
						<div className="flex flex-wrap items-center gap-2">
							<h2 className="text-sm font-semibold text-[#1E0C08]">{data.user.name}</h2>
							<StatusBadge
								label={accessLabel[data.premium.access]}
								variant={data.premium.access === 'premium' ? 'positive' : 'neutral'}
							/>
						</div>
						<p className="mt-1 text-[12px] text-[#1E0C08]/60">{data.user.email}</p>
					</header>

					<section aria-label="Account" className="rounded-lg border border-[#BA867B]/30 bg-white p-4 sm:p-5">
						<h3 className="mb-3 text-sm font-semibold text-[#1E0C08]">Account</h3>
						<div className="space-y-2 text-[12px]">
							<DetailRow label="User ID">{data.user.id}</DetailRow>
							<DetailRow label="Email verified">{data.user.emailVerified ? 'Yes' : 'No'}</DetailRow>
							<DetailRow label="Created">{formatDate(data.user.createdAt)}</DetailRow>
							<DetailRow label="Last updated">{formatDate(data.user.updatedAt)}</DetailRow>
							<DetailRow label="Assessment completed">{data.user.hasCompletedAssessment ? 'Yes' : 'No'}</DetailRow>
						</div>
					</section>

					<section aria-label="Premium" className="rounded-lg border border-[#BA867B]/30 bg-white p-4 sm:p-5">
						<div className="mb-1 flex flex-wrap items-center justify-between gap-2">
							<h3 className="text-sm font-semibold text-[#1E0C08]">Premium</h3>
							<span className="text-[10px] text-[#1E0C08]/60">View only — changes need approval</span>
						</div>
						<div className="space-y-2 text-[12px]">
							<DetailRow label="Access">{accessLabel[data.premium.access]}</DetailRow>
							<DetailRow label="Plan">{data.premium.plan}</DetailRow>
							<DetailRow label="Trial start (estimated)">{formatDate(data.premium.trialStartedAtEstimated)}</DetailRow>
							<DetailRow label="Trial end">{formatDate(data.premium.trialEndsAt)}</DetailRow>
							<DetailRow label="Trial active">{data.premium.trialActive ? 'Yes' : 'No'}</DetailRow>
						</div>
					</section>

					<section aria-label="Payments">
						<div className="mb-1 flex flex-wrap items-center justify-between gap-2">
							<h3 className="text-sm font-semibold text-[#1E0C08]">Payments</h3>
							<span className="text-[10px] text-[#1E0C08]/60">Xendit sandbox / test mode</span>
						</div>
						<DataTable
							columns={paymentColumns}
							rows={data.payments}
							getRowKey={(payment) => payment.referenceId}
							emptyMessage="No payment records"
						/>
					</section>
				</article>
			)}
		</AdminLayout>
	);
}
