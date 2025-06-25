// Exportaciones de los componentes revisados y mejorados
export { default as ActionButtons } from './ActionButtons';
export { default as MatchModal } from './MatchModal';
export { default as ProfileCard } from './ProfileCard';

// Tipos relacionados (si se necesitan)
export interface ActionButtonsProps {
  onNope: () => void;
  onLike: () => void;
  disabled?: boolean;
}

export interface MatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  matchedProfile: any | null; // Se puede tipar más específicamente según el contexto
  userAvatar?: string;
}

export interface ProfileCardProps {
  profile: any; // Se puede tipar más específicamente según el contexto
}
