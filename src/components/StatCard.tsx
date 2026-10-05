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
    <article className="relative isolate flex min-h-[88px] flex-col overflow-hidden rounded-lg border border-[#f0e1d7] bg-[#f9efe8] p-3.5 shadow-[0_3px_12px_rgba(93,62,42,0.04)] sm:min-h-[96px] sm:p-4">
      {decorative && (
        <span aria-hidden="true" className="absolute -bottom-8 -right-4 -z-10 size-24 rounded-[50%] bg-[#f3e3d8]" />
      )}
      <div className="flex items-center gap-3">
        <span className="grid size-8 shrink-0 place-items-center rounded-full bg-[#bd7c5b] text-white">
          {iconContent}
        </span>
        <div className="min-w-0">
          <p className="truncate text-[11px] font-medium text-[#614c3e]">{label}</p>
          <p className="mt-0.5 font-serif text-[23px] font-semibold leading-none text-[#514238]">{value}</p>
        </div>
      </div>
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="mt-4 inline-flex w-fit items-center gap-1.5 rounded-full bg-[#bd7c5b] px-3 py-1.5 text-[10px] font-medium text-white transition-colors hover:bg-[#a96545]"
        >
          {actionLabel}
          <Icon name="arrow-right" className="size-3" />
        </button>
      )}
    </article>
  );
}