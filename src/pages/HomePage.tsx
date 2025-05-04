import { Home } from '../components/home/Home';

interface HomePageProps {
  user: string;
  onSetUser: (newUser: string) => void;
}

export function HomePage({ user, onSetUser }: HomePageProps) {
  return <Home user={user} onSetUser={onSetUser} />;
}