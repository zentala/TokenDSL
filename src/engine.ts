import { Application, Request, Response } from 'express';
import { z } from 'zod';

export type ApiOptions = {
  onSuccess?: (req: Request, res: Response, data: any) => void;
  onError?: (req: Request, res: Response, error: any) => void;
};

export type ApiEndpoint<T = any> = {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  description?: string;
  tags?: string[];
  input?: z.ZodType<T>;
  handler: (data: T, req: Request, res: Response) => Promise<any>;
  uiSchema?: Record<string, any>;
  examples?: {
    input?: Record<string, any>;
    output?: Record<string, any>;
  };
};

export type Api = {
  endpoints: ApiEndpoint[];
  options?: ApiOptions;
};

export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NotFoundError';
  }
}

export function defineApi(api: Api): Api {
  return api;
}

export function applyApi(app: Application, api: Api) {
  api.endpoints.forEach((endpoint) => {
    const { method, path, input, handler } = endpoint;
    const wrappedHandler = async (req: Request, res: Response) => {
      try {
        // Parse path and query parameters
        const params = { ...req.params, ...req.query };
        
        // Validate input if schema is provided
        let data = req.method === 'GET' ? params : req.body;
        if (input) {
          data = input.parse(data);
        }

        // Call handler with validated data
        const result = await handler(data, req, res);

        // Call success handler if provided
        if (api.options?.onSuccess) {
          api.options.onSuccess(req, res, result);
        } else {
          // Default success response
          if (req.method === 'POST') {
            res.status(201).json(result);
          } else {
            res.json(result);
          }
        }
      } catch (err: unknown) {
        // Call error handler if provided
        if (api.options?.onError) {
          api.options.onError(req, res, err);
        } else {
          // Default error response
          if (err instanceof z.ZodError) {
            res.status(400).json({ error: err.errors });
          } else if (err instanceof NotFoundError || (err instanceof Error && err.message === 'User not found')) {
            res.status(404).json({ error: err.message });
          } else {
            res.status(500).json({ error: 'Internal server error' });
          }
        }
      }
    };

    const methodName = method.toLowerCase() as 'get' | 'post' | 'put' | 'delete';
    app[methodName](path, wrappedHandler);
  });
}
