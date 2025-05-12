import React, { useState, useMemo, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import type { FlashcardDTO } from '@/types';

interface FlashcardItemProps {
  flashcard: FlashcardDTO;
  onEdit: () => void;
  onDelete: () => void;
}

/**
 * Komponent pojedynczej fiszki
 */
export default function FlashcardItem({ flashcard, onEdit, onDelete }: FlashcardItemProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  
  // Format daty utworzenia - zoptymalizowane przez useMemo
  const formattedDate = useMemo(() => {
    const date = new Date(flashcard.created_at);
    return new Intl.DateTimeFormat('pl-PL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  }, [flashcard.created_at]);
  
  // Określ etykietę źródła - zoptymalizowane przez useMemo
  const sourceInfo = useMemo(() => {
    let label: string;
    let cssClass: string;
    
    switch (flashcard.source) {
      case 'manual':
        label = 'Ręcznie';
        cssClass = 'bg-blue-100 text-blue-800';
        break;
      case 'ai-full':
        label = 'AI';
        cssClass = 'bg-purple-100 text-purple-800';
        break;
      case 'ai-edited':
        label = 'AI (edytowane)';
        cssClass = 'bg-indigo-100 text-indigo-800';
        break;
      default:
        label = flashcard.source;
        cssClass = 'bg-gray-100 text-gray-800';
    }
    
    return { label, cssClass };
  }, [flashcard.source]);
  
  // Handler dla zmiany stanu odwrócenia karty
  const handleFlip = useCallback(() => {
    setIsFlipped(prev => !prev);
  }, []);
  
  // Handlery dla akcji edycji i usunięcia z zapobieganiem propagacji
  const handleEdit = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit();
  }, [onEdit]);
  
  const handleDelete = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete();
  }, [onDelete]);
  
  return (
    <div 
      className={`relative border rounded-lg overflow-hidden h-64 transition-all duration-300 shadow-sm hover:shadow-md ${
        isFlipped ? 'bg-muted/20' : 'bg-card'
      }`}
      data-testid="flashcard-item"
    >
      {/* Przycisk odwracania karty */}
      <button 
        className="absolute top-0 left-0 w-full h-full z-10"
        onClick={handleFlip}
        aria-label={isFlipped ? "Pokaż przód" : "Pokaż tył"}
      >
        <span className="sr-only">
          {isFlipped ? "Pokaż przód" : "Pokaż tył"}
        </span>
      </button>
      
      <div className="p-4 h-full flex flex-col">
        {/* Nagłówek z informacjami o źródle i dacie */}
        <div className="flex justify-between items-start mb-2 z-20 pointer-events-none">
          <span 
            className={`text-xs px-2 py-1 rounded-full ${sourceInfo.cssClass}`}
          >
            {sourceInfo.label}
          </span>
          <span className="text-xs text-muted-foreground">
            {formattedDate}
          </span>
        </div>
        
        {/* Zawartość karty - przód lub tył */}
        <div className="flex-grow flex items-center justify-center overflow-auto">
          <p className="text-lg leading-relaxed">
            {isFlipped ? flashcard.back : flashcard.front}
          </p>
        </div>
        
        {/* Przyciski akcji */}
        <div className="mt-4 flex justify-end gap-2 z-20">
          <Button 
            size="sm" 
            variant="outline" 
            onClick={handleEdit}
            className="pointer-events-auto"
            data-testid="edit-flashcard-button"
          >
            Edytuj
          </Button>
          <Button 
            size="sm" 
            variant="destructive" 
            onClick={handleDelete}
            className="pointer-events-auto"
            data-testid="delete-flashcard-button"
          >
            Usuń
          </Button>
        </div>
      </div>
    </div>
  );
}