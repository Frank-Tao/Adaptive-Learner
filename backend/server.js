import Fastify from 'fastify';
import { handler as chatgptHandler } from './handlers/chatgpt.js';
import { handler as eventsHandler } from './handlers/events.js';
import { handler as classifyHandler } from './handlers/classify.js';
import { handler as nextMomentHandler } from './handlers/next-moment.js';
import { handler as metricsHandler } from './handlers/metrics.js';
import { handler as profileHandler } from './handlers/profile.js';
import { handler as orchestrateHandler } from './handlers/orchestrate.js';
import { handler as summarizeUrlHandler } from './handlers/summarize-url.js';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type'
};

function wrapHandler(handler) {
  return async (request, reply) => {
    const event = request.body ? { body: JSON.stringify(request.body) } : {};
    const result = await handler(event);
    const statusCode = result?.statusCode ?? 200;
    const headers = result?.headers ?? {};
    let payload = result?.body ?? null;

    if (typeof payload === 'string' && payload.length) {
      try {
        payload = JSON.parse(payload);
      } catch {
        // Keep payload as string if it's not JSON.
      }
    }

    reply.code(statusCode);
    for (const [key, value] of Object.entries(headers)) {
      reply.header(key, value);
    }
    return reply.send(payload);
  };
}

const app = Fastify({ logger: true });

app.addHook('onRequest', async (request, reply) => {
  if (request.method === 'OPTIONS') {
    reply.code(204).headers(corsHeaders);
    return reply.send();
  }
});

app.addHook('onSend', async (request, reply, payload) => {
  for (const [key, value] of Object.entries(corsHeaders)) {
    if (!reply.hasHeader(key)) {
      reply.header(key, value);
    }
  }
  return payload;
});

app.get('/health', async () => ({ ok: true }));
app.post('/events', wrapHandler(eventsHandler));
app.post('/classify', wrapHandler(classifyHandler));
app.post('/next-moment', wrapHandler(nextMomentHandler));
app.post('/profile', wrapHandler(profileHandler));
app.get('/metrics', wrapHandler(metricsHandler));
app.post('/chatgpt', wrapHandler(chatgptHandler));
app.post('/orchestrate', wrapHandler(orchestrateHandler));
app.post('/summarize-url', wrapHandler(summarizeUrlHandler));

const port = Number(process.env.PORT || 3000);
const host = process.env.HOST || '0.0.0.0';

try {
  await app.listen({ port, host });
} catch (error) {
  app.log.error(error);
  process.exit(1);
}
