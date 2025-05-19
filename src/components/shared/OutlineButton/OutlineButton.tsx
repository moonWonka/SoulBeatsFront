import './OutlineButton.css'

interface OutlineButtonProps {
  children: React.ReactNode
  onClick?: () => void
  disabled?: boolean
}

export const OutlineButton: React.FC<OutlineButtonProps> = ({ children, onClick, disabled = false }) => {
  return (
    <button
      className={`outline-button ${disabled ? 'disabled' : ''}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  )
}
