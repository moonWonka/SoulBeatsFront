import { render, screen } from '@testing-library/react';
import { About } from './About';

describe('About', () => {
  it('shows info heading', () => {
    render(<About />);
    expect(screen.getByText(/Acerca de/i)).toBeInTheDocument();
  });
});
