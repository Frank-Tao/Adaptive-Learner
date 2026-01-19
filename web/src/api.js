export const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export async function postEvent(event) {
  return requestJson('/events', {
    method: 'POST',
    body: JSON.stringify(event)
  });
}

export async function getNextMoment({ session_id, user_id }) {
  return requestJson('/next-moment', {
    method: 'POST',
    body: JSON.stringify({ session_id, user_id })
  });
}

async function requestJson(path, options) {
  const response = await fetch(`${apiBaseUrl}${path}`, {
    headers: {
      'Content-Type': 'application/json'
    },
    ...options
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Request failed: ${response.status} ${errorText}`);
  }

  return response.json();
}
