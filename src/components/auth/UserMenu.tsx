import { useState, useRef, useEffect } from "react";
import { Button } from "../ui/button";

interface UserMenuProps {
  user: {
    email: string;
  } | null;
  onLogout?: () => void;
}

export default function UserMenu({ user, onLogout }: UserMenuProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const openMenu = () => {
    // Wyczyść timeout zamknięcia, jeśli istnieje
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsMenuOpen(true);
  };

  const closeMenuWithDelay = () => {
    // Ustaw opóźnienie zamknięcia, aby użytkownik miał czas przemieścić mysz do menu
    timeoutRef.current = setTimeout(() => {
      setIsMenuOpen(false);
    }, 300); // 300ms opóźnienia
  };

  const cancelCloseMenu = () => {
    // Anuluj zamknięcie, jeśli użytkownik wrócił do menu
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
    setIsMenuOpen(false);
  };

  // Czyszczenie timeout przy odmontowaniu komponentu
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Gdy użytkownik nie jest zalogowany, pokazujemy przyciski logowania i rejestracji
  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <a href="/auth/login">
          <Button
            variant="ghost"
            className="text-blue-100 hover:text-white hover:bg-white/10"
            data-testid="header-login-button"
          >
            Zaloguj się
          </Button>
        </a>
        <a href="/auth/register">
          <Button
            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
            data-testid="header-register-button"
          >
            Zarejestruj się
          </Button>
        </a>
      </div>
    );
  }

  // Gdy użytkownik jest zalogowany, pokazujemy menu użytkownika
  return (
    <div className="relative" ref={menuRef} onMouseEnter={openMenu} onMouseLeave={closeMenuWithDelay}>
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 px-3 py-2 rounded-full transition-colors"
        data-testid="user-menu"
      >
        <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full flex items-center justify-center text-white font-medium">
          {user.email.charAt(0).toUpperCase()}
        </div>
        <span className="text-blue-100">{user.email}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-blue-100"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {isMenuOpen && (
        <div
          className="absolute right-0 mt-2 w-48 bg-white/10 backdrop-blur-xl rounded-md shadow-lg border border-white/20 py-1 z-10"
          onMouseEnter={cancelCloseMenu}
          onMouseLeave={closeMenuWithDelay}
        >
          <a href="/profile" className="block px-4 py-2 text-sm text-blue-100 hover:bg-white/10">
            Profil
          </a>
          <button
            onClick={handleLogout}
            className="block w-full text-left px-4 py-2 text-sm text-red-300 hover:bg-white/10"
            data-testid="user-menu-logout"
          >
            Wyloguj się
          </button>
        </div>
      )}
    </div>
  );
}
