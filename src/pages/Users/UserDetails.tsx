import { AdminLayout } from '../../components/AdminLayout';
import { Icon } from '../../components/Icons';
import { useUser } from '../../hooks/useUsers';
import { isApiConfigured } from '../../api/client';

interface UserDetailsProps {
	userId: string;
}

export default function UserDetails({ userId }: UserDetailsProps) {
	const { user, isLoading, error } = useUser(userId);

	return (
		<AdminLayout activeItem="users" title="User Details" onLogout={() => window.location.assign('/login')}>
			<button
				type="button"
				onClick={() => window.location.assign('/users')}
				aria-label="Back to users"
				className="mb-4 grid size-8 place-items-center rounded-full border border-[#efdfd4] bg-white text-[#bd7c5b] transition-colors hover:bg-[#fbf0e8]"
			>
				<Icon name="arrow-left" className="size-4" />
			</button>

			{isLoading ? (
				<p role="status" className="py-12 text-center text-sm text-[#806e61]">Loading user details...</p>
			) : error ? (
				<p role="alert" className="rounded-md border border-[#efd4c9] bg-[#fbf0e8] px-3 py-2 text-xs text-[#8c5544]">{error}</p>
			) : !user ? (
				<p className="rounded-md border border-[#efdfd4] bg-white px-4 py-8 text-center text-sm text-[#806e61]">
					{isApiConfigured ? 'User not found.' : 'User details will be available when the backend API is connected.'}
				</p>
			) : (
				<article className="max-w-[1000px]">
					<header className="border-b border-[#d9cfc7] pb-3">
						<h2 className="text-sm font-semibold text-[#3f332d]">{user.name}</h2>
						<p className="mt-1 text-[12px] text-[#59483d]">{user.email}</p>
						<div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-[#59483d]">
							{user.gender && <span>Gender <span className="ml-1 rounded bg-[#d99a86] px-2 py-0.5 text-white">{user.gender}</span></span>}
							{user.ageRange && <span className="ml-2">Age Range <span className="ml-1 rounded bg-[#d99a86] px-2 py-0.5 text-white">{user.ageRange}</span></span>}
						</div>
						{user.joinedAt && <p className="mt-1 text-[11px] text-[#59483d]">Joined {new Date(user.joinedAt).toLocaleDateString()}</p>}
					</header>

					<section className="py-2">
						<h3 className="mb-2 text-sm font-semibold text-[#3f332d]">Skin Analysis Result</h3>
						{user.analysis ? (
							<div className="space-y-3 text-[11px] text-[#514238]">
								<DetailRow label="Skin Type">
									<span className="inline-block rounded bg-[#d99a86] px-2 py-1">{user.analysis.skinType}</span>
									<p className="mt-2 max-w-[440px]">{user.analysis.skinTypeDescription}</p>
								</DetailRow>
								<DetailRow label="Primary Concerns">
									<div className="flex flex-wrap gap-1.5">
										{user.analysis.primaryConcerns.map((concern) => <span key={concern} className="rounded bg-[#d99a86] px-2 py-1">{concern}</span>)}
									</div>
								</DetailRow>
								<DetailRow label="Analysis Summary"><p className="max-w-[440px]">{user.analysis.summary}</p></DetailRow>
								<DetailRow label="Recommended Focus">
									<ul className="space-y-1">{user.analysis.recommendedFocus.map((focus) => <li key={focus}>{focus}</li>)}</ul>
								</DetailRow>
							</div>
						) : (
							<p className="py-3 text-[11px] text-[#806e61]">This user has not completed a skin analysis.</p>
						)}
					</section>

					{user.analysis && user.analysis.factors.length > 0 && (
						<section className="border-t border-[#d9cfc7] pt-3">
							<h3 className="mb-3 text-sm font-semibold text-[#3f332d]">Factors Affecting Skin Condition</h3>
							<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
								{user.analysis.factors.map((factor) => (
									<article key={factor.name} className="relative min-h-[96px] rounded-md border border-[#eee6df] bg-white p-4 shadow-[0_2px_5px_rgba(60,43,33,0.14)]">
										<span className="absolute right-2 top-2 rounded bg-[#d99a86] px-2 py-0.5 text-[9px] text-white">{factor.level}</span>
										<h4 className="pr-14 text-[11px] font-semibold text-[#59483d]">{factor.name}</h4>
										<p className="mt-2 text-[11px] leading-4 text-[#59483d]">{factor.description}</p>
									</article>
								))}
							</div>
						</section>
					)}
				</article>
			)}
		</AdminLayout>
	);
}

interface DetailRowProps {
	label: string;
	children: React.ReactNode;
}

function DetailRow({ label, children }: DetailRowProps) {
	return (
		<div className="grid gap-1 sm:grid-cols-[150px_minmax(0,1fr)] sm:gap-6">
			<h4 className="font-semibold text-[#3f332d]">{label}</h4>
			<div>{children}</div>
		</div>
	);
}