// Core Types
export type ID = string;
export type Timestamp = number;
export type UUID = string;

// Base Entity
export interface BaseEntity {
  id: ID;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// User Types
export interface User extends BaseEntity {
  email: string;
  username: string;
  password: string;
  role: UserRole;
  isActive: boolean;
}

export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
  GUEST = 'GUEST'
}

// Post Types
export interface Post extends BaseEntity {
  title: string;
  content: string;
  authorId: ID;
  category: PostCategory;
  tags: string[];
  status: PostStatus;
}

export enum PostCategory {
  NEWS = 'NEWS',
  TUTORIAL = 'TUTORIAL',
  DISCUSSION = 'DISCUSSION',
  ANNOUNCEMENT = 'ANNOUNCEMENT'
}

export enum PostStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED'
}

// Comment Types
export interface Comment extends BaseEntity {
  content: string;
  authorId: ID;
  postId: ID;
  parentId?: ID;
  status: CommentStatus;
}

export enum CommentStatus {
  ACTIVE = 'ACTIVE',
  HIDDEN = 'HIDDEN',
  DELETED = 'DELETED'
}

// Event Types
export interface Event {
  id: ID;
  type: string;
  timestamp: Timestamp;
  data: unknown;
  metadata: EventMetadata;
}

export interface EventMetadata {
  userId?: ID;
  sessionId?: string;
  ip?: string;
  userAgent?: string;
}

// Command Types
export interface Command {
  id: ID;
  type: string;
  timestamp: Timestamp;
  data: unknown;
  metadata: CommandMetadata;
}

export interface CommandMetadata {
  userId?: ID;
  sessionId?: string;
  ip?: string;
  userAgent?: string;
}

// Query Types
export interface Query {
  id: ID;
  type: string;
  timestamp: Timestamp;
  data: unknown;
  metadata: QueryMetadata;
}

export interface QueryMetadata {
  userId?: ID;
  sessionId?: string;
  ip?: string;
  userAgent?: string;
}

// Repository Types
export interface Repository<T extends BaseEntity> {
  findById(id: ID): Promise<T | null>;
  findAll(): Promise<T[]>;
  create(entity: Omit<T, keyof BaseEntity>): Promise<T>;
  update(id: ID, entity: Partial<T>): Promise<T>;
  delete(id: ID): Promise<void>;
}

// Service Types
export interface Service<T extends BaseEntity> {
  getById(id: ID): Promise<T>;
  getAll(): Promise<T[]>;
  create(data: Omit<T, keyof BaseEntity>): Promise<T>;
  update(id: ID, data: Partial<T>): Promise<T>;
  delete(id: ID): Promise<void>;
}

// Event Handler Types
export interface EventHandler<T extends Event> {
  handle(event: T): Promise<void>;
}

// Command Handler Types
export interface CommandHandler<T extends Command> {
  handle(command: T): Promise<void>;
}

// Query Handler Types
export interface QueryHandler<T extends Query> {
  handle(query: T): Promise<unknown>;
}

// Validation Types
export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

// API Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
}

export interface ApiError {
  code: string;
  message: string;
  details?: unknown;
}

// UI Types
export interface UiComponent {
  id: string;
  type: string;
  props: Record<string, unknown>;
  children?: UiComponent[];
}

export interface UiForm {
  id: string;
  fields: UiFormField[];
  validation?: Record<string, unknown>;
}

export interface UiFormField {
  name: string;
  type: string;
  label: string;
  required?: boolean;
  validation?: Record<string, unknown>;
}

// DSL Types
export interface DslNode {
  type: string;
  children?: DslNode[];
  value?: unknown;
}

export interface DslToken {
  type: string;
  value: string;
  line: number;
  column: number;
}

export interface DslContext {
  variables: Record<string, unknown>;
  functions: Record<string, Function>;
}

// Security Types
export interface Token {
  id: ID;
  userId: ID;
  type: TokenType;
  expiresAt: Timestamp;
  createdAt: Timestamp;
}

export enum TokenType {
  ACCESS = 'ACCESS',
  REFRESH = 'REFRESH',
  RESET = 'RESET'
}

export interface AuthCredentials {
  email: string;
  password: string;
}

// Monitoring Types
export interface Metric {
  name: string;
  value: number;
  timestamp: Timestamp;
  tags?: Record<string, string>;
}

export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: Timestamp;
  context?: Record<string, unknown>;
}

export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR'
}

// Error Types
export interface AppError extends Error {
  code: string;
  status: number;
  details?: unknown;
}

export enum ErrorCode {
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  NOT_FOUND = 'NOT_FOUND',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  INTERNAL_ERROR = 'INTERNAL_ERROR'
}

// Configuration Types
export interface AppConfig {
  port: number;
  environment: Environment;
  database: DatabaseConfig;
  jwt: JwtConfig;
  cors: CorsConfig;
}

export enum Environment {
  DEVELOPMENT = 'development',
  TESTING = 'testing',
  PRODUCTION = 'production'
}

export interface DatabaseConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
}

export interface JwtConfig {
  secret: string;
  expiresIn: string;
  refreshExpiresIn: string;
}

export interface CorsConfig {
  origin: string[];
  methods: string[];
  allowedHeaders: string[];
  credentials: boolean;
} 