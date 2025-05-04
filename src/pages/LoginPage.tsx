import { Login } from '../components/login/Login';

interface LoginPageProps {
  onSetUser: (user: string) => void;
}

export function LoginPage({ onSetUser }: LoginPageProps) {
  return (
    <div className="login-page">
      <Login onSetUser={onSetUser} />
    </div>
  );
}

export default LoginPage;