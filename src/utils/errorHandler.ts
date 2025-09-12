// Centralized error handling utilities

export interface AppError {
  code: string;
  message: string;
  details?: any;
  timestamp: string;
}

export class BarangaySystemError extends Error {
  public code: string;
  public details?: any;
  public timestamp: string;

  constructor(code: string, message: string, details?: any) {
    super(message);
    this.name = 'BarangaySystemError';
    this.code = code;
    this.details = details;
    this.timestamp = new Date().toISOString();
  }
}

/**
 * Handle and log application errors
 * @param error - Error object
 * @param context - Context where error occurred
 * @returns Formatted error for user display
 */
export const handleError = (error: any, context: string): AppError => {
  const timestamp = new Date().toISOString();
  
  // Log error for debugging
  console.error(`[${timestamp}] Error in ${context}:`, error);
  
  // Create standardized error object
  const appError: AppError = {
    code: error.code || 'UNKNOWN_ERROR',
    message: error.message || 'An unexpected error occurred',
    details: error.details || error,
    timestamp
  };
  
  // Store error in local storage for debugging (in development)
  if (process.env.NODE_ENV === 'development') {
    const errorLog = JSON.parse(localStorage.getItem('errorLog') || '[]');
    errorLog.push({ ...appError, context });
    localStorage.setItem('errorLog', JSON.stringify(errorLog.slice(-50))); // Keep last 50 errors
  }
  
  return appError;
};

/**
 * Handle API errors specifically
 * @param error - API error response
 * @param operation - API operation that failed
 * @returns User-friendly error message
 */
export const handleApiError = (error: any, operation: string): string => {
  if (error.response) {
    // Server responded with error status
    switch (error.response.status) {
      case 400:
        return 'Invalid request. Please check your input and try again.';
      case 401:
        return 'You are not authorized to perform this action. Please log in again.';
      case 403:
        return 'You do not have permission to perform this action.';
      case 404:
        return 'The requested resource was not found.';
      case 409:
        return 'This action conflicts with existing data. Please refresh and try again.';
      case 422:
        return 'The provided data is invalid. Please check your input.';
      case 500:
        return 'Server error occurred. Please try again later.';
      default:
        return `An error occurred during ${operation}. Please try again.`;
    }
  } else if (error.request) {
    // Network error
    return 'Network error. Please check your internet connection and try again.';
  } else {
    // Other error
    return `An unexpected error occurred during ${operation}. Please try again.`;
  }
};

/**
 * Validate form data and return errors
 * @param data - Form data object
 * @param rules - Validation rules
 * @returns Validation errors
 */
export const validateFormData = (data: any, rules: any): { [key: string]: string } => {
  const errors: { [key: string]: string } = {};
  
  Object.keys(rules).forEach(field => {
    const rule = rules[field];
    const value = data[field];
    
    if (rule.required && (!value || value.toString().trim() === '')) {
      errors[field] = `${rule.label || field} is required`;
      return;
    }
    
    if (value && rule.minLength && value.toString().length < rule.minLength) {
      errors[field] = `${rule.label || field} must be at least ${rule.minLength} characters`;
      return;
    }
    
    if (value && rule.maxLength && value.toString().length > rule.maxLength) {
      errors[field] = `${rule.label || field} must not exceed ${rule.maxLength} characters`;
      return;
    }
    
    if (value && rule.pattern && !rule.pattern.test(value)) {
      errors[field] = rule.message || `${rule.label || field} format is invalid`;
      return;
    }
    
    if (value && rule.custom && !rule.custom(value)) {
      errors[field] = rule.message || `${rule.label || field} is invalid`;
      return;
    }
  });
  
  return errors;
};

/**
 * Retry failed operations with exponential backoff
 * @param operation - Function to retry
 * @param maxRetries - Maximum number of retries
 * @param baseDelay - Base delay in milliseconds
 * @returns Promise that resolves when operation succeeds or max retries reached
 */
export const retryOperation = async <T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> => {
  let lastError: any;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      
      if (attempt === maxRetries) {
        throw new BarangaySystemError(
          'MAX_RETRIES_EXCEEDED',
          `Operation failed after ${maxRetries} attempts`,
          { originalError: error, attempts: attempt + 1 }
        );
      }
      
      // Exponential backoff
      const delay = baseDelay * Math.pow(2, attempt);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError;
};

/**
 * Safe async operation wrapper
 * @param operation - Async operation to execute
 * @param context - Context for error logging
 * @returns Result or error
 */
export const safeAsync = async <T>(
  operation: () => Promise<T>,
  context: string
): Promise<{ success: boolean; data?: T; error?: AppError }> => {
  try {
    const data = await operation();
    return { success: true, data };
  } catch (error) {
    const appError = handleError(error, context);
    return { success: false, error: appError };
  }
};

/**
 * Debounce function for search and input operations
 * @param func - Function to debounce
 * @param wait - Wait time in milliseconds
 * @returns Debounced function
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

/**
 * Format error message for user display
 * @param error - Error object
 * @returns User-friendly error message
 */
export const formatErrorMessage = (error: any): string => {
  if (error instanceof BarangaySystemError) {
    return error.message;
  }
  
  if (typeof error === 'string') {
    return error;
  }
  
  if (error?.message) {
    return error.message;
  }
  
  return 'An unexpected error occurred. Please try again.';
};