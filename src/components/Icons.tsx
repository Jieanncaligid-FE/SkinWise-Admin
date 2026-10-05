import type { SVGProps } from 'react';

export type IconName =
  | 'arrow-left'
  | 'arrow-right'
  | 'check'
  | 'chevron-down'
  | 'chevron-left'
  | 'chevron-right'
  | 'close'
  | 'dashboard'
  | 'delete'
  | 'edit'
  | 'eye'
  | 'ingredients'
  | 'lock'
  | 'mail'
  | 'logout'
  | 'plus'
  | 'search'
  | 'shield'
  | 'user'
  | 'users';

interface IconProps extends SVGProps<SVGSVGElement> {
  name: IconName;
}

export function Icon({ name, ...props }: IconProps) {
  const sharedProps = {
    fill: 'none',
    stroke: 'currentColor',
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    strokeWidth: 1.7,
    ...props,
  };

  switch (name) {
    case 'arrow-left':
      return <svg viewBox="0 0 24 24" {...sharedProps}><path d="m14 18-6-6 6-6" /><path d="M8 12h12" /></svg>;
    case 'arrow-right':
      return <svg viewBox="0 0 24 24" {...sharedProps}><path d="M4 12h16" /><path d="m14 6 6 6-6 6" /></svg>;
    case 'check':
      return <svg viewBox="0 0 24 24" {...sharedProps}><path d="m5 12 4 4L19 6" /></svg>;
    case 'chevron-down':
      return <svg viewBox="0 0 24 24" {...sharedProps}><path d="m7 10 5 5 5-5" /></svg>;
    case 'chevron-left':
      return <svg viewBox="0 0 24 24" {...sharedProps}><path d="m14 18-6-6 6-6" /></svg>;
    case 'chevron-right':
      return <svg viewBox="0 0 24 24" {...sharedProps}><path d="m10 18 6-6-6-6" /></svg>;
    case 'close':
      return <svg viewBox="0 0 24 24" {...sharedProps}><path d="m18 6-12 12M6 6l12 12" /></svg>;
    case 'dashboard':
      return <svg viewBox="0 0 24 24" {...sharedProps}><path d="M3.5 10.5 12 3l8.5 7.5" /><path d="M5.5 9.5v10h13v-10M9.5 19.5v-6h5v6" /></svg>;
    case 'delete':
      return <svg viewBox="0 0 24 24" {...sharedProps}><path d="M4 7h16M10 11v6m4-6v6M6.5 7l1 13h9l1-13M9 7V4h6v3" /></svg>;
    case 'edit':
      return <svg viewBox="0 0 24 24" {...sharedProps}><path d="m14 5 5 5M4 20l4.2-.9L19 8.3a2.1 2.1 0 0 0-3-3L5.2 16.1 4 20Z" /></svg>;
    case 'eye':
      return <svg viewBox="0 0 24 24" {...sharedProps}><path d="M2.5 12s3.3-6 9.5-6 9.5 6 9.5 6-3.3 6-9.5 6-9.5-6-9.5-6Z" /><circle cx="12" cy="12" r="2.5" /></svg>;
    case 'ingredients':
      return <svg viewBox="0 0 24 24" {...sharedProps}><path d="M12 20v-7m0 2c-4 0-6-2.5-6-6 3.5 0 6 2 6 6Zm0-3c0-4 2.4-6.5 6.5-6.5 0 4-2.5 6.5-6.5 6.5Z" /><path d="M5 20h14" /></svg>;
    case 'lock':
      return <svg viewBox="0 0 24 24" {...sharedProps}><rect x="5" y="10" width="14" height="11" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3m-4 4v3" /></svg>;
    case 'mail':
      return <svg viewBox="0 0 24 24" {...sharedProps}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m4 7 8 6 8-6" /></svg>;
    case 'logout':
      return <svg viewBox="0 0 24 24" {...sharedProps}><path d="M10 4H5v16h5M14 8l4 4-4 4m4-4H9" /></svg>;
    case 'plus':
      return <svg viewBox="0 0 24 24" {...sharedProps}><path d="M12 5v14M5 12h14" /></svg>;
    case 'search':
      return <svg viewBox="0 0 24 24" {...sharedProps}><circle cx="10.8" cy="10.8" r="6.3" /><path d="m16 16 4 4" /></svg>;
    case 'shield':
      return <svg viewBox="0 0 24 24" {...sharedProps}><path d="M12 3 19 6v5c0 4.5-2.9 8-7 10-4.1-2-7-5.5-7-10V6l7-3Z" /><path d="m9 12 2 2 4-4" /></svg>;
    case 'user':
      return <svg viewBox="0 0 24 24" {...sharedProps}><circle cx="12" cy="8" r="3.2" /><path d="M5.5 20c.6-3.3 3.1-5.2 6.5-5.2s5.9 1.9 6.5 5.2" /><circle cx="12" cy="12" r="9" /></svg>;
    case 'users':
      return <svg viewBox="0 0 24 24" {...sharedProps}><circle cx="9" cy="8" r="3" /><path d="M3.5 19c.4-3 2.5-4.8 5.5-4.8s5.1 1.8 5.5 4.8M16 5.5a3 3 0 0 1 0 5.8m1.5 3c2 .7 3.1 2.2 3.5 4.7" /></svg>;
  }
}