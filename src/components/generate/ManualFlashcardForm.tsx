import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

interface FlashcardCreateDto {
  front: string;
  back: string;
}

interface ManualFlashcardFormProps {
  onSubmit: (flashcard: FlashcardCreateDto) => Promise<void>;
  isSubmitting?: boolean;
}

/**
 * Komponent formularza do ręcznego tworzenia fiszek
 */
export default function ManualFlashcardForm({ onSubmit, isSubmitting = false }: ManualFlashcardFormProps) {
  const [flashcard, setFlashcard] = useState<FlashcardCreateDto>({
    front: '',
    back: ''
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const MAX_FRONT_LENGTH = 200;
  const MAX_BACK_LENGTH = 500;
  
  /**
   * Walidacja formularza
   */
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    // Walidacja przodu fiszki
    if (!flashcard.front.trim()) {
      newErrors.front = 'Przód fiszki jest wymagany';
    } else if (flashcard.front.length > MAX_FRONT_LENGTH) {
      newErrors.front = `Przód fiszki nie może być dłuższy niż ${MAX_FRONT_LENGTH} znaków`;
    }
    
    // Walidacja tyłu fiszki
    if (!flashcard.back.trim()) {
      newErrors.back = 'Tył fiszki jest wymagany';
    } else if (flashcard.back.length > MAX_BACK_LENGTH) {
      newErrors.back = `Tył fiszki nie może być dłuższy niż ${MAX_BACK_LENGTH} znaków`;
    }
    
    // Aktualizacja stanu błędów
    setErrors(newErrors);
    
    // Zwraca true jeśli nie ma błędów
    return Object.keys(newErrors).length === 0;
  };
  
  /**
   * Obsługa zmiany pola formularza
   */
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFlashcard(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Czyszczenie błędu dla zmienionego pola
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  /**
   * Obsługa wysłania formularza
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Walidacja formularza przed wysłaniem
    if (!validateForm()) {
      return;
    }
    
    try {
      await onSubmit(flashcard);
      // Czyszczenie formularza po udanym zapisie
      handleReset();
    } catch (error) {
      console.error('Błąd podczas zapisywania fiszki:', error);
      // Błąd zostanie obsłużony w komponencie rodzica
    }
  };
  
  /**
   * Obsługa czyszczenia formularza
   */
  const handleReset = () => {
    setFlashcard({ front: '', back: '' });
    setErrors({});
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <label htmlFor="front" className="block text-sm font-medium">
          Przód fiszki
        </label>
        <div className="relative">
          <textarea
            id="front"
            name="front"
            value={flashcard.front}
            onChange={handleChange}
            className={`w-full min-h-[100px] p-3 rounded-md border text-foreground ${
              errors.front ? 'border-destructive' : 'border-input'
            } bg-card`}
            placeholder="Wprowadź tekst dla przodu fiszki..."
            disabled={isSubmitting}
          />
          <div className="absolute bottom-2 right-2 text-xs text-muted-foreground">
            {flashcard.front.length}/{MAX_FRONT_LENGTH}
          </div>
        </div>
        {errors.front && (
          <p className="text-sm text-destructive">{errors.front}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <label htmlFor="back" className="block text-sm font-medium">
          Tył fiszki
        </label>
        <div className="relative">
          <textarea
            id="back"
            name="back"
            value={flashcard.back}
            onChange={handleChange}
            className={`w-full min-h-[200px] p-3 rounded-md border text-foreground ${
              errors.back ? 'border-destructive' : 'border-input'
            } bg-card`}
            placeholder="Wprowadź tekst dla tyłu fiszki..."
            disabled={isSubmitting}
          />
          <div className="absolute bottom-2 right-2 text-xs text-muted-foreground">
            {flashcard.back.length}/{MAX_BACK_LENGTH}
          </div>
        </div>
        {errors.back && (
          <p className="text-sm text-destructive">{errors.back}</p>
        )}
      </div>
      
      <div className="flex justify-end gap-3">
        <Button 
          type="button" 
          variant="outline" 
          onClick={handleReset}
          disabled={isSubmitting}
          className="text-secondary-foreground"
        >
          Wyczyść
        </Button>
        <Button 
          type="submit" 
          disabled={isSubmitting || Object.keys(errors).length > 0}
        >
          {isSubmitting ? 'Zapisywanie...' : 'Zapisz fiszkę'}
        </Button>
      </div>
    </form>
  );
} 