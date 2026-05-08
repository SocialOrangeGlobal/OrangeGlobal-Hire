interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'red' | 'green' | 'blue' | 'gray' | 'navy';
  className?: string;
}

const variants = {
  default: 'bg-gray-100 text-gray-700',
  red: 'bg-red-50 text-[#D71920]',
  green: 'bg-emerald-50 text-emerald-700',
  blue: 'bg-blue-50 text-blue-700',
  gray: 'bg-slate-100 text-slate-600',
  navy: 'bg-[#081B2D] text-white',
};

export default function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}
