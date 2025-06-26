interface OutlineButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

export const OutlineButton: React.FC<OutlineButtonProps> = ({
  children,
  onClick,
  disabled = false,
  type = 'button',
}) => {
  return (
    <button
      type={type}
      className={`w-full flex justify-center items-center py-2.5 sm:py-3 px-3 sm:px-4 border rounded-lg shadow-sm text-sm sm:text-base font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-150 ease-in-out transform hover:scale-105 active:scale-95
        border-fuchsia-500 text-fuchsia-600 bg-white hover:bg-fuchsia-50 focus:ring-fuchsia-500 focus:ring-offset-white
        dark:border-violet-500 dark:text-violet-400 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-violet-500 dark:focus:ring-offset-gray-800
        ${disabled ? 'opacity-50 cursor-not-allowed transform-none' : ''}
      `}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};
