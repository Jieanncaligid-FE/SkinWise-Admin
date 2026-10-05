import type { InputHTMLAttributes } from 'react';
import { fieldControlClassName } from './formStyles';

export function TextInput({ className = '', ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`${fieldControlClassName} ${className}`} />;
}