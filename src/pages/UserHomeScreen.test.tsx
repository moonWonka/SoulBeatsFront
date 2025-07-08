import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import UserHomeScreen from './UserHomeScreen';
import { useAuth, AuthContextProps } from '../context/AuthContext'; // Import AuthContextProps
import { User } from 'firebase/auth';

// Mock react-router-dom hooks
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// Mock AuthContext
jest.mock('../context/AuthContext');

// Helper to provide mock AuthContext value
const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;

describe('UserHomeScreen', () => {
  const mockLogout = jest.fn();

  beforeEach(() => {
    mockLogout.mockClear();
    mockNavigate.mockClear();
  });

  const renderWithRouter = (ui: React.ReactElement) => {
    return render(<MemoryRouter>{ui}</MemoryRouter>);
  };

  test('renders correctly for a user not logged in (though protected route would prevent this)', () => {
    // This scenario is less likely due to ProtectedRoute, but good for completeness
    mockUseAuth.mockReturnValue({
      user: null,
      spotifyUser: null,
      spotifyAccessToken: null,
      login: jest.fn(),
      logout: mockLogout,
      loginWithSpotify: jest.fn(),
      loading: false,
    } as AuthContextProps); // Cast to AuthContextProps

    renderWithRouter(<UserHomeScreen />);

    // Check for elements that might appear if somehow rendered without a user
    // For example, if the component had a specific "not logged in" message (it doesn't currently)
    // For now, we can just check it doesn't crash and key elements are absent or default
    expect(screen.getByText(/Bienvenido a tu espacio personal./i)).toBeInTheDocument(); // Default welcome
    expect(screen.queryByText(/Conectado a Spotify/i)).not.toBeInTheDocument();
    expect(screen.getByText('Configurar Perfil')).toBeInTheDocument();
    // The logout button itself might be present if `user` is null but the button is always rendered
    // However, the logic for its presence might depend on how `user` is checked.
    // In the current UserHomeScreen, buttons are always there, but actions depend on user state.
    expect(screen.getByText('Cerrar Sesión')).toBeInTheDocument();
  });

  test('renders correctly for a user logged in with email/password', () => {
    const emailUser = {
      uid: 'emailUser123',
      email: 'test@example.com',
      displayName: 'Email User',
      providerData: [{ providerId: 'password' }],
    } as User;

    mockUseAuth.mockReturnValue({
      user: emailUser,
      spotifyUser: null,
      spotifyAccessToken: null,
      login: jest.fn(),
      logout: mockLogout,
      loginWithSpotify: jest.fn(),
      loading: false,
    } as AuthContextProps);

    renderWithRouter(<UserHomeScreen />);

    expect(screen.getByText(emailUser.displayName!)).toBeInTheDocument();
    expect(screen.queryByText(/Conectado a Spotify/i)).not.toBeInTheDocument();
    expect(screen.getByText('Configurar Perfil')).toBeInTheDocument();
    expect(screen.getByText('Cerrar Sesión')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Cerrar Sesión'));
    expect(mockLogout).toHaveBeenCalledTimes(1);
  });

  test('renders correctly for a user logged in with Spotify', () => {
    const spotifyProviderUser = { // This is the "simulated" user object in AuthContext
      uid: 'spotifyUserId456',
      email: 'spotify@example.com',
      displayName: 'Spotify Main User', // This might come from spotifyUser.display_name in AuthContext logic
      providerData: [{ providerId: 'spotify.com' }],
    } as User;

    const mockSpotifyUserData = {
      id: 'spotifyUserId456',
      display_name: 'Real Spotify Name',
      email: 'spotify@example.com',
      images: [{ url: 'http://example.com/spotify.jpg' }],
    };

    mockUseAuth.mockReturnValue({
      user: spotifyProviderUser,
      spotifyUser: mockSpotifyUserData,
      spotifyAccessToken: 'mockSpotifyToken',
      login: jest.fn(),
      logout: mockLogout,
      loginWithSpotify: jest.fn(),
      loading: false,
    } as AuthContextProps);

    renderWithRouter(<UserHomeScreen />);

    // Check for the main user display name (which might be based on Spotify or Firebase)
    expect(screen.getByText(spotifyProviderUser.displayName!)).toBeInTheDocument();

    // Check for Spotify specific elements
    expect(screen.getByText(/Conectado a Spotify/i)).toBeInTheDocument();
    expect(screen.getByText(`¡Hola, ${mockSpotifyUserData.display_name}!`)).toBeInTheDocument();
    expect(screen.getByText(`Email: ${mockSpotifyUserData.email}`)).toBeInTheDocument();
    expect(screen.getByAltText('Spotify Profile')).toHaveAttribute('src', mockSpotifyUserData.images[0].url);

    expect(screen.getByText('Configurar Perfil')).toBeInTheDocument();
    expect(screen.getByText('Cerrar Sesión')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Cerrar Sesión'));
    expect(mockLogout).toHaveBeenCalledTimes(1);
  });

  test('handles Spotify user without an email or profile picture', () => {
    const spotifyProviderUser = {
      uid: 'spotifyUserId789',
      displayName: 'Spotify User No Email',
      providerData: [{ providerId: 'spotify.com' }],
    } as any; // Using 'any' because it's a simplified User object

    const mockSpotifyUserDataNoEmail = {
      id: 'spotifyUserId789',
      display_name: 'Spotify User No Email',
      // No email, no images
    };

    mockUseAuth.mockReturnValue({
      user: spotifyProviderUser,
      spotifyUser: mockSpotifyUserDataNoEmail,
      spotifyAccessToken: 'mockToken',
      logout: mockLogout,
      loading: false,
    } as any); // Cast as any for simplicity in mock

    renderWithRouter(<UserHomeScreen />);

    expect(screen.getByText(/Conectado a Spotify/i)).toBeInTheDocument();
    expect(screen.getByText(`¡Hola, ${mockSpotifyUserDataNoEmail.display_name}!`)).toBeInTheDocument();
    expect(screen.queryByText(/Email:/i)).not.toBeInTheDocument(); // Email should not be rendered
    expect(screen.queryByAltText('Spotify Profile')).not.toBeInTheDocument(); // Profile image should not be rendered
    // Default user icon should be visible (this depends on your Lucide icon and how UserCircle2 is rendered)
    // This assertion might need adjustment based on how the UserCircle2 icon is identified when no image is present.
    // If UserCircle2 is always there but hidden/shown, or if it's conditionally rendered:
    expect(document.querySelector('svg.lucide-user-circle-2')).toBeInTheDocument();


    fireEvent.click(screen.getByText('Cerrar Sesión'));
    expect(mockLogout).toHaveBeenCalledTimes(1);
  });

  test('navigation buttons work', () => {
    mockUseAuth.mockReturnValue({
      user: { uid: '1', email: 'test@test.com', displayName: 'Test', providerData: [] } as User,
      spotifyUser: null,
      spotifyAccessToken: null,
      logout: mockLogout,
      loading: false,
    } as any);

    renderWithRouter(<UserHomeScreen />);

    fireEvent.click(screen.getByText('Configurar Perfil'));
    expect(mockNavigate).toHaveBeenCalledWith('/profile/edit');
  });
});
