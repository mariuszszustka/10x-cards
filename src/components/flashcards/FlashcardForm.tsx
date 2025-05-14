import React from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { useFlashcardForm, type FlashcardFormData } from '@/lib/hooks/useFlashcardForm';

interface FlashcardFormProps {
  onSubmit: (data: FlashcardFormData) => void;
  onCancel?: () => void;
  initialValues?: FlashcardFormData;
  isSubmitting?: boolean;
}

export default function FlashcardForm({ 
  onSubmit, 
  onCancel, 
  initialValues,
  isSubmitting = false
}: FlashcardFormProps) {
  const {
    formData,
    errors,
    frontInputRef,
    handleChange,
    handleSubmit,
    handleCancel
  } = useFlashcardForm({
    initialValues,
    onSubmit,
    onCancel
  });

  return (
    <form onSubmit={handleSubmit} className="border rounded-lg p-4 shadow flex flex-col h-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Nowa fiszka</h2>
        {onCancel && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handleCancel}
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
            className={`w-full p-2 border rounded-md h-24 resize-none text-foreground ${
              errors.front ? 'border-red-500' : 'border-gray-300'
            } bg-card`}
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
            className={`w-full p-2 border rounded-md h-24 resize-none text-foreground ${
              errors.back ? 'border-red-500' : 'border-gray-300'
            } bg-card`}
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
            className="w-full p-2 border border-gray-300 rounded-md text-foreground bg-card"
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