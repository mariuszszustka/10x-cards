import React from 'react';
import { cn } from '@/lib/utils';
import { CreationMode } from './GenerateView';

interface CreationModeToggleProps {
  currentMode: CreationMode;
  onChange: (mode: CreationMode) => void;
}

/**
 * Komponent przełącznika między trybami tworzenia fiszek
 */
export default function CreationModeToggle({ currentMode, onChange }: CreationModeToggleProps) {
  return (
    <div className="inline-flex rounded-md border shadow-sm">
      <button
        type="button"
        className={cn(
          "px-4 py-2 text-sm rounded-l-md",
          currentMode === CreationMode.MANUAL
            ? "bg-primary text-primary-foreground"
            : "bg-background hover:bg-accent hover:text-accent-foreground"
        )}
        onClick={() => onChange(CreationMode.MANUAL)}
      >
        Ręczne tworzenie
      </button>
      <button
        type="button"
        className={cn(
          "px-4 py-2 text-sm rounded-r-md",
          currentMode === CreationMode.AI
            ? "bg-primary text-primary-foreground"
            : "bg-background hover:bg-accent hover:text-accent-foreground"
        )}
        onClick={() => onChange(CreationMode.AI)}
      >
        Generowanie przez AI
      </button>
    </div>
  );
} 