import { useState, type KeyboardEvent, type InputHTMLAttributes } from 'react';
import { Icon } from './Icons';
import { fieldControlClassName } from './formStyles';

interface TagInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> {
  value: readonly string[];
  onChange: (tags: string[]) => void;
}

export function TagInput({ value, onChange, className = '', onKeyDown, disabled, ...inputProps }: TagInputProps) {
  const [draft, setDraft] = useState('');

  const addDraft = () => {
    const tag = draft.trim();
    if (tag && !value.some((existingTag) => existingTag.toLowerCase() === tag.toLowerCase())) {
      onChange([...value, tag]);
    }
    setDraft('');
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    onKeyDown?.(event);
    if (event.defaultPrevented) return;
    if (event.key === 'Enter' || event.key === ',') {
      event.preventDefault();
      addDraft();
    } else if (event.key === 'Backspace' && !draft && value.length > 0) {
      onChange(value.slice(0, -1));
    }
  };

  return (
    <div className={`${fieldControlClassName} flex min-h-10 flex-wrap items-center gap-1.5 px-2.5 ${disabled ? 'opacity-70' : ''} ${className}`}>
      {value.map((tag, index) => (
        <span key={`${tag}-${index}`} className="inline-flex items-center gap-1 rounded-full bg-[#f3e3d8] px-2 py-1 text-[10px] text-[#725442]">
          {tag}
          <button
            type="button"
            aria-label={`Remove ${tag}`}
            disabled={disabled}
            onClick={() => onChange(value.filter((_, tagIndex) => tagIndex !== index))}
            className="text-[#9b684f] hover:text-[#653d2f] disabled:cursor-not-allowed"
          >
            <Icon name="close" className="size-3" />
          </button>
        </span>
      ))}
      <input
        {...inputProps}
        disabled={disabled}
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={addDraft}
        className="min-w-24 flex-1 bg-transparent py-1 text-sm text-[#514238] outline-none placeholder:text-[#a38b7c]"
      />
    </div>
  );
}