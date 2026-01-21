import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import BusinessApp from './apps/BusinessApp.jsx';

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

test('renders business hero headline', () => {
  render(<BusinessApp />);
  expect(
    screen.getByRole('heading', {
      name: /adaptive learning, built for enterprise workflows/i
    })
  ).toBeInTheDocument();
});

test('shows system context for enterprise entry', () => {
  render(<BusinessApp />);
  expect(screen.getByText(/system context/i)).toBeInTheDocument();
  expect(screen.getByText(/role: change manager/i)).toBeInTheDocument();
});

test('shows activity feedback after session close', async () => {
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

  render(<BusinessApp />);
  fireEvent.click(screen.getByRole('button', { name: /launch session/i }));
  expect(await screen.findByRole('heading', { name: /mock title/i })).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: /end session/i }));
  expect(
    await screen.findByText(/learning activity useful for your role/i)
  ).toBeInTheDocument();
});
