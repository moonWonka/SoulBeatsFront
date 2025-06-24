import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
// Import AppRouterContent instead of AppRouter for testing
import { AppRouterContent } from './AppRouter';
// We won't need AuthContextType directly here anymore if we mock useAuth effectively.
// import { type AuthContextType } from '../context/AuthContext';

// Explicitly mock firebaseConfig BEFORE other imports that might use it
// This is still important because AuthContext.tsx imports it.
jest.mock('../firebaseConfig');

// Mock the useAuth hook from AuthContext
// The factory function now directly defines useAuth as a jest.fn()
jest.mock('../context/AuthContext', () => ({
  __esModule: true, // Good practice for ES modules
  useAuth: jest.fn(),
}));

// Import the mocked useAuth to configure it in tests
import { useAuth } from '../context/AuthContext';


// Mock page components
// Named exports
jest.mock('../pages/HomePage', () => ({ __esModule: true, HomePage: () => <div>HomePageMock</div> }));
jest.mock('../pages/AboutPage', () => ({ __esModule: true, AboutPage: () => <div>AboutPageMock</div> }));
jest.mock('../pages/LoginPage', () => ({ __esModule: true, LoginPage: () => <div>LoginPageMock</div> }));
jest.mock('../pages/SwipePage', () => ({ __esModule: true, SwipePage: () => <div>SwipePageMock</div> }));
// Default exports
jest.mock('../pages/MatchesPage', () => ({ __esModule: true, default: () => <div>MatchesPageMock</div> }));
jest.mock('../components/Navbar', () => ({ __esModule: true, default: () => <nav>NavbarMock</nav> }));


describe('AppRouter', () => {
  const renderApp = (initialEntries: string[]) => {
    return render(
      <MemoryRouter initialEntries={initialEntries}>
        <AppRouterContent /> {/* Render AppRouterContent */}
      </MemoryRouter>
    );
  };

  // --- Test Public Routes ---
  test('renders HomePage for / route', () => {
    (useAuth as jest.Mock).mockReturnValue({ user: null, loading: false });
    renderApp(['/']);
    expect(screen.getByText('HomePageMock')).toBeInTheDocument();
  });

  test('renders AboutPage for /about route', () => {
    (useAuth as jest.Mock).mockReturnValue({ user: null, loading: false });
    renderApp(['/about']);
    expect(screen.getByText('AboutPageMock')).toBeInTheDocument();
  });

  test('renders LoginPage for /login route', () => {
    (useAuth as jest.Mock).mockReturnValue({ user: null, loading: false });
    renderApp(['/login']);
    expect(screen.getByText('LoginPageMock')).toBeInTheDocument();
  });


  // --- Test Protected Routes - Unauthenticated ---
  describe('Unauthenticated User', () => {
    beforeEach(() => {
      // Simulate unauthenticated user
      (useAuth as jest.Mock).mockReturnValue({ user: null, loading: false });
    });

    test('redirects from /swipe to /login', async () => {
      renderApp(['/swipe']);
      await waitFor(() => {
        expect(screen.getByText('LoginPageMock')).toBeInTheDocument();
      });
    });

    test('redirects from /matches to /login', async () => {
      renderApp(['/matches']);
      await waitFor(() => {
        expect(screen.getByText('LoginPageMock')).toBeInTheDocument();
      });
    });
  });

  // --- Test Protected Routes - Authenticated ---
  describe('Authenticated User', () => {
    beforeEach(() => {
      // Simulate authenticated user
      (useAuth as jest.Mock).mockReturnValue({
        user: { uid: 'test-uid', email: 'test@example.com' },
        loading: false
      });
    });

    test('renders SwipePage for /swipe route', () => {
      renderApp(['/swipe']);
      expect(screen.getByText('SwipePageMock')).toBeInTheDocument();
    });

    test('renders MatchesPage for /matches route', () => {
      renderApp(['/matches']);
      expect(screen.getByText('MatchesPageMock')).toBeInTheDocument();
    });
  });

  // --- Test Navbar is rendered ---
  test('renders Navbar', () => {
    (useAuth as jest.Mock).mockReturnValue({ user: null, loading: false }); // Navbar doesn't depend on auth state for rendering
    renderApp(['/']);
    expect(screen.getByText('NavbarMock')).toBeInTheDocument();
  });
});
