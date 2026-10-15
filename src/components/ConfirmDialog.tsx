import { useEffect, useRef, type ReactNode } from 'react';

interface ConfirmDialogProps {
	open: boolean;
	title: string;
	description: ReactNode;
	onConfirm: () => void;
	onCancel: () => void;
	confirmLabel?: string;
	cancelLabel?: string;
}

export function ConfirmDialog({
	open,
	title,
	description,
	onConfirm,
	onCancel,
	confirmLabel = 'Delete',
	cancelLabel = 'Cancel',
}: ConfirmDialogProps) {
	const cancelRef = useRef<HTMLButtonElement | null>(null);

	useEffect(() => {
		if (!open) return;
		cancelRef.current?.focus();
		const onKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'Escape') onCancel();
		};
		window.addEventListener('keydown', onKeyDown);
		return () => window.removeEventListener('keydown', onKeyDown);
	}, [open, onCancel]);

	if (!open) return null;

	return (
		<div
			className="fixed inset-0 z-50 grid place-items-center bg-[#1E0C08]/35 p-4"
			onMouseDown={(event) => {
				if (event.target === event.currentTarget) onCancel();
			}}
		>
			<section
				role="dialog"
				aria-modal="true"
				aria-labelledby="confirm-dialog-title"
				aria-describedby="confirm-dialog-description"
				className="w-full max-w-[420px] rounded-lg border border-[#BA867B]/30 bg-[#ffffff] p-5 shadow-xl sm:p-6"
			>
				<h2 id="confirm-dialog-title" className="font-serif text-xl text-[#1E0C08]">
					{title}
				</h2>
				<div id="confirm-dialog-description" className="mt-2 text-sm leading-6 text-[#1E0C08]/60">
					{description}
				</div>
				<div className="mt-6 flex justify-end gap-2">
					<button
						ref={cancelRef}
						type="button"
						onClick={onCancel}
						className="rounded-md border border-[#BA867B]/30 bg-white px-4 py-2 text-sm text-[#1E0C08] transition-colors hover:bg-[#F5ECE9]"
					>
						{cancelLabel}
					</button>
					<button
						type="button"
						onClick={onConfirm}
						className="rounded-md bg-[#BA867B] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#BA867B]/85"
					>
						{confirmLabel}
					</button>
				</div>
			</section>
		</div>
	);
}
