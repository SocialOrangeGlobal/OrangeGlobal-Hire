import { forwardRef, ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

const base = 'inline-flex items-center justify-center gap-2 font-semibold rounded-full transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';

const variants = {
  primary: 'bg-rh-red hover:bg-red-700 text-white focus-visible:ring-rh-red',
  secondary: 'bg-rh-teal hover:bg-teal-800 text-white focus-visible:ring-rh-teal',
  outline: 'border-2 border-rh-teal text-rh-teal hover:bg-rh-teal hover:text-white focus-visible:ring-rh-teal',
  ghost: 'text-rh-teal hover:bg-gray-100 focus-visible:ring-rh-teal',
  danger: 'bg-rh-red hover:bg-red-700 text-white',
};

const sizes = {
  sm: 'h-9 px-4 text-sm',
  md: 'h-11 px-6 text-sm',
  lg: 'h-13 px-8 text-base',
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', className = '', children, ...props }, ref) => (
    <button
      ref={ref}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
);

Button.displayName = 'Button';
export default Button;
