type TagPillProps = {
  children: string;
  active?: boolean;
  onClick?: () => void;
};

export function TagPill({ children, active, onClick }: TagPillProps) {
  const className = active
    ? 'bg-moss text-cream'
    : 'bg-sage/15 text-moss ring-1 ring-sage/25';

  if (onClick) {
    return (
      <button onClick={onClick} className={`rounded-full px-3 py-1 text-xs font-semibold ${className}`}>
        {children}
      </button>
    );
  }

  return <span className={`rounded-full px-3 py-1 text-xs font-semibold ${className}`}>{children}</span>;
}
