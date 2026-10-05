import type { TextareaHTMLAttributes } from 'react';
import { fieldControlClassName } from './formStyles';

export function TextArea({ className = '', rows = 4, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} rows={rows} className={`${fieldControlClassName} min-h-24 resize-y ${className}`} />;
}