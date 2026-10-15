import { Icon, type IconName } from './Icons';

export type SidebarItem = 'dashboard' | 'ingredients' | 'users';

interface SidebarProps {
	activeItem: SidebarItem;
	onLogout?: () => void;
}

const navigationItems: { label: string; href: string; id: SidebarItem; icon: IconName }[] = [
	{ id: 'dashboard', label: 'Dashboard', href: '/dashboard', icon: 'dashboard' },
	{ id: 'users', label: 'Users', href: '/users', icon: 'users' },
	{ id: 'ingredients', label: 'Ingredients', href: '/ingredients', icon: 'ingredients' },
];

export function Sidebar({ activeItem, onLogout }: SidebarProps) {
	return (
		<aside className="flex w-full shrink-0 flex-col border-b border-[#BA867B]/30 bg-[#FAF5F4] px-4 py-4 md:min-h-screen md:w-[174px] md:border-b-0 md:border-r md:px-3 md:py-6">
			<a href="/dashboard" className="mb-5 flex items-center gap-2.5 px-1 text-[#1E0C08] md:mb-7 md:px-2">
				<span className="grid size-7 place-items-center rounded-full bg-[#F5ECE9] text-[#BA867B]">
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
									? 'bg-[#F5ECE9] font-medium text-[#1E0C08]'
									: 'text-[#1E0C08]/60 hover:bg-[#F5ECE9] hover:text-[#1E0C08]'
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
					className="mt-4 flex min-h-9 items-center gap-2 rounded-md px-2.5 text-left text-[12px] text-[#1E0C08]/60 transition-colors hover:bg-[#F5ECE9] hover:text-[#1E0C08] md:mt-auto md:pt-8"
				>
					<Icon name="logout" className="size-[15px]" />
					Logout
				</button>
			)}
		</aside>
	);
}