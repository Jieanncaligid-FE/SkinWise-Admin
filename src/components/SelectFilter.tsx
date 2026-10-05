import type { SelectHTMLAttributes } from 'react';
import { Icon } from './Icons';

interface SelectFilterProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'children'> {
  label?: string;
  options: readonly { label: string; value: string }[];
}

export function SelectFilter({ label, options, className = '', ...selectProps }: SelectFilterProps) {
  return (
    <label className={`relative flex h-10 min-w-28 flex-col justify-center rounded-md border border-[#eadbd0] bg-white px-2.5 shadow-sm ${className}`}>
      {label && <span className="text-[8px] uppercase tracking-[0.08em] text-[#a38b7c]">{label}</span>}
      <select
        {...selectProps}
        aria-label={selectProps['aria-label'] ?? label}
        className="w-full appearance-none bg-transparent pr-5 text-[11px] text-[#514238] outline-none"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
      <Icon name="chevron-down" className="pointer-events-none absolute right-2.5 size-3 text-[#806e61]" />
    </label>
  );
}