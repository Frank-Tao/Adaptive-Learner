import Fastify from 'fastify';
import { handler as chatgptHandler } from './handlers/chatgpt.js';
import { handler as eventsHandler } from './handlers/events.js';
import { handler as classifyHandler } from './handlers/classify.js';
import { handler as nextMomentHandler } from './handlers/next-moment.js';
import { handler as metricsHandler } from './handlers/metrics.js';
import { handler as profileHandler } from './handlers/profile.js';
import { handler as orchestrateHandler } from './handlers/orchestrate.js';
import { handler as summarizeUrlHandler } from './handlers/summarize-url.js';
import { handler as agentsHandler } from './handlers/agents.js';

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
app.post('/events', {
  schema: {
    body: {
      type: 'object',
      required: ['event_id', 'session_id', 'event_type', 'timestamp'],
      properties: {
        event_id: { type: 'string', minLength: 1 },
        session_id: { type: 'string', minLength: 1 },
        step_id: { type: 'string' },
        event_type: { type: 'string', minLength: 1 },
        timestamp: { type: 'string', minLength: 1 },
        value: {},
        metadata: { type: 'object' }
      }
    }
  },
  handler: wrapHandler(eventsHandler)
});
app.post('/classify', {
  schema: {
    body: {
      type: 'object',
      required: ['session_id'],
      properties: {
        session_id: { type: 'string', minLength: 1 }
      }
    }
  },
  handler: wrapHandler(classifyHandler)
});
app.post('/next-moment', {
  schema: {
    body: {
      type: 'object',
      required: ['session_id'],
      properties: {
        session_id: { type: 'string', minLength: 1 },
        user_id: { type: 'string' }
      }
    }
  },
  handler: wrapHandler(nextMomentHandler)
});
app.post('/profile', {
  schema: {
    body: {
      type: 'object',
      required: ['user_id'],
      properties: {
        user_id: { type: 'string', minLength: 1 },
        updates: { type: 'object' }
      }
    }
  },
  handler: wrapHandler(profileHandler)
});
app.get('/metrics', wrapHandler(metricsHandler));
app.post('/chatgpt', {
  schema: {
    body: {
      type: 'object',
      required: ['messages'],
      properties: {
        messages: { type: 'array', items: { type: 'object' } },
        temperature: { type: 'number' }
      }
    }
  },
  handler: wrapHandler(chatgptHandler)
});
app.post('/orchestrate', {
  schema: {
    body: {
      type: 'object',
      required: ['task'],
      properties: {
        task: { type: 'string', minLength: 1 },
        context: { type: ['object', 'null'] },
        available_agents: { type: 'array', items: { type: 'string' } },
        execute: { type: 'boolean' },
        agent_payload: { type: ['object', 'null'] }
      }
    }
  },
  handler: wrapHandler(orchestrateHandler)
});
app.post('/summarize-url', {
  schema: {
    body: {
      type: 'object',
      required: ['url'],
      properties: {
        url: { type: 'string', minLength: 1 },
        audience: { type: 'string' }
      }
    }
  },
  handler: wrapHandler(summarizeUrlHandler)
});
app.get('/agents', wrapHandler(agentsHandler));

const port = Number(process.env.PORT || 3000);
const host = process.env.HOST || '0.0.0.0';

try {
  await app.listen({ port, host });
} catch (error) {
  app.log.error(error);
  process.exit(1);
}
