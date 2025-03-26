import express, { Request, Response } from 'express';
import { ApiDefinition } from './types';
import { ZodError } from 'zod';

type HttpMethod = 'get' | 'post' | 'put' | 'delete' | 'patch';

interface ApiOptions {
  onSuccess?: (req: Request, res: Response, result: any) => void;
  onError?: (req: Request, res: Response, error: Error) => void;
}

export function applyApi(app: express.Application, api: ApiDefinition, options: ApiOptions = {}): void {
  const { onSuccess, onError } = options;

  for (const [route, def] of Object.entries(api)) {
    const [method, path] = route.split(' ');
    const handler = async (req: Request, res: Response) => {
      try {
        let input = {};
        
        // Parse path parameters
        const pathParams = path.match(/:(\w+)/g) || [];
        for (const param of pathParams) {
          const key = param.slice(1);
          input = { ...input, [key]: req.params[key] };
        }

        // Parse query parameters
        input = { ...input, ...req.query };

        // Parse body for POST/PUT
        if (method === 'POST' || method === 'PUT') {
          input = { ...input, ...req.body };
        }

        // Validate input if schema is provided
        if (def.input) {
          input = def.input.parse(input);
        }

        // Call handler
        const result = await def.handler(input, req);

        // Send response
        if (onSuccess) {
          onSuccess(req, res, result);
        } else {
          res.json(result);
        }
      } catch (error) {
        if (onError) {
          onError(req, res, error as Error);
        } else {
          res.status(400).json({ error: (error as Error).message });
        }
      }
    };

    app[method.toLowerCase()](path, handler);
  }
}
