interface GradientButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

export const GradientButton: React.FC<GradientButtonProps> = ({
  children,
  onClick,
  disabled = false,
  type = 'button',
}) => {
  return (
    <button
      type={type}
      className={`w-full flex justify-center items-center py-2.5 sm:py-3 px-3 sm:px-4 border border-transparent rounded-lg shadow-sm text-sm sm:text-base font-medium text-white bg-primary-gradient hover:bg-primary-gradient-hover focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-150 ease-in-out transform hover:scale-105 active:scale-95
        focus:ring-fuchsia-500 dark:focus:ring-violet-500 dark:focus:ring-offset-gray-800 focus:ring-offset-white
        ${disabled ? 'opacity-50 cursor-not-allowed transform-none' : ''}
      `}
      onClick={onClick}
      disabled={disabled}
      style={{
        background: disabled ? undefined : 'linear-gradient(to right, var(--color-primary-from), var(--color-primary-to))',
      }}
      onMouseEnter={(e) => {
        if (!disabled) {
          e.currentTarget.style.background = 'linear-gradient(to right, var(--color-primary-hover-from), var(--color-primary-hover-to))';
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled) {
          e.currentTarget.style.background = 'linear-gradient(to right, var(--color-primary-from), var(--color-primary-to))';
        }
      }}
    >
      {children}
    </button>
  );
};
