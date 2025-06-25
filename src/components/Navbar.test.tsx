import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Navbar from './Navbar';
import { AppView } from '../types';

describe('Navbar', () => {
  it('calls setCurrentView on button click', async () => {
    const user = userEvent.setup();
    const setCurrentView = vi.fn();
    render(<Navbar currentView="swipe" setCurrentView={setCurrentView} matchCount={0} />);
    await user.click(screen.getByRole('button', { name: /Coincidencias/i }));
    expect(setCurrentView).toHaveBeenCalledWith('matches' as AppView);
  });
});
