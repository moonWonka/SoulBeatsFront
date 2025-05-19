// src/components/shared/GradientButton/GradientButton.tsx
import React from 'react'
import './GradientButton.css'

interface GradientButtonProps {
  children: React.ReactNode
  onClick?: () => void
  disabled?: boolean
}

export const GradientButton: React.FC<GradientButtonProps> = ({ children, onClick, disabled = false }) => {
  return (
    <button
      className={`gradient-button ${disabled ? 'disabled' : ''}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  )
}
