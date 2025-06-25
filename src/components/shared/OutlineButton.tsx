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
}) => {  return (
    <button
      type={type}
      className={`w-full flex justify-center items-center py-2.5 sm:py-3 px-3 sm:px-4 border border-fuchsia-500 rounded-lg shadow-sm text-sm sm:text-base font-medium text-fuchsia-600 bg-white hover:bg-fuchsia-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-fuchsia-500 transition-all duration-150 ease-in-out transform hover:scale-105 active:scale-95 ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      }`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};
