import { z } from 'zod';

// UI Schema types
export interface UISchemaField {
  type: string;
  label: string;
  display?: 'readonly' | 'editable';
  validation?: Record<string, any>;
}

export interface UISchema {
  layout: 'form' | 'card' | 'table';
  fields: Record<string, UISchemaField>;
}

// API Definition types
export interface ApiEndpointDefinition<TInput = any, TOutput = any> {
  input?: z.ZodType<TInput>;
  handler: (input: TInput, req: any) => Promise<TOutput>;
  description: string;
  tags?: string[];
  exampleInput?: TInput;
  exampleOutput?: TOutput;
  commitHint?: string;
  uiSchema?: UISchema;
}

export interface ApiDefinition {
  [route: string]: ApiEndpointDefinition;
}

// DSL function type
export type DefineApi = (api: ApiDefinition) => ApiDefinition; 