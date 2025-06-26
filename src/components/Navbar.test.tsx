import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Navbar from './Navbar';
import { AppView } from '../types';
import { ThemeProvider } from '../context/ThemeContext';

// Wrapper component for tests that need ThemeProvider
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <ThemeProvider>{children}</ThemeProvider>;
};

describe('Navbar', () => {
  it('calls setCurrentView on button click', async () => {
    const user = userEvent.setup();
    const setCurrentView = vi.fn();
    render(
      <TestWrapper>
        <Navbar currentView="swipe" setCurrentView={setCurrentView} matchCount={0} />
      </TestWrapper>
    );
    await user.click(screen.getByRole('button', { name: /Coincidencias/i }));
    expect(setCurrentView).toHaveBeenCalledWith('matches' as AppView);
  });
});
