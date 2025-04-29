const Button = ({
  className = '',
  children,
  onClick,
}: {
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
}) => (
  <button
    onClick={onClick}
    className={`py-2 px-4 rounded-md text-white font-semibold text-regular-14 ${className}`}
  >
    {children}
  </button>
);

export default Button;
