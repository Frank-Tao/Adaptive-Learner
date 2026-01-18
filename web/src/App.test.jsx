import { render, screen } from '@testing-library/react';
import App from './App.jsx';

test('renders adaptive learning hero headline', () => {
  render(<App />);
  expect(
    screen.getByRole('heading', { name: /designing the next moment of learning/i })
  ).toBeInTheDocument();
});

test('renders moment card with choices', () => {
  render(<App />);
  expect(screen.getByText(/adaptive note/i)).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: /explain a concept in your own words/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /apply to my work/i })).toBeInTheDocument();
});
