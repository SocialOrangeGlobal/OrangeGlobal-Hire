import type { BadgeProps } from '../../types';
import { badgeVariants } from '../../data';

export default function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide ${badgeVariants[variant]} ${className}`}>
      {children}
    </span>
  );
}
