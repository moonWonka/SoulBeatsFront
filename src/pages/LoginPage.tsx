import { Login } from '../components/login/Login';

export function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="flex-shrink-0 text-white py-4 shadow-md">
        <h1 className="text-center text-2xl font-bold bg-gradient-to-r from-rose-500 to-pink-600">
          Welcome to SoulBeats
        </h1>
      </header>
      <main className="flex-grow flex items-center justify-center bg-gradient-to-br from-blue-100 to-teal-100">
        <Login />
      </main>
      <footer className="flex-shrink-0 bg-gray-800 text-gray-300 py-4 text-center text-sm">
        &copy; {new Date().getFullYear()} SoulBeats. All rights reserved.
      </footer>
    </div>
  );
}

export default LoginPage;