import type { ReactNode } from 'react';

interface FormFieldProps {
  id: string;
  label: string;
  children: ReactNode;
  hint?: string;
  error?: string;
  required?: boolean;
}

export function FormField({ id, label, children, hint, error, required = false }: FormFieldProps) {
  return (
    <div className="grid gap-1.5">
      <label htmlFor={id} className="text-[11px] font-medium text-[#59483d]">
        {label}{required && <span aria-hidden="true" className="ml-1 text-[#b86f51]">*</span>}
      </label>
      {children}
      {error
        ? <p role="alert" className="text-[11px] text-[#a84d39]">{error}</p>
        : hint && <p className="text-[11px] text-[#927f70]">{hint}</p>}
    </div>
  );
}