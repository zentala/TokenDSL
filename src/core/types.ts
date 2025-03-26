/**
 * Core type definitions for TokenDSL
 */

import { z } from 'zod';

// Basic types
export type ID = string;
export type Timestamp = number;

// Schema types
export type Schema = z.ZodType<any, any>;
export type SchemaDefinition = Record<string, Schema>;

// API types
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
export type HttpStatus = number;

export interface ApiEndpoint {
  method: HttpMethod;
  path: string;
  handler: (req: Request, res: Response) => Promise<void>;
  schema?: SchemaDefinition;
  description?: string;
  tags?: string[];
  responses?: Record<HttpStatus, Schema>;
}

// DSL types
export interface DslModule {
  name: string;
  version: string;
  description?: string;
  endpoints: ApiEndpoint[];
  schemas: SchemaDefinition;
  ui?: UiSchema;
}

export interface UiSchema {
  forms: Record<string, FormSchema>;
  pages: Record<string, PageSchema>;
  components: Record<string, ComponentSchema>;
}

export interface FormSchema {
  fields: Record<string, FieldSchema>;
  layout: LayoutSchema;
  validation?: Schema;
}

export interface PageSchema {
  title: string;
  layout: LayoutSchema;
  components: string[];
}

export interface ComponentSchema {
  type: string;
  props: Record<string, any>;
  children?: ComponentSchema[];
}

export interface FieldSchema {
  type: string;
  label: string;
  placeholder?: string;
  validation?: Schema;
  options?: Record<string, any>;
}

export interface LayoutSchema {
  type: 'grid' | 'flex' | 'stack';
  props: Record<string, any>;
  children: LayoutSchema[];
}

// Storage types
export interface Storage {
  create<T>(collection: string, data: T): Promise<T>;
  read<T>(collection: string, id: ID): Promise<T>;
  update<T>(collection: string, id: ID, data: Partial<T>): Promise<T>;
  delete(collection: string, id: ID): Promise<void>;
  list<T>(collection: string): Promise<T[]>;
}

// Error types
export class DslError extends Error {
  constructor(
    message: string,
    public code: string,
    public details?: Record<string, any>
  ) {
    super(message);
    this.name = 'DslError';
  }
}

// Request/Response types
export interface Request {
  method: HttpMethod;
  path: string;
  params: Record<string, string>;
  query: Record<string, string>;
  body: any;
  headers: Record<string, string>;
}

export interface Response {
  status: HttpStatus;
  body: any;
  headers: Record<string, string>;
} 