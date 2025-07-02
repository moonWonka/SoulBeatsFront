import { render, screen, waitFor } from '@testing-library/react';
import { vi } from 'vitest';

// Mock backend service first
vi.mock('../../services/backendService', () => ({
  getGenres: vi.fn(),
  getArtistsByGenre: vi.fn(),
  getUserPreferences: vi.fn(),
  updateGenrePreferences: vi.fn(),
  updateArtistPreferences: vi.fn()
}));

// Mock Firebase
vi.mock('../../firebaseConfig', () => ({
  auth: {}
}));

import { MusicPreferences } from './MusicPreferences';
import { AuthProvider } from '../../context/AuthContext';
import { ThemeProvider } from '../../context/ThemeContext';

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

// Mock user
const mockUser = {
  uid: 'test-uid',
  email: 'test@example.com',
  getIdToken: vi.fn(() => Promise.resolve('mock-token'))
};

// Mock AuthContext
vi.mock('../../context/AuthContext', () => ({
  useAuth: () => ({
    user: mockUser,
    loading: false,
    login: vi.fn(),
    logout: vi.fn()
  }),
  AuthProvider: ({ children }: any) => children
}));

const renderMusicPreferences = () => {
  return render(
    <ThemeProvider>
      <AuthProvider>
        <MusicPreferences />
      </AuthProvider>
    </ThemeProvider>
  );
};

describe('MusicPreferences Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading state initially', async () => {
    // Mock backend services to delay
    const backendService = await import('../../services/backendService');
    vi.mocked(backendService.getGenres).mockImplementation(() => new Promise(() => {})); // Never resolves
    vi.mocked(backendService.getUserPreferences).mockImplementation(() => new Promise(() => {}));
    
    renderMusicPreferences();
    
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('renders music preferences title', async () => {
    // Mock successful API responses
    const backendService = await import('../../services/backendService');
    vi.mocked(backendService.getGenres).mockResolvedValue({
      statusCode: 200,
      genres: [
        { id: 1, name: 'Rock', description: 'Rock music', displayOrder: 1 },
        { id: 2, name: 'Pop', description: 'Pop music', displayOrder: 2 }
      ]
    });
    vi.mocked(backendService.getUserPreferences).mockResolvedValue({
      statusCode: 200,
      genrePreferences: [],
      artistPreferences: []
    });

    renderMusicPreferences();

    await waitFor(() => {
      expect(screen.getByText('Preferencias Musicales')).toBeInTheDocument();
    });
  });

  it('renders genres section', async () => {
    const backendService = await import('../../services/backendService');
    vi.mocked(backendService.getGenres).mockResolvedValue({
      statusCode: 200,
      genres: [
        { id: 1, name: 'Rock', description: 'Rock music', displayOrder: 1 },
        { id: 2, name: 'Pop', description: 'Pop music', displayOrder: 2 }
      ]
    });
    vi.mocked(backendService.getUserPreferences).mockResolvedValue({
      statusCode: 200,
      genrePreferences: [],
      artistPreferences: []
    });

    renderMusicPreferences();

    await waitFor(() => {
      expect(screen.getByText('Géneros Musicales')).toBeInTheDocument();
      expect(screen.getByText('Rock')).toBeInTheDocument();
      expect(screen.getByText('Pop')).toBeInTheDocument();
    });
  });

  it('renders save button', async () => {
    const backendService = await import('../../services/backendService');
    vi.mocked(backendService.getGenres).mockResolvedValue({
      statusCode: 200,
      genres: []
    });
    vi.mocked(backendService.getUserPreferences).mockResolvedValue({
      statusCode: 200,
      genrePreferences: [],
      artistPreferences: []
    });

    renderMusicPreferences();

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /guardar preferencias/i })).toBeInTheDocument();
    });
  });

  it('displays error message when API fails', async () => {
    const backendService = await import('../../services/backendService');
    vi.mocked(backendService.getGenres).mockRejectedValue(new Error('API Error'));
    vi.mocked(backendService.getUserPreferences).mockRejectedValue(new Error('API Error'));

    renderMusicPreferences();

    await waitFor(() => {
      expect(screen.getByText(/error al cargar datos musicales/i)).toBeInTheDocument();
    });
  });
});