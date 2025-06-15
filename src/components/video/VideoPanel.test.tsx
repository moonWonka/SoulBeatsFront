import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { VideoPanel } from './VideoPanel';

test('toggles mute button text', async () => {
  const user = userEvent.setup();
  render(<VideoPanel />);
  const button = screen.getByRole('button');
  expect(button).toHaveTextContent(/Activar Sonido|Silenciar/);
  const before = button.textContent;
  await user.click(button);
  expect(button.textContent).not.toBe(before);
});
