import { render, screen } from '@testing-library/react';
import App from './App.jsx';

test('renders adaptive learning hero headline', () => {
  render(<App />);
  expect(
    screen.getByRole('heading', { name: /designing the next moment of learning/i })
  ).toBeInTheDocument();
});
