import { defineApi } from '../dsl';
import { z } from 'zod';

describe('DSL Validation', () => {
  it('should validate basic API definition', () => {
    const api = defineApi({
      'GET /test': {
        handler: async () => ({ message: 'test' }),
        description: 'Test endpoint',
        tags: ['test']
      }
    });

    expect(api).toBeDefined();
    expect(api['GET /test']).toBeDefined();
    expect(api['GET /test'].handler).toBeDefined();
    expect(api['GET /test'].description).toBe('Test endpoint');
    expect(api['GET /test'].tags).toEqual(['test']);
  });

  it('should validate input schema', () => {
    const TestSchema = z.object({
      name: z.string(),
      age: z.number()
    });

    const api = defineApi({
      'POST /test': {
        input: TestSchema,
        handler: async (input) => ({ ...input }),
        description: 'Test endpoint with input',
        tags: ['test']
      }
    });

    expect(api['POST /test'].input).toBeDefined();
    expect(api['POST /test'].input).toBe(TestSchema);
  });

  it('should validate path parameters', () => {
    const api = defineApi({
      'GET /test/:id': {
        input: z.object({ id: z.string() }),
        handler: async (input) => ({ id: input.id }),
        description: 'Test endpoint with path parameter',
        tags: ['test']
      }
    });

    const endpoint = api['GET /test/:id'];
    expect(endpoint).toBeDefined();
    expect(endpoint.input).toBeDefined();
    const inputSchema = endpoint.input as z.ZodObject<any>;
    expect(inputSchema.shape.id).toBeDefined();
  });

  it('should validate query parameters', () => {
    const api = defineApi({
      'GET /test': {
        input: z.object({
          page: z.string().optional(),
          limit: z.string().optional()
        }),
        handler: async (input) => ({ ...input }),
        description: 'Test endpoint with query parameters',
        tags: ['test']
      }
    });

    const endpoint = api['GET /test'];
    expect(endpoint).toBeDefined();
    expect(endpoint.input).toBeDefined();
    const inputSchema = endpoint.input as z.ZodObject<any>;
    expect(inputSchema.shape.page).toBeDefined();
    expect(inputSchema.shape.limit).toBeDefined();
  });
}); 