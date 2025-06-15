import { render, screen } from '@testing-library/react';
import ProfileCard from './ProfileCard';
import { UserProfile } from '../../types';

const profile: UserProfile = {
  id: '1',
  name: 'Alice',
  age: 25,
  bio: '',
  imageUrl: 'img.jpg',
  interests: [],
};

test('renders profile information', () => {
  render(<ProfileCard profile={profile} />);
  expect(screen.getByText(/Alice, 25/)).toBeInTheDocument();
});
