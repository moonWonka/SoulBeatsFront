import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_REDIRECT_URI } from '../config/config';
import { useAuth } from '../../context/AuthContext'; // Import useAuth

const SpotifyCallbackPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { loginWithSpotify } = useAuth(); // Get loginWithSpotify from context
  const [message, setMessage] = useState('Processing Spotify login...');

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const code = searchParams.get('code');
    const error = searchParams.get('error');

    if (error) {
      setMessage(`Error during Spotify login: ${error}`);
      console.error('Error from Spotify:', error);
      // Optionally redirect to login page or show an error message
      // navigate('/login', { replace: true });
      return;
    }

    if (code) {
      const exchangeCodeForToken = async () => {
        try {
          setMessage('Exchanging authorization code for token...');
          const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'Authorization': 'Basic ' + btoa(SPOTIFY_CLIENT_ID + ':' + SPOTIFY_CLIENT_SECRET)
            },
            body: new URLSearchParams({
              grant_type: 'authorization_code',
              code: code,
              redirect_uri: SPOTIFY_REDIRECT_URI
            })
          });

          if (!tokenResponse.ok) {
            const errorData = await tokenResponse.json();
            throw new Error(`Failed to get token: ${tokenResponse.status} ${tokenResponse.statusText} - ${errorData.error_description || errorData.error || ''}`);
          }

          const tokenData = await tokenResponse.json();
          const accessToken = tokenData.access_token;
          console.log('Spotify Access Token:', accessToken);
          setMessage('Access token received. Fetching user profile...');

          const userProfileResponse = await fetch('https://api.spotify.com/v1/me', {
            headers: {
              'Authorization': `Bearer ${accessToken}`
            }
          });

          if (!userProfileResponse.ok) {
            throw new Error(`Failed to get user profile: ${userProfileResponse.status} ${userProfileResponse.statusText}`);
          }

          const userProfileData = await userProfileResponse.json();
          console.log('Spotify User Profile:', userProfileData);
          setMessage('Spotify login successful! Attempting to log in with application context...');

          await loginWithSpotify(accessToken, userProfileData);
          setMessage('Application login successful! Redirecting to dashboard...');
          navigate('/dashboard', { replace: true });

        } catch (err: any) {
          console.error('Error during Spotify token exchange, profile fetch, or app login:', err);
          setMessage(`Error processing Spotify login: ${err.message}. Check console for details.`);
          // Optionally, redirect to login page with error
          // navigate('/login?error=spotify_failed', { replace: true });
        }
      };

      exchangeCodeForToken();
    } else {
      setMessage('No authorization code found in URL.');
      // navigate('/login', { replace: true });
    }
  }, [location, navigate]);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column' }}>
      <h1>Spotify Login Callback</h1>
      <p>{message}</p>
      <p style={{ marginTop: '20px', color: 'red', fontWeight: 'bold' }}>
        SECURITY WARNING: The SPOTIFY_CLIENT_SECRET is currently used directly in the frontend.
        This is insecure and should be handled by a backend proxy in a production environment.
      </p>
    </div>
  );
};

export default SpotifyCallbackPage;
