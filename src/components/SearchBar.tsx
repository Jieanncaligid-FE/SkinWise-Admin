import { Icon } from './Icons';

interface SearchBarProps {
	value: string;
	onChange: (value: string) => void;
	placeholder?: string;
	ariaLabel?: string;
	className?: string;
}

export function SearchBar({
	value,
	onChange,
	placeholder = 'Search...',
	ariaLabel = 'Search',
	className = '',
}: SearchBarProps) {
	return (
		<label className={`flex h-10 min-w-0 items-center gap-2 rounded-md border border-[#BA867B]/30 bg-white px-3 text-[#1E0C08]/60 shadow-sm focus-within:border-[#BA867B] ${className}`}>
			<Icon name="search" className="size-4 shrink-0" />
			<input
				type="search"
				aria-label={ariaLabel}
				value={value}
				onChange={(event) => onChange(event.target.value)}
				placeholder={placeholder}
				className="min-w-0 flex-1 bg-transparent text-[12px] text-[#1E0C08] outline-none placeholder:text-[#1E0C08]/60"
			/>
		</label>
	);
}