import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import App from './App.jsx';

function mockFetchSequence(responses) {
  const queue = [...responses];
  global.fetch = vi.fn(async () => {
    const responseBody = queue.shift() ?? {};
    return {
      ok: true,
      json: async () => responseBody
    };
  });
}

test('renders adaptive learning hero headline', () => {
  render(<App />);
  expect(
    screen.getByRole('heading', { name: /designing the next moment of learning/i })
  ).toBeInTheDocument();
});

test('renders session start flow', () => {
  render(<App />);
  expect(screen.getByRole('heading', { name: /session start/i })).toBeInTheDocument();
});

test('renders moment card after start', async () => {
  mockFetchSequence([
    { ok: true },
    {
      state: 'success',
      certainty: 'medium',
      explanation: 'State: success (medium) based on performance_stable.',
      response: {
        title: 'Mock title',
        prompt: 'Mock prompt',
        choice_labels: ['Choice A', 'Choice B']
      },
      alternatives: ['Choice A', 'Choice B']
    }
  ]);

  render(<App />);
  fireEvent.click(screen.getByRole('button', { name: /start/i }));
  expect(await screen.findByText(/adaptive note/i)).toBeInTheDocument();
  expect(await screen.findByRole('heading', { name: /mock title/i })).toBeInTheDocument();
});
