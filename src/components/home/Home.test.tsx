import React from 'react';
import { render, screen } from '@testing-library/react';
vi.mock('../login/Login2', () => ({ Login: () => <div>Login</div> }));
import { Home } from './Home';

test('shows welcome message for default user', () => {
  render(<Home user="" onSetUser={() => {}} />);
  expect(screen.getByText(/Bienvenido, usuarioPrueba/i)).toBeInTheDocument();
});
