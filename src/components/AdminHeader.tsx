import { useState } from 'react';
import { Icon } from './Icons';

interface AdminHeaderProps {
  title: string;
  subtitle?: string;
  adminName?: string;
  onLogout?: () => void;
}

export function AdminHeader({
  title,
  subtitle,
  adminName = 'Admin',
  onLogout,
}: AdminHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="flex min-h-[58px] items-start justify-between gap-4">
      <div className="min-w-0">
        <h1 className="font-serif text-[25px] font-semibold leading-tight text-[#514238] sm:text-[28px]">
          {title}
        </h1>
        {subtitle && <p className="mt-1 text-[12px] text-[#907c6d]">{subtitle}</p>}
      </div>

      <div className="relative shrink-0 pt-1">
        <button
          type="button"
          aria-haspopup="menu"
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen((isOpen) => !isOpen)}
          className="flex items-center gap-1.5 rounded-md px-1.5 py-1 text-[11px] text-[#806e61] hover:bg-[#f5ece4]"
        >
          <Icon name="user" className="size-3.5 text-[#a96545]" />
          {adminName}
          <Icon name="chevron-down" className="size-3" />
        </button>
        {isMenuOpen && (
          <div role="menu" className="absolute right-0 top-full z-20 mt-1 min-w-36 rounded-md border border-[#eadbd0] bg-white p-1.5 shadow-lg">
            <p className="px-2 py-1.5 text-[11px] text-[#9a8576]">Administrator</p>
            {onLogout && (
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  setIsMenuOpen(false);
                  onLogout();
                }}
                className="w-full rounded px-2 py-1.5 text-left text-xs text-[#725d4f] hover:bg-[#f8f1eb]"
              >
                Log out
              </button>
            )}
          </div>
        )}
      </div>
    </header>
  );
}