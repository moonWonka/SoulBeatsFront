import React, { useState } from 'react';
import HeartIcon from '../icons/HeartIcon'; // Re-use for branding
import { GradientButton } from '../shared/GradientButton';

interface LoginProps {
  onSetUser: (user: string) => void; // Cambiado para aceptar un argumento
}

export function Login({ onSetUser }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    // Basic validation (non-empty)
    if (!email.trim() || !password.trim()) {
      setError('Please enter both email and password.');
      return;
    }

    // Simulate successful login for any non-empty credentials
    // In a real app, you would make an API call here
    console.log('Attempting login with:', { email, password });
    onSetUser('user'); // Se pasa un argumento de ejemplo
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-rose-100 to-teal-100 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white shadow-2xl rounded-xl p-8 md:p-12">
          <div className="flex flex-col items-center mb-8">
            <HeartIcon className="w-12 h-12 text-rose-500 mb-3" />
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-pink-600">
              Swipe & Match
            </h1>
            <p className="text-600 mt-1">Welcome back!</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 sm:text-sm transition-colors"
                placeholder="you@example.com"
                aria-label="Email address"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 sm:text-sm transition-colors"
                placeholder="••••••••"
                aria-label="Password"
              />
            </div>

            {error && (
              <p className="text-sm text-red-600 bg-red-100 p-2 rounded-md text-center">
                {error}
              </p>
            )}

            <div>

              <GradientButton 
                type="submit"
                onClick={() => console.log('Hello')}>
                Log In
              </GradientButton>
            </div>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <a href="#" className="font-medium text-rose-600 hover:text-rose-500">
                Sign up
              </a>
            </p>
             <p className="text-sm text-gray-600 mt-1">
              <a href="#" className="font-medium text-rose-600 hover:text-rose-500">
                Forgot password?
              </a>
            </p>
          </div>
        </div>
      </div>
       <footer className="text-center mt-8 text-gray-600 text-sm">
        <p>&copy; {new Date().getFullYear()} SoulBeats</p>
      </footer>
    </div>
  );
};

export default Login;
