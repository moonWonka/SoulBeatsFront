interface OutlineButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}

export const OutlineButton: React.FC<OutlineButtonProps> = ({
  children,
  onClick,
  disabled = false,
}) => {
  return (
    <button
      className={`w-full flex justify-center py-3 px-4 border border-rose-500 rounded-lg shadow-sm text-base font-medium text-rose-500 bg-white hover:bg-rose-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 transition-all duration-150 ease-in-out transform hover:scale-105 active:scale-95 ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      }`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};
