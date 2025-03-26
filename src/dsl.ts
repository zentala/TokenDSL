import { ApiDefinition, DefineApi } from './types';

// Main DSL function that validates and processes API definitions
export const defineApi: DefineApi = (api: ApiDefinition): ApiDefinition => {
  // Validate route format (METHOD /path/:param)
  for (const [route, def] of Object.entries(api)) {
    if (!/^(GET|POST|PUT|DELETE|PATCH)\s+\/[a-zA-Z0-9\/:]+$/.test(route)) {
      throw new Error(`Invalid route format: ${route}. Expected format: METHOD /path/:param`);
    }

    // Validate required fields
    if (!def.handler) {
      throw new Error(`Missing handler for route: ${route}`);
    }
    if (!def.description) {
      throw new Error(`Missing description for route: ${route}`);
    }

    // Validate UI schema if present
    if (def.uiSchema) {
      if (!def.uiSchema.layout) {
        throw new Error(`Missing layout in UI schema for route: ${route}`);
      }
      if (!def.uiSchema.fields) {
        throw new Error(`Missing fields in UI schema for route: ${route}`);
      }
    }
  }

  return api;
}; 