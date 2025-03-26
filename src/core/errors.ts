/**
 * Error handling system for TokenDSL
 */

import { DslError } from './types';

// Error codes
export enum ErrorCode {
  // Parser errors
  PARSER_SYNTAX_ERROR = 'PARSER_SYNTAX_ERROR',
  PARSER_INVALID_TOKEN = 'PARSER_INVALID_TOKEN',
  PARSER_UNEXPECTED_EOF = 'PARSER_UNEXPECTED_EOF',
  
  // Validator errors
  VALIDATOR_TYPE_ERROR = 'VALIDATOR_TYPE_ERROR',
  VALIDATOR_SCHEMA_ERROR = 'VALIDATOR_SCHEMA_ERROR',
  VALIDATOR_DEPENDENCY_ERROR = 'VALIDATOR_DEPENDENCY_ERROR',
  
  // Generator errors
  GENERATOR_TEMPLATE_ERROR = 'GENERATOR_TEMPLATE_ERROR',
  GENERATOR_OUTPUT_ERROR = 'GENERATOR_OUTPUT_ERROR',
  
  // Runtime errors
  RUNTIME_EXECUTION_ERROR = 'RUNTIME_EXECUTION_ERROR',
  RUNTIME_CONTEXT_ERROR = 'RUNTIME_CONTEXT_ERROR',
  
  // API errors
  API_VALIDATION_ERROR = 'API_VALIDATION_ERROR',
  API_NOT_FOUND = 'API_NOT_FOUND',
  API_METHOD_NOT_ALLOWED = 'API_METHOD_NOT_ALLOWED',
  API_UNAUTHORIZED = 'API_UNAUTHORIZED',
  API_FORBIDDEN = 'API_FORBIDDEN',
  
  // Storage errors
  STORAGE_CONNECTION_ERROR = 'STORAGE_CONNECTION_ERROR',
  STORAGE_QUERY_ERROR = 'STORAGE_QUERY_ERROR',
  STORAGE_NOT_FOUND = 'STORAGE_NOT_FOUND',
  
  // UI errors
  UI_RENDER_ERROR = 'UI_RENDER_ERROR',
  UI_COMPONENT_ERROR = 'UI_COMPONENT_ERROR',
}

// Error messages
export const ErrorMessages = {
  [ErrorCode.PARSER_SYNTAX_ERROR]: 'Syntax error in DSL file',
  [ErrorCode.PARSER_INVALID_TOKEN]: 'Invalid token in DSL file',
  [ErrorCode.PARSER_UNEXPECTED_EOF]: 'Unexpected end of file',
  
  [ErrorCode.VALIDATOR_TYPE_ERROR]: 'Type validation error',
  [ErrorCode.VALIDATOR_SCHEMA_ERROR]: 'Schema validation error',
  [ErrorCode.VALIDATOR_DEPENDENCY_ERROR]: 'Dependency validation error',
  
  [ErrorCode.GENERATOR_TEMPLATE_ERROR]: 'Template generation error',
  [ErrorCode.GENERATOR_OUTPUT_ERROR]: 'Output generation error',
  
  [ErrorCode.RUNTIME_EXECUTION_ERROR]: 'Runtime execution error',
  [ErrorCode.RUNTIME_CONTEXT_ERROR]: 'Runtime context error',
  
  [ErrorCode.API_VALIDATION_ERROR]: 'API validation error',
  [ErrorCode.API_NOT_FOUND]: 'API endpoint not found',
  [ErrorCode.API_METHOD_NOT_ALLOWED]: 'Method not allowed',
  [ErrorCode.API_UNAUTHORIZED]: 'Unauthorized access',
  [ErrorCode.API_FORBIDDEN]: 'Access forbidden',
  
  [ErrorCode.STORAGE_CONNECTION_ERROR]: 'Storage connection error',
  [ErrorCode.STORAGE_QUERY_ERROR]: 'Storage query error',
  [ErrorCode.STORAGE_NOT_FOUND]: 'Resource not found in storage',
  
  [ErrorCode.UI_RENDER_ERROR]: 'UI rendering error',
  [ErrorCode.UI_COMPONENT_ERROR]: 'UI component error',
};

// Error factory
export class ErrorFactory {
  static create(code: ErrorCode, message?: string, details?: Record<string, any>): DslError {
    return new DslError(
      message || ErrorMessages[code],
      code,
      details
    );
  }
  
  // Parser errors
  static parserError(code: ErrorCode, details?: Record<string, any>): DslError {
    return this.create(code, undefined, details);
  }
  
  // Validator errors
  static validatorError(code: ErrorCode, details?: Record<string, any>): DslError {
    return this.create(code, undefined, details);
  }
  
  // Generator errors
  static generatorError(code: ErrorCode, details?: Record<string, any>): DslError {
    return this.create(code, undefined, details);
  }
  
  // Runtime errors
  static runtimeError(code: ErrorCode, details?: Record<string, any>): DslError {
    return this.create(code, undefined, details);
  }
  
  // API errors
  static apiError(code: ErrorCode, details?: Record<string, any>): DslError {
    return this.create(code, undefined, details);
  }
  
  // Storage errors
  static storageError(code: ErrorCode, details?: Record<string, any>): DslError {
    return this.create(code, undefined, details);
  }
  
  // UI errors
  static uiError(code: ErrorCode, details?: Record<string, any>): DslError {
    return this.create(code, undefined, details);
  }
}

// Error handler
export class ErrorHandler {
  static handle(error: DslError): void {
    // Log error
    console.error(`[${error.code}] ${error.message}`, error.details);
    
    // Handle based on error code
    switch (error.code) {
      case ErrorCode.API_UNAUTHORIZED:
      case ErrorCode.API_FORBIDDEN:
        // Handle authentication errors
        break;
        
      case ErrorCode.STORAGE_CONNECTION_ERROR:
        // Handle storage connection errors
        break;
        
      case ErrorCode.UI_RENDER_ERROR:
        // Handle UI rendering errors
        break;
        
      default:
        // Handle other errors
        break;
    }
  }
} 