import React from 'react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  onAddClick: () => void;
}

/**
 * Komponent nagłówka dla widoku fiszek
 */
export default function Header({ onAddClick }: HeaderProps) {
  return (
    <div className="flex items-center justify-between mb-8">
      <h1 className="text-3xl font-bold">Moje Fiszki</h1>
      <Button onClick={onAddClick} size="default">
        Dodaj fiszkę
      </Button>
    </div>
  );
} 