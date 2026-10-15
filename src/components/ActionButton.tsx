import { Icon, type IconName } from './Icons';

export type ActionButtonAction = 'view' | 'edit' | 'delete';

interface ActionButtonProps {
  action: ActionButtonAction;
  onClick: () => void;
  label?: string;
  disabled?: boolean;
}

const actionDetails: Record<ActionButtonAction, { icon: IconName; label: string }> = {
  view: { icon: 'eye', label: 'View' },
  edit: { icon: 'edit', label: 'Edit' },
  delete: { icon: 'delete', label: 'Delete' },
};

export function ActionButton({ action, onClick, label, disabled = false }: ActionButtonProps) {
  const details = actionDetails[action];

  return (
    <button
      type="button"
      aria-label={label ?? details.label}
      title={label ?? details.label}
      disabled={disabled}
      onClick={onClick}
      className={`grid size-7 place-items-center rounded-md border border-[#BA867B]/30 bg-[#F5ECE9] text-[#BA867B] transition-colors hover:bg-[#F5ECE9] disabled:cursor-not-allowed disabled:opacity-50 ${action === 'delete' ? 'hover:text-[#a84d39]' : ''}`}
    >
      <Icon name={details.icon} className="size-3.5" />
    </button>
  );
}