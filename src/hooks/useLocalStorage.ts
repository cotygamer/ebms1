import { useState, useEffect } from 'react';

/**
 * Custom hook for managing localStorage with TypeScript support
 * @param key - Storage key
 * @param initialValue - Initial value if key doesn't exist
 * @returns [value, setValue, removeValue]
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void, () => void] {
  // Get value from localStorage or use initial value
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Update localStorage when state changes
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  // Remove value from localStorage
  const removeValue = () => {
    try {
      window.localStorage.removeItem(key);
      setStoredValue(initialValue);
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue, removeValue];
}

/**
 * Hook for managing session storage
 * @param key - Storage key
 * @param initialValue - Initial value if key doesn't exist
 * @returns [value, setValue, removeValue]
 */
export function useSessionStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void, () => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.sessionStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading sessionStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.sessionStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting sessionStorage key "${key}":`, error);
    }
  };

  const removeValue = () => {
    try {
      window.sessionStorage.removeItem(key);
      setStoredValue(initialValue);
    } catch (error) {
      console.error(`Error removing sessionStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue, removeValue];
}

/**
 * Hook for managing form data with localStorage persistence
 * @param key - Storage key for form data
 * @param initialData - Initial form data
 * @returns Form management utilities
 */
export function usePersistedForm<T extends Record<string, any>>(
  key: string,
  initialData: T
) {
  const [formData, setFormData] = useLocalStorage(key, initialData);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [isDirty, setIsDirty] = useState(false);

  const updateField = (field: keyof T, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setIsDirty(true);
    
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const setFieldError = (field: keyof T, error: string) => {
    setErrors(prev => ({ ...prev, [field]: error }));
  };

  const clearErrors = () => {
    setErrors({});
  };

  const resetForm = () => {
    setFormData(initialData);
    setErrors({});
    setIsDirty(false);
  };

  const clearPersistedData = () => {
    window.localStorage.removeItem(key);
    resetForm();
  };

  return {
    formData,
    setFormData,
    updateField,
    errors,
    setFieldError,
    clearErrors,
    isDirty,
    resetForm,
    clearPersistedData
  };
}