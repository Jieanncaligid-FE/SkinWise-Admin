import { Icon } from './Icons';

interface PaginationProps {
	currentPage: number;
	pageCount: number;
	onPageChange: (page: number) => void;
	maxVisiblePages?: number;
}

export function Pagination({
	currentPage,
	pageCount,
	onPageChange,
	maxVisiblePages = 5,
}: PaginationProps) {
	const safePageCount = Math.max(1, pageCount);
	const visibleCount = Math.min(safePageCount, maxVisiblePages);
	const firstPage = Math.max(
		1,
		Math.min(currentPage - Math.floor(visibleCount / 2), safePageCount - visibleCount + 1),
	);
	const pages = Array.from({ length: visibleCount }, (_, index) => firstPage + index);

	const buttonClass =
		'grid size-[28px] place-items-center rounded-md border text-[11px] transition-colors disabled:cursor-not-allowed disabled:opacity-40';

	return (
		<nav aria-label="Pagination" className="flex items-center justify-center gap-1.5">
			<button
				type="button"
				aria-label="Previous page"
				disabled={currentPage <= 1}
				onClick={() => onPageChange(Math.max(1, currentPage - 1))}
				className={`${buttonClass} border-[#BA867B]/30 bg-white text-[#1E0C08]/60 hover:bg-[#F5ECE9]`}
			>
				<Icon name="chevron-left" className="size-3.5" />
			</button>
			{pages.map((page) => (
				<button
					key={page}
					type="button"
					aria-label={`Page ${page}`}
					aria-current={page === currentPage ? 'page' : undefined}
					onClick={() => onPageChange(page)}
					className={`${buttonClass} ${
						page === currentPage
							? 'border-[#BA867B] bg-[#BA867B] font-medium text-white'
							: 'border-[#BA867B]/30 bg-white text-[#1E0C08]/60 hover:bg-[#F5ECE9]'
					}`}
				>
					{page}
				</button>
			))}
			<button
				type="button"
				aria-label="Next page"
				disabled={currentPage >= safePageCount}
				onClick={() => onPageChange(Math.min(safePageCount, currentPage + 1))}
				className={`${buttonClass} border-[#BA867B]/30 bg-white text-[#1E0C08]/60 hover:bg-[#F5ECE9]`}
			>
				<Icon name="chevron-right" className="size-3.5" />
			</button>
		</nav>
	);
}