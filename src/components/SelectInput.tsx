import type { SelectHTMLAttributes } from 'react';
import { Icon } from './Icons';
import { fieldControlClassName } from './formStyles';

interface SelectInputProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'children'> {
  options: readonly { label: string; value: string }[];
  placeholder?: string;
}

export function SelectInput({ options, placeholder, className = '', ...props }: SelectInputProps) {
  return (
    <span className="relative block">
      <select {...props} className={`${fieldControlClassName} appearance-none pr-9 ${className}`}>
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((option) => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
      <Icon name="chevron-down" className="pointer-events-none absolute right-3 top-1/2 size-3.5 -translate-y-1/2 text-[#806e61]" />
    </span>
  );
}