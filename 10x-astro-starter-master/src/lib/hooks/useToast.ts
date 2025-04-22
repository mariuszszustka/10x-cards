import { useState, useCallback } from 'react';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastProps {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

/**
 * Hook do zarządzania systemem powiadomień (toastów)
 */
export default function useToast() {
  const [toasts, setToasts] = useState<ToastProps[]>([]);
  
  /**
   * Dodanie nowego powiadomienia
   */
  const addToast = useCallback((message: string, type: ToastType = 'info', duration: number = 5000) => {
    const id = `toast-${Date.now()}`;
    const newToast = { id, message, type, duration };
    
    setToasts(prev => [...prev, newToast]);
    
    // Automatyczne usuwanie po określonym czasie
    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
    
    return id;
  }, []);
  
  /**
   * Usunięcie powiadomienia po ID
   */
  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);
  
  /**
   * Dodanie powiadomienia o sukcesie
   */
  const success = useCallback((message: string, duration?: number) => {
    return addToast(message, 'success', duration);
  }, [addToast]);
  
  /**
   * Dodanie powiadomienia o błędzie
   */
  const error = useCallback((message: string, duration?: number) => {
    return addToast(message, 'error', duration);
  }, [addToast]);
  
  /**
   * Dodanie powiadomienia informacyjnego
   */
  const info = useCallback((message: string, duration?: number) => {
    return addToast(message, 'info', duration);
  }, [addToast]);
  
  /**
   * Usunięcie wszystkich powiadomień
   */
  const clearAll = useCallback(() => {
    setToasts([]);
  }, []);
  
  return {
    toasts,
    addToast,
    removeToast,
    success,
    error,
    info,
    clearAll
  };
} 