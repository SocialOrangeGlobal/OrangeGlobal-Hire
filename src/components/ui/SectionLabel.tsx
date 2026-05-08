interface SectionLabelProps {
  children: React.ReactNode;
  className?: string;
}

export default function SectionLabel({ children, className = '' }: SectionLabelProps) {
  return (
    <span className={`inline-block text-rh-red text-sm font-bold uppercase tracking-widest mb-3 ${className}`}>
      {children}
    </span>
  );
}
