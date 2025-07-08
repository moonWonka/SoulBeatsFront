import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import SpotifyCallbackPage from './SpotifyCallbackPage';
import { useAuth } from '../context/AuthContext';
import { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_REDIRECT_URI } from '../config/config';

// Mock react-router-dom hooks
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: jest.fn(),
  useNavigate: () => mockNavigate,
}));

// Mock AuthContext
const mockLoginWithSpotify = jest.fn();
jest.mock('../context/AuthContext', () => ({
  useAuth: jest.fn(),
}));

// Mock config (if not already handled globally, though for SPOTIFY_CLIENT_SECRET it's better to be explicit)
jest.mock('../config/config', () => ({
  SPOTIFY_CLIENT_ID: 'test_client_id',
  SPOTIFY_CLIENT_SECRET: 'test_client_secret',
  SPOTIFY_REDIRECT_URI: 'http://localhost:3000/callback',
}));

describe('SpotifyCallbackPage', () => {
  let globalFetchSpy: jest.SpyInstance;

  beforeEach(() => {
    // Reset mocks before each test
    mockNavigate.mockClear();
    mockLoginWithSpotify.mockClear();
    (useAuth as jest.Mock).mockReturnValue({ loginWithSpotify: mockLoginWithSpotify });
    (jest.requireMock('react-router-dom').useLocation as jest.Mock).mockClear();

    // Mock global fetch
    globalFetchSpy = jest.spyOn(global, 'fetch');
  });

  afterEach(() => {
    globalFetchSpy.mockRestore();
  });

  const mockSpotifyTokenResponse = {
    access_token: 'mockAccessToken',
    token_type: 'Bearer',
    expires_in: 3600,
  };

  const mockSpotifyUserProfileResponse = {
    id: 'mockSpotifyId',
    display_name: 'Mock User',
    email: 'mock@spotify.com',
    images: [{ url: 'http://example.com/profile.jpg' }],
  };

  test('successfully exchanges code, fetches profile, calls loginWithSpotify, and navigates', async () => {
    (jest.requireMock('react-router-dom').useLocation as jest.Mock).mockReturnValue({
      search: '?code=mockCode',
    });

    globalFetchSpy
      .mockResolvedValueOnce( // Spotify Token API call
        new Response(JSON.stringify(mockSpotifyTokenResponse), { status: 200, headers: { 'Content-Type': 'application/json' } })
      )
      .mockResolvedValueOnce( // Spotify User Profile API call
        new Response(JSON.stringify(mockSpotifyUserProfileResponse), { status: 200, headers: { 'Content-Type': 'application/json' } })
      );

    mockLoginWithSpotify.mockResolvedValueOnce(undefined); // Simulate successful app login

    render(
      <MemoryRouter initialEntries={['/callback?code=mockCode']}>
        <Routes>
          <Route path="/callback" element={<SpotifyCallbackPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText(/Processing Spotify login.../i)).toBeInTheDocument();

    await waitFor(() => {
      expect(globalFetchSpy).toHaveBeenCalledWith(
        'https://accounts.spotify.com/api/token',
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + btoa('test_client_id:test_client_secret'),
          },
          body: new URLSearchParams({
            grant_type: 'authorization_code',
            code: 'mockCode',
            redirect_uri: 'http://localhost:3000/callback',
          }),
        })
      );
    });

    await waitFor(() => {
        expect(screen.getByText(/Exchanging authorization code for token.../i)).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(globalFetchSpy).toHaveBeenCalledWith(
        'https://api.spotify.com/v1/me',
        expect.objectContaining({
          headers: {
            'Authorization': `Bearer mockAccessToken`,
          },
        })
      );
    });

    await waitFor(() => {
        expect(screen.getByText(/Access token received. Fetching user profile.../i)).toBeInTheDocument();
    });


    await waitFor(() => {
      expect(mockLoginWithSpotify).toHaveBeenCalledWith('mockAccessToken', mockSpotifyUserProfileResponse);
    });

    await waitFor(() => {
        expect(screen.getByText(/Application login successful! Redirecting to dashboard.../i)).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard', { replace: true });
    });
  });

  test('handles error from Spotify (e.g., access_denied)', async () => {
    (jest.requireMock('react-router-dom').useLocation as jest.Mock).mockReturnValue({
      search: '?error=access_denied',
    });

    render(
      <MemoryRouter initialEntries={['/callback?error=access_denied']}>
        <Routes>
          <Route path="/callback" element={<SpotifyCallbackPage />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Error during Spotify login: access_denied/i)).toBeInTheDocument();
    });
    expect(globalFetchSpy).not.toHaveBeenCalled();
    expect(mockLoginWithSpotify).not.toHaveBeenCalled();
    // expect(mockNavigate).toHaveBeenCalledWith('/login', { replace: true }); // Optional: if you redirect on error
  });

  test('handles missing code in URL', async () => {
    (jest.requireMock('react-router-dom').useLocation as jest.Mock).mockReturnValue({
      search: '', // No code
    });

    render(
      <MemoryRouter initialEntries={['/callback']}>
        <Routes>
          <Route path="/callback" element={<SpotifyCallbackPage />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/No authorization code found in URL./i)).toBeInTheDocument();
    });
    expect(globalFetchSpy).not.toHaveBeenCalled();
    expect(mockLoginWithSpotify).not.toHaveBeenCalled();
  });

  test('handles error during token exchange', async () => {
    (jest.requireMock('react-router-dom').useLocation as jest.Mock).mockReturnValue({
      search: '?code=mockCode',
    });

    globalFetchSpy.mockResolvedValueOnce( // Spotify Token API call fails
      new Response(JSON.stringify({ error: 'invalid_grant', error_description: 'Invalid authorization code' }), { status: 400, headers: { 'Content-Type': 'application/json' } })
    );

    render(
      <MemoryRouter initialEntries={['/callback?code=mockCode']}>
        <Routes>
          <Route path="/callback" element={<SpotifyCallbackPage />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Error processing Spotify login: Failed to get token: 400 Bad Request - Invalid authorization code/i)).toBeInTheDocument();
    });
    expect(mockLoginWithSpotify).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalledWith('/dashboard', expect.anything());
  });

  test('handles error during user profile fetch', async () => {
    (jest.requireMock('react-router-dom').useLocation as jest.Mock).mockReturnValue({
      search: '?code=mockCode',
    });

    globalFetchSpy
      .mockResolvedValueOnce( // Spotify Token API call - success
        new Response(JSON.stringify(mockSpotifyTokenResponse), { status: 200, headers: { 'Content-Type': 'application/json' } })
      )
      .mockResolvedValueOnce( // Spotify User Profile API call - fails
        new Response(null, { status: 401, statusText: 'Unauthorized' })
      );

    render(
      <MemoryRouter initialEntries={['/callback?code=mockCode']}>
        <Routes>
          <Route path="/callback" element={<SpotifyCallbackPage />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Error processing Spotify login: Failed to get user profile: 401 Unauthorized/i)).toBeInTheDocument();
    });
    expect(mockLoginWithSpotify).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalledWith('/dashboard', expect.anything());
  });

  test('handles error from loginWithSpotify', async () => {
    (jest.requireMock('react-router-dom').useLocation as jest.Mock).mockReturnValue({
      search: '?code=mockCode',
    });

    globalFetchSpy
      .mockResolvedValueOnce(new Response(JSON.stringify(mockSpotifyTokenResponse), { status: 200 }))
      .mockResolvedValueOnce(new Response(JSON.stringify(mockSpotifyUserProfileResponse), { status: 200 }));

    mockLoginWithSpotify.mockRejectedValueOnce(new Error('App login failed'));

    render(
      <MemoryRouter initialEntries={['/callback?code=mockCode']}>
        <Routes><Route path="/callback" element={<SpotifyCallbackPage />} /></Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Error processing Spotify login: App login failed/i)).toBeInTheDocument();
    });
    expect(mockLoginWithSpotify).toHaveBeenCalledWith('mockAccessToken', mockSpotifyUserProfileResponse);
    expect(mockNavigate).not.toHaveBeenCalledWith('/dashboard', expect.anything());
  });
});
