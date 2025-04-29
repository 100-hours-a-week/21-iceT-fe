const Card = ({ className = '', children }: { className?: string; children: React.ReactNode }) => (
  <div className={`rounded-xl border-1 border-border ${className}`}>{children}</div>
);

export default Card;
