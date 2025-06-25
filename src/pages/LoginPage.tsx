import { Login } from '../components/login/Login';

export function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="flex-shrink-0 bg-gradient-to-r from-fuchsia-600 to-pink-600 text-white py-4 shadow-lg">
        <h1 className="text-center text-2xl font-bold">
          Welcome to SoulBeats
        </h1>
      </header>
      <main className="flex-grow flex items-center justify-center bg-gradient-to-br from-fuchsia-50 to-pink-50">
        <Login />
      </main>
      <footer className="flex-shrink-0 bg-gradient-to-r from-fuchsia-600 to-pink-600 text-white py-4 text-center text-sm">
        &copy; {new Date().getFullYear()} SoulBeats. All rights reserved.
      </footer>
    </div>
  );
}

export default LoginPage;