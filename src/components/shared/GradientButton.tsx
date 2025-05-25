interface GradientButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset'; // Agregamos la prop "type"
}

export const GradientButton: React.FC<GradientButtonProps> = ({
  children,
  onClick,
  disabled = false,
  type = 'button', // Valor predeterminado para "type"
}) => {
  return (
    <button
      type={type} // Usamos la prop "type" aquí
      className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-gradient-to-r from-rose-500 to-pink-600 hover:from-pink-600 hover:to-rose-500 hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 transition-all duration-150 ease-in-out transform hover:scale-105 active:scale-95 ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      }`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};
