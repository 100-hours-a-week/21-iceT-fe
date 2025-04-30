const Button = ({
  className = '',
  children,
  onClick,
  disabled,
}: {
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}) => (
  <button
    onClick={onClick}
    className={`py-2 px-4 rounded-md text-white font-semibold text-regular-14  ${disabled ? 'bg-primary-disabled cursor-not-allowed' : 'bg-primary hover:brightness-90'} ${className}`}
    disabled={disabled}
  >
    {children}
  </button>
);

export default Button;
