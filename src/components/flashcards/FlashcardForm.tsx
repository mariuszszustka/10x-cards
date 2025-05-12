import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

export interface FlashcardFormData {
  front: string;
  back: string;
  source: string;
}

interface FlashcardFormProps {
  onSubmit: (data: FlashcardFormData) => void;
  onCancel?: () => void;
  initialValues?: FlashcardFormData;
  isSubmitting?: boolean;
}

export default function FlashcardForm({ 
  onSubmit, 
  onCancel, 
  initialValues = { front: '', back: '', source: 'manual' },
  isSubmitting = false
}: FlashcardFormProps) {
  // Stan formularza
  const [formData, setFormData] = useState({
    front: initialValues.front,
    back: initialValues.back,
    source: initialValues.source
  });
  
  // Stan błędów
  const [errors, setErrors] = useState({
    front: '',
    back: ''
  });

  // Referencja do pierwszego pola dla dostępności
  const frontInputRef = useRef<HTMLTextAreaElement>(null);

  // Ustawienie fokusu na pierwsze pole po załadowaniu
  useEffect(() => {
    if (frontInputRef.current) {
      frontInputRef.current.focus();
    }
  }, []);

  // Obsługa zmiany pól formularza
  const handleChange = useCallback((
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Walidacja
    if (name === 'front' || name === 'back') {
      if (!value.trim()) {
        setErrors(prev => ({
          ...prev,
          [name]: 'To pole jest wymagane'
        }));
      } else if (value.length > 500) {
        setErrors(prev => ({
          ...prev,
          [name]: 'Tekst nie może przekraczać 500 znaków'
        }));
      } else {
        setErrors(prev => ({
          ...prev,
          [name]: ''
        }));
      }
    }
  }, []);

  // Obsługa zapisu fiszki
  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    
    // Walidacja przed zapisem
    const newErrors = {
      front: '',
      back: ''
    };
    
    if (!formData.front.trim()) {
      newErrors.front = 'To pole jest wymagane';
    }
    
    if (!formData.back.trim()) {
      newErrors.back = 'To pole jest wymagane';
    }
    
    if (newErrors.front || newErrors.back) {
      setErrors(newErrors);
      return;
    }
    
    onSubmit(formData);
    
    // Reset formularza po wysłaniu
    setFormData({
      front: '',
      back: '',
      source: 'manual'
    });
    
    setErrors({
      front: '',
      back: ''
    });
    
    // Przywrócenie fokusu na pierwszy input
    if (frontInputRef.current) {
      frontInputRef.current.focus();
    }
  }, [formData, onSubmit]);

  return (
    <form onSubmit={handleSubmit} className="border rounded-lg p-4 shadow flex flex-col h-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Nowa fiszka</h2>
        {onCancel && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onCancel}
            aria-label="Zamknij formularz"
          >
            <X size={18} />
          </Button>
        )}
      </div>

      <div className="space-y-4 flex-grow">
        <div>
          <label htmlFor="front" className="block text-sm font-medium mb-1">
            Przód
          </label>
          <textarea
            ref={frontInputRef}
            id="front"
            name="front"
            value={formData.front}
            onChange={handleChange}
            className={`w-full p-2 border rounded-md h-24 resize-none ${
              errors.front ? 'border-red-500' : 'border-gray-300'
            }`}
            aria-invalid={!!errors.front}
            aria-describedby={errors.front ? "front-error" : undefined}
            data-testid="flashcard-front-input"
          />
          {errors.front && (
            <p id="front-error" className="text-sm text-red-500 mt-1">
              {errors.front}
            </p>
          )}
        </div>
        
        <div>
          <label htmlFor="back" className="block text-sm font-medium mb-1">
            Tył
          </label>
          <textarea
            id="back"
            name="back"
            value={formData.back}
            onChange={handleChange}
            className={`w-full p-2 border rounded-md h-24 resize-none ${
              errors.back ? 'border-red-500' : 'border-gray-300'
            }`}
            aria-invalid={!!errors.back}
            aria-describedby={errors.back ? "back-error" : undefined}
            data-testid="flashcard-back-input"
          />
          {errors.back && (
            <p id="back-error" className="text-sm text-red-500 mt-1">
              {errors.back}
            </p>
          )}
        </div>
        
        <div>
          <label htmlFor="source" className="block text-sm font-medium mb-1">
            Źródło
          </label>
          <select
            id="source"
            name="source"
            value={formData.source}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md bg-white"
          >
            <option value="manual">Ręcznie dodane</option>
            <option value="imported">Zaimportowane</option>
            <option value="ai">Wygenerowane przez AI</option>
          </select>
        </div>
      </div>
      
      <div className="flex justify-end mt-4">
        <Button type="submit" disabled={isSubmitting} data-testid="save-flashcard-button">
          {isSubmitting ? 'Zapisywanie...' : 'Dodaj fiszkę'}
        </Button>
      </div>
    </form>
  );
} 