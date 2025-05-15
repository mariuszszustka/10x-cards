import { useEffect } from "react";
import type { ToastProps } from "@/lib/hooks/useToast";

interface ToastNotificationsProps {
  toasts: ToastProps[];
  removeToast: (id: string) => void;
}

/**
 * Komponent wyświetlający powiadomienia toast
 */
export default function ToastNotifications({ toasts, removeToast }: ToastNotificationsProps) {
  useEffect(() => {
    // Automatyczne usuwanie powiadomień po ich czasie trwania
    toasts.forEach((toast) => {
      if (toast.duration) {
        const timer = setTimeout(() => {
          removeToast(toast.id);
        }, toast.duration);

        return () => clearTimeout(timer);
      }
    });
  }, [toasts, removeToast]);

  if (toasts.length === 0) {
    return null;
  }

  // Ikony dla różnych typów powiadomień
  const getIcon = (type: ToastProps["type"]) => {
    switch (type) {
      case "success":
        return (
          <svg
            className="w-5 h-5 text-green-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
        );
      case "error":
        return (
          <svg
            className="w-5 h-5 text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        );
      case "info":
      default:
        return (
          <svg
            className="w-5 h-5 text-blue-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
        );
    }
  };

  // Klasy tła dla różnych typów powiadomień
  const getToastClasses = (type: ToastProps["type"]) => {
    const baseClasses = "p-4 rounded-md shadow-md flex items-start transition-all";

    switch (type) {
      case "success":
        return `${baseClasses} bg-green-50 border border-green-200 text-green-800`;
      case "error":
        return `${baseClasses} bg-red-50 border border-red-200 text-red-800`;
      case "info":
      default:
        return `${baseClasses} bg-blue-50 border border-blue-200 text-blue-800`;
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col space-y-2 max-w-sm">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={getToastClasses(toast.type)}
          role="alert"
          data-testid={`notification-${toast.type}`}
        >
          <div className="flex-shrink-0 mr-3">{getIcon(toast.type)}</div>
          <div className="flex-grow mr-2">{toast.message}</div>
          <button
            onClick={() => removeToast(toast.id)}
            className="flex-shrink-0 ml-auto"
            aria-label="Zamknij"
            data-testid={`close-notification-${toast.type}`}
          >
            <svg
              className="w-4 h-4 opacity-50 hover:opacity-100"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
}
