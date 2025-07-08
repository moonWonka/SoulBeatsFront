import React, { ReactNode } from 'react';
import { render, act, screen, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from './AuthContext';
import * as backendService from '../services/backendService';
import { User } from 'firebase/auth';

// Mock Firebase auth methods used in AuthContext
jest.mock('firebase/auth', () => ({
  ...jest.requireActual('firebase/auth'), // Keep other exports
  getAuth: jest.fn(() => ({})), // Mock getAuth if auth is initialized directly in the module
  onAuthStateChanged: jest.fn((auth, callback) => {
    // Simulate no user initially, then you can trigger changes if needed
    const unsubscribe = jest.fn();
    // Call callback with null initially to set loading to false
    Promise.resolve().then(() => callback(null));
    return unsubscribe;
  }),
  signOut: jest.fn(() => Promise.resolve()),
  signInWithEmailAndPassword: jest.fn(),
}));

// Mock backendService
jest.mock('../services/backendService', () => ({
  registerGoogleUser: jest.fn(),
  registerOrLoginSpotifyUser: jest.fn(),
}));

// Mock firebaseConfig (if it's imported anywhere that affects AuthContext, though not directly used in the provided AuthContext code)
jest.mock('../firebaseConfig', () => ({
  auth: {}, // Mocked auth object
}));


const TestConsumerComponent: React.FC = () => {
  const auth = useAuth();
  if (auth.loading) return <div>Loading...</div>;
  return (
    <div>
      <div data-testid="user">{JSON.stringify(auth.user)}</div>
      <div data-testid="spotifyUser">{JSON.stringify(auth.spotifyUser)}</div>
      <div data-testid="spotifyAccessToken">{auth.spotifyAccessToken}</div>
      <button onClick={() => auth.loginWithSpotify('testAccessToken', { id: 'spotifyTestId', email: 'spotify@test.com', display_name: 'Spotify User' })}>
        Login Spotify
      </button>
      <button onClick={() => auth.logout()}>Logout</button>
    </div>
  );
};

const renderWithAuthProvider = (children: ReactNode) => {
  return render(
    <AuthProvider>
      {children}
    </AuthProvider>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    // Reset mocks
    (backendService.registerOrLoginSpotifyUser as jest.Mock).mockClear();
    (jest.requireMock('firebase/auth').signOut as jest.Mock).mockClear();
    // Ensure onAuthStateChanged is freshly mocked for each relevant test group
     (jest.requireMock('firebase/auth').onAuthStateChanged as jest.Mock).mockImplementation((auth, callback) => {
        Promise.resolve().then(() => callback(null)); // No user initially
        return jest.fn(); // Return unsubscribe
    });
  });

  describe('loginWithSpotify', () => {
    const mockSpotifyProfile = {
      id: 'spotifyTestId123',
      email: 'spotify@example.com',
      display_name: 'Spotify Test User',
      images: [{ url: 'test.jpg' }],
    };
    const mockAccessToken = 'mockSpotifyAccessToken';

    test('successfully logs in with Spotify and updates context state', async () => {
      (backendService.registerOrLoginSpotifyUser as jest.Mock).mockResolvedValueOnce({
        success: true,
        user: {
          id: mockSpotifyProfile.id,
          email: mockSpotifyProfile.email,
          name: mockSpotifyProfile.display_name,
        },
      });

      renderWithAuthProvider(<TestConsumerComponent />);

      // Wait for initial loading to complete
      await waitFor(() => expect(screen.queryByText('Loading...')).not.toBeInTheDocument());

      act(() => {
        screen.getByText('Login Spotify').click();
      });

      await waitFor(() => {
        expect(backendService.registerOrLoginSpotifyUser).toHaveBeenCalledWith(mockSpotifyProfile, mockAccessToken.replace('testAccessToken', 'mockSpotifyAccessToken')); // Small hack due to button's hardcoded token
      });

      await waitFor(() => {
        expect(screen.getByTestId('spotifyAccessToken').textContent).toBe(mockAccessToken.replace('testAccessToken', 'mockSpotifyAccessToken'));
      });

      const expectedSimulatedUser = {
        uid: mockSpotifyProfile.id,
        email: mockSpotifyProfile.email,
        displayName: mockSpotifyProfile.display_name,
        providerData: [{ providerId: 'spotify.com' }],
      };

      await waitFor(() => {
          expect(JSON.parse(screen.getByTestId('spotifyUser').textContent || '{}')).toEqual(mockSpotifyProfile);
          expect(JSON.parse(screen.getByTestId('user').textContent || '{}')).toEqual(expectedSimulatedUser);
      });
    });

    test('handles error from registerOrLoginSpotifyUser and does not update state', async () => {
      (backendService.registerOrLoginSpotifyUser as jest.Mock).mockRejectedValueOnce(new Error('Backend Spotify login failed'));

      renderWithAuthProvider(<TestConsumerComponent />);
      await waitFor(() => expect(screen.queryByText('Loading...')).not.toBeInTheDocument());

      // Suppress console.error for this specific expected error
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      act(() => {
        screen.getByText('Login Spotify').click();
      });

      await waitFor(() => {
        expect(backendService.registerOrLoginSpotifyUser).toHaveBeenCalled();
      });

      expect(screen.getByTestId('spotifyAccessToken').textContent).toBe('');
      expect(screen.getByTestId('spotifyUser').textContent).toBe('null');
      expect(screen.getByTestId('user').textContent).toBe('null'); // Assuming initial state is null

      consoleErrorSpy.mockRestore();
    });
  });

  describe('logout', () => {
    const mockSpotifyProfile = { id: 'sId', email: 's@e.com', display_name: 'S User' };
    const mockAccessToken = 'sAccessToken';

    test('clears Spotify and Firebase user state on logout after Spotify login', async () => {
      // Setup: Simulate Spotify login first
      (backendService.registerOrLoginSpotifyUser as jest.Mock).mockResolvedValueOnce({
        success: true,
        user: { id: mockSpotifyProfile.id, email: mockSpotifyProfile.email, name: mockSpotifyProfile.display_name },
      });

      renderWithAuthProvider(<TestConsumerComponent />);
      await waitFor(() => expect(screen.queryByText('Loading...')).not.toBeInTheDocument());

      act(() => {
        // Use different values for login button in TestConsumerComponent for clarity if needed
        // For now, reusing 'Login Spotify' which uses hardcoded values internally for the test
         const loginButton = screen.getByText('Login Spotify');
         loginButton.onclick = () => useAuth().loginWithSpotify(mockAccessToken, mockSpotifyProfile);
         loginButton.click();
      });

      await waitFor(() => {
        expect(screen.getByTestId('spotifyAccessToken').textContent).toBe(mockAccessToken);
      });
      expect(JSON.parse(screen.getByTestId('spotifyUser').textContent || '{}')).toEqual(mockSpotifyProfile);
      expect(JSON.parse(screen.getByTestId('user').textContent || '{}').uid).toBe(mockSpotifyProfile.id);

      // Action: Call logout
      const firebaseSignOutMock = jest.requireMock('firebase/auth').signOut;
      act(() => {
        screen.getByText('Logout').click();
      });

      // Assertions
      await waitFor(() => {
        expect(firebaseSignOutMock).toHaveBeenCalled();
      });
      expect(screen.getByTestId('spotifyAccessToken').textContent).toBe('');
      expect(screen.getByTestId('spotifyUser').textContent).toBe('null');
      expect(screen.getByTestId('user').textContent).toBe('null');
    });
  });

  // Test onAuthStateChanged behavior if necessary, though it's complex
  // For example, simulating Firebase user state changes
  test('onAuthStateChanged updates user state correctly', async () => {
    let authStateCallback: ((user: User | null) => void) | null = null;
    (jest.requireMock('firebase/auth').onAuthStateChanged as jest.Mock).mockImplementation((auth, callback) => {
      authStateCallback = callback;
      Promise.resolve().then(() => callback(null)); // Initial call
      return jest.fn(); // unsubscribe
    });

    renderWithAuthProvider(<TestConsumerComponent />);
    await waitFor(() => expect(screen.queryByText('Loading...')).not.toBeInTheDocument());
    expect(screen.getByTestId('user').textContent).toBe('null');

    const mockFirebaseUser = { uid: 'firebaseUser1', email: 'firebase@test.com', providerData: [{providerId: 'password'}] } as User;
    act(() => {
      if (authStateCallback) {
        authStateCallback(mockFirebaseUser);
      }
    });

    await waitFor(() => {
        expect(JSON.parse(screen.getByTestId('user').textContent || '{}')).toEqual(mockFirebaseUser);
    });

    // Simulate logout or user becoming null
    act(() => {
      if (authStateCallback) {
        authStateCallback(null);
      }
    });
    await waitFor(() => {
        expect(screen.getByTestId('user').textContent).toBe('null');
    });
  });
});
