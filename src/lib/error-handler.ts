/**
 * Custom application error class
 */
export class AppError extends Error {
  public readonly code: string;
  public readonly context?: string;

  constructor(message: string, code: string, context?: string) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.context = context;
  }

  /**
   * Get user-friendly error message
   */
  getUserMessage(): string {
    const errorMessages: Record<string, string> = {
      'DATABASE_ERROR': 'Database operation failed. Please try again.',
      'AUTH_ERROR': 'Authentication failed. Please check your credentials.',
      'VALIDATION_ERROR': 'Invalid input. Please check your data.',
      'NETWORK_ERROR': 'Connection failed. Please check your internet.',
      'PERMISSION_ERROR': 'Access denied. You do not have permission.',
      'NOT_FOUND': 'The requested resource was not found.'
    };

    return errorMessages[this.code] || this.message;
  }
}

/**
 * Error types for different contexts
 */
export type ErrorType = 
  | 'database'
  | 'auth'
  | 'validation'
  | 'network'
  | 'permission'
  | 'not_found';

/**
 * Centralized error handler
 */
export class ErrorHandler {
  private static logLevel: 'error' | 'warn' | 'info' = 'error';

  /**
   * Set log level (useful for development vs production)
   */
  static setLogLevel(level: 'error' | 'warn' | 'info'): void {
    this.logLevel = level;
  }

  /**
   * Handle database errors with logging
   */
  static handleDatabaseError(error: any, context: string): never {
    this.log(`[${context}] Database error:`, error);
    throw new AppError(
      `Database operation failed: ${error?.message || 'Unknown error'}`,
      'DATABASE_ERROR',
      context
    );
  }

  /**
   * Handle authentication errors with logging
   */
  static handleAuthError(error: any, context: string): never {
    this.log(`[${context}] Auth error:`, error);
    throw new AppError(
      `Authentication failed: ${error?.message || 'Unknown error'}`,
      'AUTH_ERROR',
      context
    );
  }

  /**
   * Handle validation errors with logging
   */
  static handleValidationError(message: string, context: string): never {
    this.log(`[${context}] Validation error:`, message);
    throw new AppError(
      message,
      'VALIDATION_ERROR',
      context
    );
  }

  /**
   * Handle network errors with logging
   */
  static handleNetworkError(error: any, context: string): never {
    this.log(`[${context}] Network error:`, error);
    throw new AppError(
      `Connection failed: ${error?.message || 'Unknown error'}`,
      'NETWORK_ERROR',
      context
    );
  }

  /**
   * Handle general errors with logging
   */
  static handleError(error: any, type: ErrorType, context: string): never {
    this.log(`[${context}] ${type} error:`, error);
    throw new AppError(
      error?.message || 'Unknown error',
      type.toUpperCase(),
      context
    );
  }

  /**
   * Centralized logging with context and level filtering
   */
  private static log(context: string, data: any, level: 'error' | 'warn' | 'info' = 'error'): void {
    const shouldLog = level === 'error' || 
                      (level === 'warn' && ['error', 'warn'].includes(this.logLevel)) ||
                      (level === 'info' && this.logLevel === 'info');

    if (shouldLog) {
      const timestamp = new Date().toISOString();
      const logMessage = `[${timestamp}] ${context}: ${JSON.stringify(data)}`;
      
      if (level === 'error') {
        console.error(logMessage);
      } else if (level === 'warn') {
        console.warn(logMessage);
      } else {
        console.log(logMessage);
      }
    }
  }

  /**
   * Log user-friendly error for UI display
   */
  static logUserFriendlyError(error: Error): void {
    if (error instanceof AppError) {
      this.log('UI_DISPLAY', {
        message: error.getUserMessage(),
        code: error.code,
        context: error.context
      }, 'error');
    } else {
      this.log('UI_DISPLAY', {
        message: error.message,
        type: 'unknown'
      }, 'error');
    }
  }
}

/**
 * Result type for better error handling
 */
export type Result<T, E = Error> = 
  | { success: true; data: T }
  | { success: false; error: E };

/**
 * Create successful result
 */
export const createSuccess = <T>(data: T): Result<T, never> => ({
  success: true,
  data
});

/**
 * Create error result
 */
export const createFailure = <E extends Error>(error: E): Result<never, E> => ({
  success: false,
  error
});