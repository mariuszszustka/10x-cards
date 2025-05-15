import { useEffect } from "react";
import type { ReactNode } from "react";

interface AuthGuardProps {
  children: ReactNode;
  isAuthenticated: boolean;
  isLoading: boolean;
  redirectUrl?: string;
}

export default function AuthGuard({
  children,
  isAuthenticated,
  isLoading,
  redirectUrl = "/auth/login",
}: AuthGuardProps) {
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // Przekierowanie do strony logowania
      window.location.href = redirectUrl;
    }
  }, [isAuthenticated, isLoading, redirectUrl]);

  // Podczas ładowania pokazujemy indykator ładowania
  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900">
        <div className="space-y-4 text-center">
          <div className="w-12 h-12 border-t-4 border-b-4 border-blue-300 rounded-full animate-spin mx-auto"></div>
          <p className="text-blue-200">Ładowanie...</p>
        </div>
      </div>
    );
  }

  // Jeśli nie jest zalogowany, nie renderujemy zawartości
  // (i tak nastąpi przekierowanie z useEffect)
  if (!isAuthenticated) {
    return null;
  }

  // Jeśli jest zalogowany, renderujemy dzieci
  return <>{children}</>;
}
