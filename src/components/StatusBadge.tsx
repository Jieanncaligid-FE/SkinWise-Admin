interface StatusBadgeProps {
  label: string;
  variant: 'positive' | 'negative' | 'neutral';
}

const variantClassName = {
  positive: 'bg-[#e8f1e9] text-[#52745a]',
  negative: 'bg-[#f9e8df] text-[#a85e43]',
  neutral: 'bg-[#F5ECE9] text-[#1E0C08]/60',
};

export function StatusBadge({ label, variant }: StatusBadgeProps) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[9px] font-medium leading-none ${variantClassName[variant]}`}>
      <span aria-hidden="true" className="size-1 rounded-full bg-current" />
      {label}
    </span>
  );
}