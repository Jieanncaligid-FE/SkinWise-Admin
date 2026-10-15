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
      <label htmlFor={id} className="text-[11px] font-medium text-[#1E0C08]">
        {label}{required && <span aria-hidden="true" className="ml-1 text-[#BA867B]">*</span>}
      </label>
      {children}
      {error
        ? <p role="alert" className="text-[11px] text-[#a84d39]">{error}</p>
        : hint && <p className="text-[11px] text-[#1E0C08]/60">{hint}</p>}
    </div>
  );
}