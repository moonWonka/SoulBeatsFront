import { render, screen } from '@testing-library/react';
import { SwipeCard } from './SwipeCard';

test('renders children', () => {
  render(
    <SwipeCard onSwipe={() => {}}>
      <div>child</div>
    </SwipeCard>
  );
  expect(screen.getByText('child')).toBeInTheDocument();
});
