import { Express } from 'express';
import { ApiDefinition } from '../shared/types/TYPES';

export function applyApi(app: Express, api: ApiDefinition): void {
  for (const [route, def] of Object.entries(api)) {
    const [method, path] = route.split(' ');
    const handler = typeof def === 'function' ? def : def.handler;
    const inputSchema = def.input ?? null;

    app[method.toLowerCase()](path, async (req, res) => {
      try {
        const data = inputSchema ? inputSchema.parse(req.body) : {};
        const result = await handler(data, req);
        res.json(result);
      } catch (err) {
        res.status(400).json({ error: err.message });
      }
    });
  }
} 