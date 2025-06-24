import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom'; // Navbar uses Link
import Navbar from './Navbar';
import { AppView } from '../types';

// Mock the icons used in Navbar if they are complex or cause issues in tests
// For this example, assuming icons are simple enough or will be handled by Jest's moduleNameMapper for SVGs if they were SVGs
// jest.mock('./icons/SparklesIcon', () => () => <svg data-testid="sparkles-icon" />);
// jest.mock('./icons/HeartIcon', () => () => <svg data-testid="heart-icon" />);

describe('Navbar Component', () => {
  const renderNavbar = (currentView: AppView, matchCount: number) => {
    return render(
      <Router>
        <Navbar currentView={currentView} matchCount={matchCount} />
      </Router>
    );
  };

  test('renders Discover and Matches links', () => {
    renderNavbar('swipe', 0);
    expect(screen.getByText('Discover')).toBeInTheDocument();
    expect(screen.getByText('Matches')).toBeInTheDocument();
  });

  test('Discover link points to /swipe', () => {
    renderNavbar('swipe', 0);
    const discoverLink = screen.getByText('Discover').closest('a');
    expect(discoverLink).toHaveAttribute('href', '/swipe');
  });

  test('Matches link points to /matches', () => {
    renderNavbar('swipe', 0);
    const matchesLink = screen.getByText('Matches').closest('a');
    expect(matchesLink).toHaveAttribute('href', '/matches');
  });

  test('displays match count when greater than 0', () => {
    renderNavbar('swipe', 5);
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  test('does not display match count when 0', () => {
    renderNavbar('swipe', 0);
    expect(screen.queryByText('0')).not.toBeInTheDocument();
  });

  test('applies active styling to Discover link when currentView is swipe', () => {
    renderNavbar('swipe', 0);
    // Check for a class or style that indicates active state
    // This depends on how active state is styled in Navbar.tsx (e.g., 'text-rose-500')
    const discoverLabel = screen.getByText('Discover');
    // Check parent Link component for active class
    expect(discoverLabel).toHaveClass('text-rose-500'); // Specific to the span's class
    expect(discoverLabel.closest('a')).toHaveClass('text-rose-500'); // Check the Link itself
  });

  test('applies active styling to Matches link when currentView is matches', () => {
    renderNavbar('matches', 0);
    const matchesLabel = screen.getByText('Matches');
     // Check parent Link component for active class
    expect(matchesLabel).toHaveClass('text-rose-500'); // Specific to the span's class
    expect(matchesLabel.closest('a')).toHaveClass('text-rose-500'); // Check the Link itself
  });

  test('does not apply active styling to Discover link when currentView is matches', () => {
    renderNavbar('matches', 0);
    const discoverLabel = screen.getByText('Discover');
    expect(discoverLabel).not.toHaveClass('text-rose-500');
    expect(discoverLabel).toHaveClass('text-gray-500'); // Assuming this is the inactive class
    expect(discoverLabel.closest('a')).not.toHaveClass('text-rose-500');
    expect(discoverLabel.closest('a')).toHaveClass('text-gray-400'); // Assuming this is the inactive class for the Link
  });
});
