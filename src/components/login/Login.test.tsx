import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Login } from './Login';
import { AuthProvider } from '../../context/AuthContext';
import { ThemeProvider } from '../../context/ThemeContext';

// Mock Firebase
vi.mock('../../firebaseConfig', () => ({
  auth: {}
}));

// Mock backend service
vi.mock('../../services/backendService', () => ({
  register: vi.fn(),
  registerGoogleUser: vi.fn()
}));

// Mock Firebase auth functions
vi.mock('firebase/auth', () => ({
  GoogleAuthProvider: vi.fn(),
  signInWithPopup: vi.fn(),
  signInWithRedirect: vi.fn(),
  getRedirectResult: vi.fn(() => Promise.resolve(null)),
  createUserWithEmailAndPassword: vi.fn(),
  signInWithEmailAndPassword: vi.fn(),
  signOut: vi.fn(),
  onAuthStateChanged: vi.fn(() => vi.fn()), // Returns unsubscribe function
}));

const renderLogin = () => {
  return render(
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <Login />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
};

describe('Login Component', () => {
  it('renders login form with email and password fields', () => {
    renderLogin();
    
    expect(screen.getByRole('heading', { name: /Explora y Conecta/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/correo electrónico/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^contraseña$/i)).toBeInTheDocument();
  });

  it('renders login and register modes', () => {
    renderLogin();
    
    // Initially in login mode
    expect(screen.getByRole('button', { name: /iniciar sesión$/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /iniciar sesión con google/i })).toBeInTheDocument();
    
    // Check for register toggle
    expect(screen.getByText(/¿no tienes una cuenta?/i)).toBeInTheDocument();
  });

  it('shows password visibility toggle buttons', () => {
    renderLogin();
    
    const passwordToggleButtons = screen.getAllByRole('button');
    const passwordToggle = passwordToggleButtons.find(button => 
      button.getAttribute('aria-label')?.includes('contraseña')
    );
    
    expect(passwordToggle).toBeInTheDocument();
  });

  it('renders footer with copyright', () => {
    renderLogin();
    
    const currentYear = new Date().getFullYear();
    expect(screen.getByText(`© ${currentYear} SoulBeats`)).toBeInTheDocument();
  });
});