import type { ReactNode } from 'react';
import { Icon, type IconName } from './Icons';

interface StatCardProps {
  icon: IconName | ReactNode;
  label: string;
  value: string | number;
  actionLabel?: string;
  onAction?: () => void;
  decorative?: boolean;
}

export function StatCard({
  icon,
  label,
  value,
  actionLabel,
  onAction,
  decorative = false,
}: StatCardProps) {
  const iconContent = typeof icon === 'string'
    ? <Icon name={icon as IconName} className="size-4" />
    : icon;

  return (
    <article className="relative isolate flex min-h-[88px] flex-col overflow-hidden rounded-lg border border-[#BA867B]/30 bg-[#F5ECE9] p-3.5 shadow-[0_3px_12px_rgba(30,12,8,0.04)] sm:min-h-[96px] sm:p-4">
      {decorative && (
        <span aria-hidden="true" className="absolute -bottom-8 -right-4 -z-10 size-24 rounded-[50%] bg-[#F5ECE9]" />
      )}
      <div className="flex items-center gap-3">
        <span className="grid size-8 shrink-0 place-items-center rounded-full bg-[#BA867B] text-white">
          {iconContent}
        </span>
        <div className="min-w-0">
          <p className="truncate text-[11px] font-medium text-[#1E0C08]">{label}</p>
          <p className="mt-0.5 font-serif text-[23px] font-semibold leading-none text-[#1E0C08]">{value}</p>
        </div>
      </div>
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="mt-4 inline-flex w-fit items-center gap-1.5 rounded-full bg-[#BA867B] px-3 py-1.5 text-[10px] font-medium text-white transition-colors hover:bg-[#BA867B]"
        >
          {actionLabel}
          <Icon name="arrow-right" className="size-3" />
        </button>
      )}
    </article>
  );
}