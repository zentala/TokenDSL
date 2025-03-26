import express, { Request, Response } from 'express';
import { ApiDefinition } from './types';
import { ZodError } from 'zod';

export function applyApi(app: express.Application, api: ApiDefinition): void {
  for (const [route, def] of Object.entries(api)) {
    const [method, path] = route.split(' ');
    const handler = def.handler;
    const inputSchema = def.input;

    // Create Express route handler
    app[method.toLowerCase()](path, async (req: Request, res: Response) => {
      try {
        // Validate input if schema is provided
        let input = {};
        if (inputSchema) {
          input = inputSchema.parse(req.body);
        }

        // Execute handler
        const result = await handler(input, req);
        res.json(result);
      } catch (error) {
        // Handle validation errors
        if (error instanceof ZodError) {
          res.status(400).json({
            error: 'Validation failed',
            details: error.errors
          });
          return;
        }

        // Handle other errors
        const err = error as Error;
        console.error(`Error in ${route}:`, err);
        res.status(500).json({
          error: 'Internal server error',
          message: err.message
        });
      }
    });
  }
} 