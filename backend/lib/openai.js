const OPENAI_URL = 'https://api.openai.com/v1/chat/completions';

export async function createChatCompletion({ apiKey, model, messages, temperature = 0.2 }) {
  if (!apiKey) {
    throw new Error('Missing OPENAI_API_KEY');
  }

  const response = await fetch(OPENAI_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model,
      messages,
      temperature
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenAI error: ${response.status} ${errorText}`);
  }

  return response.json();
}
