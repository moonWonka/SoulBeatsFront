import { render, screen } from '@testing-library/react';
import { Login } from './Login2';

vi.mock('../../firebaseConfig', () => ({ auth: {} }));

it('renders login heading', () => {
  render(<Login onSetUser={() => {}} />);
  expect(
    screen.getByRole('heading', { name: /Iniciar Sesión/i })
  ).toBeInTheDocument();
});
