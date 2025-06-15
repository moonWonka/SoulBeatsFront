import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { GradientButton } from './GradientButton';

it('calls onClick when clicked', async () => {
  const user = userEvent.setup();
  const handleClick = vi.fn();
  render(<GradientButton onClick={handleClick}>Press</GradientButton>);
  await user.click(screen.getByRole('button'));
  expect(handleClick).toHaveBeenCalled();
});
