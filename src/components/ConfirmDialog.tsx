import type { ReactNode } from 'react';

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
	if (!open) return null;

	return (
		<div
			className="fixed inset-0 z-50 grid place-items-center bg-[#37281f]/35 p-4"
			onMouseDown={(event) => {
				if (event.target === event.currentTarget) onCancel();
			}}
		>
			<section
				role="alertdialog"
				aria-modal="true"
				aria-labelledby="confirm-dialog-title"
				aria-describedby="confirm-dialog-description"
				className="w-full max-w-[420px] rounded-lg border border-[#efdfd4] bg-[#fffdfa] p-5 shadow-xl sm:p-6"
			>
				<h2 id="confirm-dialog-title" className="font-serif text-xl text-[#514238]">
					{title}
				</h2>
				<div id="confirm-dialog-description" className="mt-2 text-sm leading-6 text-[#806e61]">
					{description}
				</div>
				<div className="mt-6 flex justify-end gap-2">
					<button
						type="button"
						onClick={onCancel}
						className="rounded-md border border-[#eadbd0] bg-white px-4 py-2 text-sm text-[#725d4f] transition-colors hover:bg-[#f8f1eb]"
					>
						{cancelLabel}
					</button>
					<button
						type="button"
						onClick={onConfirm}
						className="rounded-md bg-[#b86f51] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#a96044]"
					>
						{confirmLabel}
					</button>
				</div>
			</section>
		</div>
	);
}