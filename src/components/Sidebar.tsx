import { Icon, type IconName } from './Icons';

export type SidebarItem = 'dashboard' | 'ingredients' | 'users';

interface SidebarProps {
	activeItem: SidebarItem;
	onLogout?: () => void;
}

const navigationItems: { label: string; href: string; id: SidebarItem; icon: IconName }[] = [
	{ id: 'dashboard', label: 'Dashboard', href: '/dashboard', icon: 'dashboard' },
	{ id: 'ingredients', label: 'Ingredients', href: '/ingredients', icon: 'ingredients' },
	{ id: 'users', label: 'Users', href: '/users', icon: 'users' },
];

export function Sidebar({ activeItem, onLogout }: SidebarProps) {
	return (
		<aside className="flex w-full shrink-0 flex-col border-b border-[#eee2d8] bg-[#faf5ef] px-4 py-4 md:min-h-screen md:w-[174px] md:border-b-0 md:border-r md:px-3 md:py-6">
			<a href="/dashboard" className="mb-5 flex items-center gap-2.5 px-1 text-[#5b4437] md:mb-7 md:px-2">
				<span className="grid size-7 place-items-center rounded-full bg-[#f2dfd2] text-[#a96545]">
					<Icon name="ingredients" className="size-4" />
				</span>
				<span className="font-serif text-[15px]">SkinWise</span>
			</a>

			<nav aria-label="Main navigation" className="flex gap-1 overflow-x-auto md:flex-col">
				{navigationItems.map((item) => {
					const isActive = activeItem === item.id;
					return (
						<a
							key={item.id}
							href={item.href}
							aria-current={isActive ? 'page' : undefined}
							className={`flex min-h-9 shrink-0 items-center gap-2 rounded-md px-2.5 text-[12px] transition-colors ${
								isActive
									? 'bg-[#f3e3d8] font-medium text-[#594437]'
									: 'text-[#806e61] hover:bg-[#f5eae1] hover:text-[#594437]'
							}`}
						>
							<Icon name={item.icon} className="size-[15px]" />
							{item.label}
						</a>
					);
				})}
			</nav>

			{onLogout && (
				<button
					type="button"
					onClick={onLogout}
					className="mt-4 flex min-h-9 items-center gap-2 rounded-md px-2.5 text-left text-[12px] text-[#806e61] transition-colors hover:bg-[#f5eae1] hover:text-[#594437] md:mt-auto md:pt-8"
				>
					<Icon name="logout" className="size-[15px]" />
					Logout
				</button>
			)}
		</aside>
	);
}